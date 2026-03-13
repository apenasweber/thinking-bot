import { useState, useRef, useEffect } from "react";
import { streamChat, type Msg } from "@/lib/streamChat";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatLogo from "@/components/ChatLogo";
import { toast } from "sonner";

const Index = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (input: string) => {
    const userMsg: Msg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Erro ao conectar com a IA");
      setIsLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
            <ChatLogo size="md" />
            <h1 className="text-2xl font-semibold text-foreground">
              Como posso ajudar?
            </h1>
          </div>
        ) : (
          <div className="pt-4 pb-4">
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                role={msg.role}
                content={msg.content}
                isThinking={
                  isLoading &&
                  i === messages.length - 1 &&
                  msg.role === "assistant"
                }
              />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <ChatMessage role="assistant" content="" isThinking />
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <ChatInput onSend={send} disabled={isLoading} />
    </div>
  );
};

export default Index;
