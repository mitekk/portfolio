import { useEffect, useState } from "react";
import { CHAR_DELAY_MS } from "../../constants";
import type { Prompt } from "../../types";
import "./prompter.css";

interface PrompterProps {
  prompt: Prompt;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

export const Prompter = ({
  prompt,
  onAnimationFinish,
  onAnimationStart,
}: PrompterProps) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  useEffect(() => {
    if (onAnimationStart && currentLine < prompt.lines.length - 1)
      onAnimationStart();
  }, [onAnimationStart, currentLine, prompt.lines.length]);

  useEffect(() => {
    if (!prompt.lines[currentLine]) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (currentChar < prompt.lines[currentLine].text.length) {
      timeout = setTimeout(() => {
        setTypedText(prompt.lines[currentLine].text.slice(0, currentChar + 1));
        setCurrentChar((idx) => idx + 1);
      }, CHAR_DELAY_MS);
      return () => clearTimeout(timeout);
    } else {
      timeout = setTimeout(() => {
        setCompletedLines((lines) => [
          ...lines,
          prompt.lines[currentLine].text,
        ]);
        setTypedText("");
        setCurrentLine((idx) => idx + 1);

        if (currentLine === prompt.lines.length - 1) {
          if (onAnimationFinish) onAnimationFinish();
        }

        if (currentLine < prompt.lines.length - 1) {
          setCurrentChar(0);
        }
      }, 40);
    }
    return () => clearTimeout(timeout);
  }, [currentChar, currentLine, prompt.lines, onAnimationFinish]);

  return (
    <div className="prompter">
      <div className="h-full">
        <div>
          {completedLines.map((line, idx) => (
            <div key={idx} className="prompt-line prompt-text">
              {line}
              {idx === prompt.lines.length - 1 && (
                <div className="prompt-cursor">|</div>
              )}
            </div>
          ))}
          {!!typedText && (
            <div className="prompt-line">
              <div className="prompt-text">
                {typedText}
                {currentLine < prompt.lines.length && (
                  <div className="prompt-cursor">|</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
