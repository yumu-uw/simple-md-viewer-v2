.PHONY: major_release
major_release:
	make build_all
	./package.sh -t major

.PHONY: minor_release
minor_release:
	make build_all
	./package.sh -t minor

.PHONY: patch_release
patch_release:
	make build_all
	./package.sh -t patch

.PHONY: build
build:
	wails build -clean

.PHONY: build_all
build_all:
	wails build -platform=windows/amd64,windows/arm64,darwin/arm64,darwin/amd64 -trimpath -clean

.PHONY: build_darwin_arm64
build_darwin_arm64:
	wails build -platform=darwin/arm64 -trimpath

build_darwin_amd64:
	wails build -platform=darwin/amd64 -trimpath

build_windows_amd64:
	wails build -platform=windows/amd64 -trimpath

build_windows_arm64:
	wails build -platform=windows/arm64 -trimpath