import { Typography } from '@mui/material';
import Markdown from 'react-markdown';

// Wrapper for the Markdown component to parse and render the alt-txt json
export default function ReactMarkdownWrapper({ text }: { text: string }) {
  const components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: ({ node, ...props }: { node: any }) => (
      <h3 id={node.children[0].value} {...props} />
    ),
    p: ({ ...props }) => <Typography {...props} />,
    ul: ({ ...props }) => (
      <ul
        {...props}
        // Matches the MUI typography style used for p elements
        style={{ paddingLeft: '20px', lineHeight: 1.5, fontSize: '0.9rem' }}
      />
    ),
  };

  return <Markdown components={components}>{text}</Markdown>;
}
