import { Copy } from "lucide-react";
import mermaid from "mermaid";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "./shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./shadcn/ui/tooltip";

type CodeProps = Components["code"];

// Mermaidの初期化
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
});

export const CustomCodeBlock: CodeProps = ({
  className,
  children,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const isBlock = !!match || String(children).includes("\n");
  const mermaidID = useId();

  const classNames = className?.split(":") || ["", ""];
  console.debug(classNames);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mermaidダイアグラム
  const mermaidRender = useCallback(async () => {
    try {
      const { svg } = await mermaid.render(mermaidID, String(children));
      if (mermaidRef.current && children) {
        mermaidRef.current.innerHTML = svg;
      }
    } catch (error) {
      console.error("Mermaid rendering error:", error);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `<pre style="color: red;">Mermaid構文エラー: ${error}</pre>`;
      }
    }
  }, [children, mermaidID]);

  // Mermaidダイアグラムのレンダリング
  useEffect(() => {
    if (language === "mermaid") {
      mermaidRender();
    }
  }, [mermaidRender, language]);

  // インラインコード
  if (!isBlock) {
    return (
      <code className={classNames[0]} {...props}>
        {children}
      </code>
    );
  }

  // Mermaidダイアグラム
  if (language === "mermaid") {
    return (
      <div className="relative">
        {classNames[1] && (
          <small className="text-sm leading-none font-medium bg-gray-300 p-2">
            {classNames[1]}
          </small>
        )}
        <div className="absolute top-0 right-1">
          <TooltipProvider>
            <Tooltip open={copied}>
              <TooltipTrigger asChild>
                <Button size={"sm"} variant={"ghost"} onClick={handleCopy}>
                  <Copy className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>コピーしました</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div
          ref={mermaidRef}
          className="
            mermaid-diagram
            flex justify-center
            bg-white rounded"
        />
      </div>
    );
  }

  // コードブロック
  return (
    <div className="relative">
      {classNames[1] && (
        <small className="text-sm leading-none font-medium bg-gray-300 p-2">
          {classNames[1]}
        </small>
      )}
      <div className="absolute top-0 right-1">
        <TooltipProvider>
          <Tooltip open={copied}>
            <TooltipTrigger asChild>
              <Button size={"sm"} variant={"ghost"} onClick={handleCopy}>
                <Copy className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>コピーしました</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <SyntaxHighlighter
        style={oneLight}
        language={language}
        PreTag="div"
        customStyle={{
          paddingTop: classNames[1] ? "0.5em" : 0,
          paddingBottom: 0,
          background: "transparent",
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};
