import { useEffect, useState } from "react";
import { LoadImgBase64 } from "@/../wailsjs/go/main/App";

type Props = {
  mdPath: string;
  src: string;
  alt: string;
  width: string | number | undefined;
  height: string | number | undefined;
};

export default function CustomImg({
  mdPath,
  src,
  alt = "",
  width,
  height,
}: Props) {
  const [srcStr, setSrcStr] = useState("");

  useEffect(() => {
    if (src.startsWith("http://") || src.startsWith("https://")) {
      setSrcStr(src);
      return;
    }
    LoadImgBase64(mdPath, src || "").then(setSrcStr);
  }, [src, mdPath]);
  return <img src={srcStr} alt={alt} width={width} height={height} />;
};
