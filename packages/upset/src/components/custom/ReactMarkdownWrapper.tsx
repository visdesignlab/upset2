import { Typography } from '@mui/material';
import type { ComponentProps } from 'react';
import Markdown from 'react-markdown';

function MarkdownHeading(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { node, ...props }: { node: any },
) {
  return <h3 id={node.children[0].value} {...props} />;
}

function MarkdownParagraph(props: ComponentProps<typeof Typography>) {
  return <Typography {...props} />;
}

function MarkdownList(props: ComponentProps<'ul'>) {
  return (
    <ul
      {...props}
      // Matches the MUI typography style used for p elements
      style={{ paddingLeft: '20px', lineHeight: 1.5, fontSize: '0.9rem' }}
    />
  );
}

const markdownComponents = {
  h1: MarkdownHeading,
  p: MarkdownParagraph,
  ul: MarkdownList,
};

// Wrapper for the Markdown component to parse and render the alt-txt json
export default function ReactMarkdownWrapper({ text }: { text: string }) {
  return <Markdown components={markdownComponents}>{text}</Markdown>;
}
