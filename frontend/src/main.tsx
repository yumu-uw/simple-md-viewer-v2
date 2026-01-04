import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "github-markdown-css/github-markdown-light.css";
import App from './App'

// WebViewが新しいウィンドウでファイルを開くのを防ぐ
// runtime.OnFileDropはネイティブレベルで動作するため、これらは影響しない
window.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
}, false)

window.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
}, false)

// ファイルドラッグによるナビゲーションを防ぐ
document.addEventListener('dragenter', (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
}, false)

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
