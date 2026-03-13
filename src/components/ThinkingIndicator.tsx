import { useState, useEffect } from "react";

const thinkingSteps = [
  "Pensando...",
  "Analisando sua pergunta...",
  "Buscando informações...",
  "Organizando a resposta...",
  "Elaborando os detalhes...",
  "Refinando a resposta...",
];

const ThinkingIndicator = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (elapsed >= 3) {
      const stepInterval = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % thinkingSteps.length);
      }, 3000);
      return () => clearInterval(stepInterval);
    }
  }, [elapsed >= 3]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: "0ms" }} />
        <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: "200ms" }} />
        <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: "400ms" }} />
      </div>
      {elapsed >= 2 && (
        <p className="text-xs text-muted-foreground animate-fade-in">
          {thinkingSteps[stepIndex]}
        </p>
      )}
    </div>
  );
};

export default ThinkingIndicator;
