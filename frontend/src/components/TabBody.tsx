import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LoadMD, SelectMarkdownFile } from "@/../wailsjs/go/main/App";
import { Button } from "./shadcn/ui/button";

type Props = {
  mdPath?: string;
};

export default function TabBody({ mdPath }: Props) {
  const [selectedMDPath, setSelectedMDPath] = useState("");
  const [content, setContent] = useState("");

  const handleOpenClick = async () => {
    const p = await SelectMarkdownFile();
    if (p && p !== "") {
      setSelectedMDPath(p);
    }
    LoadMD(p).then((c) => {
      setContent(c);
    });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run on mount
  useEffect(() => {
    if (mdPath && mdPath !== "") {
      LoadMD(mdPath).then((c) => {
        setSelectedMDPath(mdPath);
        setContent(c);
      });
    }
  }, []);

  return (
    <div>
      {selectedMDPath === "" ? (
        <Button onClick={handleOpenClick}>Open</Button>
      ) : (
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      )}
    </div>
  );
}
