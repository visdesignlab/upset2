import { Typography, Divider } from '@mui/material';
import { CSSProperties, FC, PropsWithChildren } from 'react';

/**
 * The level of the heading
 */
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

/**
 * Props for UpsetHeading
 * @private Style props can be added here as needed
 */
type Props = {
  /** The heading level: only supports up to h4 */
  level: HeadingLevel;
  /** Left padding for the typography */
  paddingLeft?: string;
  /** CSS for the wrapper div */
  divStyle?: CSSProperties;
  /** CSS for the h element */
  headingStyle?: CSSProperties;
  /** Whether to hide the divider at the bottom */
  hideDivider?: boolean;
};

/**
 * Maps heading levels to styles for the corresponding typography elements
 */
const LEVELS: { [level in HeadingLevel]: { fontSize: string } } = {
  h1: { fontSize: '1.6em' },
  h2: { fontSize: '1.4em' },
  h3: { fontSize: '1.2em' },
  h4: { fontSize: '1.0em' },
};

/**
 * A heading for use in the UI; keeps styles consistent
 */
export const UpsetHeading: FC<PropsWithChildren<Props>> = ({
  level,
  paddingLeft,
  divStyle,
  headingStyle,
  children,
  hideDivider = false,
}) => {
  const IS_MAJOR = level === 'h1' || level === 'h2' || level === 'h3';

  return (
    <div style={{ marginBottom: '.5em', ...divStyle }}>
      <Typography
        variant={level}
        fontSize={LEVELS[level].fontSize}
        fontWeight="inherit"
        gutterBottom={level === 'h1'}
        paddingLeft={paddingLeft}
        style={{ ...headingStyle }}
      >
        {children}
      </Typography>
      {IS_MAJOR && !hideDivider && (
        <Divider style={{ width: '100%', margin: '0 auto' }} aria-hidden />
      )}
    </div>
  );
};
