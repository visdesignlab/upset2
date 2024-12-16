import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import Group from './Group';
import { columnHoverAtom, columnSelectAtom } from '../../atoms/highlightAtom';
import { hoverHighlight } from '../../utils/styles';

type Props = {
  setId: string;
  name: string;
};

export const SetLabel: FC<Props> = ({ setId, name }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const columnHover = useRecoilValue(columnHoverAtom);
  const columnSelect = useRecoilValue(columnSelectAtom);

  const gap = 4;

  return (
    <Group tx={0} ty={dimensions.set.size.height}>
      <rect
        className={setId}
        css={
          (columnHover.includes(setId) || columnSelect.includes(setId)) ?
            hoverHighlight : undefined
        }
        height={dimensions.set.label.height - gap}
        width={dimensions.set.width - gap / 2}
        fill="#f0f0f0"
        fillOpacity="1.0"
        transform={`${translate(
          gap / 4,
          gap,
        )}`}
      />
      <foreignObject
        transform={`${translate(0, dimensions.set.label.height - 2)}rotate(-90)`}
        height={dimensions.set.width}
        width={dimensions.set.label.height}
        z={100}
        style={{
          color: '#000000',
          fontSize: '14px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}

      >
        <p style={{
          height: '100%',
          padding: '0',
          margin: '2px 0 0 0',
          fontWeight: '500',
          textAlign: 'start',
        }}
        >
          {name}
        </p>
      </foreignObject>
    </Group>
  );
};
