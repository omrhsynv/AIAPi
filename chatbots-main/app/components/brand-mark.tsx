import { Bot } from "lucide-react";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  showBot?: boolean;
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-16 w-16",
};

export function BrandMark({ size = "md", showBot = false }: BrandMarkProps) {
  return (
    <div
      className={`${sizeClasses[size]} aris-mark relative grid place-items-center shrink-0`}
      aria-hidden="true"
    >
      <span className="aris-ray aris-ray-a" />
      <span className="aris-ray aris-ray-b" />
      <span className="aris-ray aris-ray-c" />
      {showBot && <Bot className="relative z-10 h-1/2 w-1/2 text-white drop-shadow" />}
    </div>
  );
}
