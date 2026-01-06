package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"simple-md-viewer/model"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) SelectMarkdownFile() model.MDInfo {
	result := model.MDInfo{
		MDPath:   "",
		FileName: "",
	}
	selectedFile, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Markdown",
				Pattern:     "*.md",
			},
		},
	})

	if selectedFile == "" || err != nil {
		return result
	}
	fileName := filepath.Base(selectedFile)
	result.MDPath = selectedFile
	result.FileName = fileName
	return result
}

func (a *App) HandleDropFile(paths []string) {
	log.Println("drop")
	for _, p := range paths {
		if filepath.Ext(p) != ".md" {
			continue
		}
		result := model.MDInfo{
			MDPath:   p,
			FileName: filepath.Base(p),
		}
		runtime.EventsEmit(a.ctx, "mdfile:loaded", result)
	}
}

func (a *App) LoadMD(mdPath string) string {
	data, err := os.ReadFile(mdPath)
	if err != nil {
		return ""
	}

	return string(data)
}

func (a *App) LoadImgBase64(mdpath string, imgpath string) string {
	abspath := a.getAbsPath([]string{mdpath, imgpath})

	bytes, err := os.ReadFile(abspath)
	if err != nil {
		return "error"
	}
	b64str := base64.StdEncoding.EncodeToString(bytes)

	b, err := base64.StdEncoding.DecodeString(b64str)
	if err != nil {
		return "error"
	}
	ext := filepath.Ext(imgpath)
	// SVGのmimetypeが取得出来ないので拡張子で判別
	if ext == ".svg" {
		return fmt.Sprintf("data:%s;base64,%s", "image/svg+xml", base64.StdEncoding.EncodeToString(bytes))
	}
	// SVG以外のmimetype
	return fmt.Sprintf("data:%s;base64,%s", http.DetectContentType(b), base64.StdEncoding.EncodeToString(bytes))
}

// 画像ファイルの絶対パスを取得
func (a *App) getAbsPath(paths []string) string {
	d := filepath.Dir(paths[0])
	os.Chdir(d)
	abspath, _ := filepath.Abs(paths[1])
	return abspath
}
