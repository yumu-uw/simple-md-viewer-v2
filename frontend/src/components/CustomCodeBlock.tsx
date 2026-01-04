import { Copy } from "lucide-react";
import { useState } from "react";
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

export const CustomCodeBlock: CodeProps = ({
  className,
  children,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const isBlock = !!match || String(children).includes('\n');

  const classNames = className?.split(":") || ["", ""];
  console.debug(classNames);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // インラインコード
  if (!isBlock) {
    return (
      <code className={classNames[0]} {...props}>
        {children}
      </code>
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
      <SyntaxHighlighter style={oneLight} language={match ? match[1] : ""} PreTag="div">
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};
