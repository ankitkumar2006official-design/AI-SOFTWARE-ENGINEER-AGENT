import React from 'react';
import { LuLoader } from 'react-icons/lu';

function Loader({ text = 'AI is thinking...' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--accent-cyan)' }}>
      <LuLoader size={16} className="spinning" />
      <span>{text}</span>
    </div>
  );
}

export default Loader;
