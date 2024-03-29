import { AttributeHeaders } from './AttributeHeaders';
import { DegreeHeader } from './DegreeHeader';
import { SizeHeader } from './SizeHeader';
import { DeviationHeader } from './DeviationHeader';
import { MatrixHeader } from './MatrixHeader';
import { CollapseAllButton } from './CollapseAllButton';

export const Header = () => (
  <>
    <CollapseAllButton />
    <MatrixHeader />
    <DegreeHeader />
    <SizeHeader />
    <DeviationHeader />
    <AttributeHeaders />
  </>
);
