import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export default function StreamedText({ text, onProgress, onDone }) {
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  const wordCount = useMemo(
    () => tokens.filter((t) => !/^\s+$/.test(t)).length,
    [tokens],
  );
  const [revealed, setRevealed] = useState(0);

  // Scale per-word delay so total stream time lands in [2s, 6s].
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

  return (
    <span>
      {tokens.slice(0, revealed).map((tok, i) =>
        /^\s+$/.test(tok) ? (
          <span key={i}>{tok}</span>
        ) : (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: 'blur(1px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ display: 'inline-block' }}
          >
            {tok}
          </motion.span>
        ),
      )}
    </span>
  );
}
