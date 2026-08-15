import type { ReactElement } from "react";

type TextProps = {
  type?: "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
  children: string | ReactElement;
};

function Text({ children, type = "p", className = "" }: TextProps) {
  if (type === "h1") return <h1 className={`${className}`}>{children}</h1>;
  if (type === "h2")
    return (
      <h2 className={`text-3xl font-semibold ${className}`}>{children}</h2>
    );
  if (type === "h3")
    return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
  if (type === "h4") return <h4 className={`${className}`}>{children}</h4>;

  return <p className={`text-base ${className}`}>{children}</p>;
}

export default Text;
