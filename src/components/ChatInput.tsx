import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pb-4">
      <div className="relative bg-[hsl(var(--chat-input-bg))] rounded-2xl border border-border focus-within:border-primary/50 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Envie uma mensagem..."
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent resize-none px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none scrollbar-thin"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className="absolute right-2 bottom-2 h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <ArrowUp size={18} />
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground text-center mt-2">
        IA pode cometer erros. Verifique informações importantes.
      </p>
    </div>
  );
};

export default ChatInput;
