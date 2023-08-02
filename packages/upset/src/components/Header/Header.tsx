import { AttributeHeaders } from './AttributeHeaders';
import { SizeHeader } from './SizeHeader';
import { DeviationHeader } from './DeviationHeader';
import { MatrixHeader } from './MatrixHeader';
import { CollapseAllButton } from './CollapseAllButton';

export const Header = () => (
  <>
    <CollapseAllButton />
    <MatrixHeader />
    <SizeHeader />
    <DeviationHeader />
    <AttributeHeaders />
  </>
);
