import React from 'react';
import MarkdownRenderer from './common/MarkdownRenderer';

function Message({ text }) {
  return (
    <div className="message-box">
      <MarkdownRenderer content={text} />
    </div>
  );
}

export default Message;
