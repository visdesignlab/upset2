import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxDeviationSelector } from '../../atoms/maxAtoms';
import translate from '../../utils/transform';
import { AttributeButton } from './AttributeButton';
import { AttributeScale } from './AttributeScale';

export const DeviationHeader = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const maxDeviation = useRecoilValue(maxDeviationSelector);

  return (
    <g>
      <AttributeButton
        label="Deviation"
        tooltip='Measure for how "surprising" the size of an intersection is. This also considers the size of the sets. For more information visit <a href="https://upset.app/advanced/">https://upset.app/advanced/</a>'
      />
      <g
        transform={translate(
          0,
          dimensions.attribute.buttonHeight + dimensions.attribute.gap,
        )}
      >
        <AttributeScale
          domain={[-maxDeviation, maxDeviation]}
          tickFormatter={(val: number) => `${val}%`}
        />
      </g>
    </g>
  );
};
