import React from 'react'
import { Parser, ProcessNodeDefinitions } from 'html-to-react'
import Highlight from 'react-highlight'
import CopyButton from './CopyButton'

const HtmlParser = (content) => {
  const htmlToReactParser = new Parser()
  const processNodeDefinitions = new ProcessNodeDefinitions(React)

  return htmlToReactParser.parseWithInstructions(
    content,
    () => true,
    [
      {
        replaceChildren: true,
        shouldProcessNode: (node) => node.name && node.name === 'pre',
        processNode: (node, children) => (
            <div className='code-block'>
              <Highlight {...node.attribs}>
                {children[0].props.children}
              </Highlight>
              <CopyButton data={children[0].props.children} />
            </div>
          ),
      },
      {
        shouldProcessNode: () => true,
        processNode: processNodeDefinitions.processDefaultNode,
      },
    ],
  )
}

export default HtmlParser
