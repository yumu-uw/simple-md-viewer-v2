import { BrowserOpenURL } from "@/../wailsjs/runtime/runtime";

type Props = {
  href?: string;
  children?: React.ReactNode;
};

export default function CustomAnchor({ href, children }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        if (href) BrowserOpenURL(href);
      }}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        color: "blue",
        textDecoration: "underline",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}