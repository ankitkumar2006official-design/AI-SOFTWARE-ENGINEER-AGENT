import ReactMarkdown from 'react-markdown'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { FaCopy } from 'react-icons/fa'

function Message({ text }) {

  const copyCode = (code) => {

    navigator.clipboard.writeText(code)
  }

  return (

    <div className="message-box">

      <ReactMarkdown

        components={{
            code({ inline, className, children, ...props }) {

            const match = /language-(\w+)/.exec(className || '')

            const codeString = String(children).replace(/\n$/, '')

            return !inline && match ? (

              <div className="code-block">

                <button
                  className="copy-btn"
                  onClick={() => copyCode(codeString)}
                >
                  <FaCopy /> Copy
                </button>

                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>

              </div>
            ) : (

              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {text}
      </ReactMarkdown>

    </div>
  )
}

export default Message