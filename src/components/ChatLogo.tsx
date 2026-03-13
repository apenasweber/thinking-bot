import { Sparkles } from "lucide-react";

interface ChatLogoProps {
  isThinking?: boolean;
  size?: "sm" | "md";
}

const ChatLogo = ({ isThinking = false, size = "md" }: ChatLogoProps) => {
  const sizeClasses = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? 16 : 20;

  return (
    <div
      className={`${sizeClasses} rounded-full bg-primary flex items-center justify-center shrink-0 ${
        isThinking ? "animate-pulse-glow" : ""
      }`}
    >
      <Sparkles size={iconSize} className="text-primary-foreground" />
    </div>
  );
};

export default ChatLogo;
