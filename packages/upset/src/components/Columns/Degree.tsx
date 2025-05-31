import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';

/**
 * Props for the Degree component.
 * degree: The degree value for the row.
 */
type Props = {
  degree: number;
};

/**
 * Renders the degree component.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {number} props.degree - The degree value for the row.
 * @returns {JSX.Element} The rendered degree component.
 */
export const Degree: FC<Props> = ({ degree }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  return (
    <g
      transform={translate(
        dimensions.degreeColumn.width / 2 + -6, // shift the text left to better center align it
        dimensions.body.rowHeight / 2 + 5,
      )}
    >
      <text>{degree > -1 && degree}</text>
    </g>
  );
};
