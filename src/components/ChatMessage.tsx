import ReactMarkdown from "react-markdown";
import ChatLogo from "./ChatLogo";
import ThinkingIndicator from "./ThinkingIndicator";
import { User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isThinking?: boolean;
}

const ChatMessage = ({ role, content, isThinking }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`py-6 ${isUser ? "" : ""}`}>
      <div className="max-w-3xl mx-auto flex gap-4 px-4">
        {isUser ? (
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
            <User size={16} className="text-secondary-foreground" />
          </div>
        ) : (
          <div className="mt-0.5">
            <ChatLogo isThinking={isThinking && !content} size="sm" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            {isUser ? "Você" : "Assistente"}
          </p>
          {isThinking && !content ? (
            <ThinkingIndicator />
          ) : (
            <div className="chat-prose text-sm">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
