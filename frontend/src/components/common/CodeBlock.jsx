import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LuCopy, LuCheck, LuCode } from 'react-icons/lu';

const CodeBlock = ({ language = 'javascript', children, showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);

  const codeString = String(children || '').replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <div className="code-language-tag">
          <LuCode size={13} style={{ color: '#38bdf8' }} />
          <span>{language}</span>
        </div>
        <button
          className={`code-copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <LuCheck size={13} style={{ color: '#10b981' }} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <LuCopy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="code-content-wrapper">
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '16px',
            background: '#090d16',
            fontSize: '13px',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineHeight: 1.6
          }}
          lineNumberStyle={{
            color: '#475569',
            minWidth: '2.5em',
            paddingRight: '1em',
            userSelect: 'none'
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;

