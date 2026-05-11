import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, CheckMark } from '../icons/Icons';
import Tooltip from '../Tooltip';

export default function CodeBlock({ language = 'text', children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="doc-code">
      <header className="doc-code__header">
        <span className="doc-code__lang type-small-body-14">{language}</span>
        <Tooltip label={copied ? 'Copied' : 'Copy'} placement="top">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            className="doc-code__copy"
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="doc-code__copy-icon"
                >
                  <CheckMark />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="doc-code__copy-icon"
                >
                  <Copy />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </Tooltip>
      </header>
      <pre className="doc-code__pre"><code className="doc-code__code">{children}</code></pre>
    </div>
  );
}
