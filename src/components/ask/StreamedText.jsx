import { useEffect, useMemo, useState } from 'react';

export default function StreamedText({ text, onProgress, onDone }) {
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  const wordCount = useMemo(
    () => tokens.filter((t) => !/^\s+$/.test(t)).length,
    [tokens],
  );
  const [revealed, setRevealed] = useState(0);

  // Scale per-word delay so total stream time lands in [0.8s, 3s].
  // Short replies feel deliberate; long replies don't drag on.
  const targetTotalMs = Math.min(3000, Math.max(800, wordCount * 90));
  const baseDelay = wordCount > 0 ? targetTotalMs / wordCount : 60;
  const jitter = baseDelay * 0.6;

  useEffect(() => {
    setRevealed(0);
  }, [text]);

  useEffect(() => {
    if (revealed >= tokens.length) {
      onDone?.();
      return;
    }
    const isWhitespace = /^\s+$/.test(tokens[revealed] ?? '');
    const delay = isWhitespace
      ? 0
      : baseDelay - jitter / 2 + Math.random() * jitter;
    const id = setTimeout(() => {
      setRevealed((n) => n + 1);
      onProgress?.();
    }, delay);
    return () => clearTimeout(id);
  }, [revealed, tokens, onProgress, onDone, baseDelay, jitter]);

  // Append plain text so each word is readable immediately. Per-word blur and
  // opacity animations overlap at this cadence and make the stream flash.
  return <span>{tokens.slice(0, revealed).join('')}</span>;
}
