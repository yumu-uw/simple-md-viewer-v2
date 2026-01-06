import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { LoadMD } from "@/../wailsjs/go/main/App";
import CustomAnchor from "./CustomAnchor";
import { CustomCodeBlock } from "./CustomCodeBlock";
import CustomImg from "./CustomImg";
import { ScrollArea } from "./shadcn/ui/scroll-area";

type Props = {
  mdPath: string;
};

export default function TabBody({ mdPath }: Props) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (mdPath && mdPath !== "") {
      LoadMD(mdPath).then((c) => {
        console.info("Loaded markdown content from:", mdPath);
        setContent(c);
      });
    }
  }, [mdPath]);

  return (
    <ScrollArea className="h-full w-full p-4">
      <div className="markdown-body">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            code: CustomCodeBlock,
            a: CustomAnchor,
            img(props) {
              const { src, alt, width, height } = props;
              return (
                <CustomImg
                  mdPath={mdPath}
                  src={src as string}
                  alt={alt as string}
                  width={width}
                  height={height}
                />
              );
            },
          }}
        >
          {content}
        </Markdown>
      </div>
    </ScrollArea>
  );
}
