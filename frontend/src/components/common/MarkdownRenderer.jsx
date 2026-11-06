import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

/**
 * Splits text into markdown blocks and markdown tables.
 * Handles single-line table concatenations (e.g. `||` as row separators).
 */
function parseContentWithTables(rawContent) {
  if (!rawContent) return [];
  
  // Normalize row separators (e.g. || or | |) into newlines
  const content = rawContent
    .replace(/\r\n/g, '\n')
    .replace(/\|\s*\|(?=[^|])/g, '|\n|');

  const lines = content.split('\n');
  const sections = [];
  let currentText = [];
  let currentTable = null;

  for (let i = 0; i < lines.length; i++) {
    let trimmed = lines[i].trim();
    
    // Check if line is a table row
    const isTableRow = trimmed.startsWith('|') && trimmed.includes('|') && trimmed.length > 2;

    if (isTableRow) {
      if (!trimmed.endsWith('|')) trimmed = trimmed + ' |';
      if (!trimmed.startsWith('|')) trimmed = '| ' + trimmed;

      if (currentText.length > 0) {
        sections.push({ type: 'markdown', content: currentText.join('\n') });
        currentText = [];
      }
      if (!currentTable) currentTable = [];
      currentTable.push(trimmed);
    } else {
      if (currentTable) {
        sections.push({ type: 'table', raw: currentTable });
        currentTable = null;
      }
      currentText.push(lines[i]);
    }
  }

  if (currentTable) sections.push({ type: 'table', raw: currentTable });
  if (currentText.length > 0) sections.push({ type: 'markdown', content: currentText.join('\n') });

  return sections;
}

/**
 * Renders a parsed Markdown table as a modern dark table
 */
const TableBlock = ({ raw }) => {
  if (!raw || raw.length === 0) return null;
  const rows = raw.map((line) => line.split('|').slice(1, -1).map((c) => c.trim()));
  const header = rows[0] || [];
  const bodyRows = rows.slice(1).filter((r) => !r.every((c) => /^[:\-\s]+$/.test(c)));

  return (
    <div className="table-responsive-wrapper">
      <table className="modern-markdown-table">
        <thead>
          <tr>
            {header.map((col, idx) => (
              <th key={idx}>
                <ReactMarkdown>{col}</ReactMarkdown>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>
                  <ReactMarkdown>{cell}</ReactMarkdown>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const sections = parseContentWithTables(content);

  return (
    <div className="markdown-body">
      {sections.map((section, sIdx) => {
        if (section.type === 'table') {
          return <TableBlock key={sIdx} raw={section.raw} />;
        }

        return (
          <ReactMarkdown
            key={sIdx}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';

                if (!inline && (match || String(children).includes('\n'))) {
                  return (
                    <CodeBlock language={language || 'text'} showLineNumbers={true}>
                      {children}
                    </CodeBlock>
                  );
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {section.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
