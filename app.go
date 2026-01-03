package main

import (
	"context"
	"os"
	"path/filepath"
	"simple-md-viewer/model"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
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

	runtime.OnFileDrop(ctx, func(x, y int, paths []string) {
		for _, p := range paths {
			if filepath.Ext(p) != ".md" {
				continue
			}
			result := model.MDInfo{
				MDPath:   p,
				FileName: filepath.Base(p),
			}
			rt.EventsEmit(a.ctx, "mdfile:loaded", result)
		}
	})
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

func (a *App) LoadMD(mdPath string) string {
	data, err := os.ReadFile(mdPath)
	if err != nil {
		return ""
	}

	return string(data)
}
