import { Typography } from '@mui/material';
import Markdown from 'react-markdown';

// Wrapper for the Markdown component to parse and render the alt-txt json
export default function ReactMarkdownWrapper({ text }: { text: string }) {
  const components = {
    // eslint-disable-next-line react/no-unstable-nested-components, jsx-a11y/heading-has-content
    h1: ({ node, ...props }: { node: any }) => <h3 id={node.children[0].value} {...props} />,
    // eslint-disable-next-line react/no-unstable-nested-components, jsx-a11y/heading-has-content
    p: ({ node, ...props }: { node: any }) => <Typography {...props} />,
  };

  return (
    <Markdown components={components}>{text}</Markdown>
  );
}
