import { AttributeHeaders } from './AttributeHeaders';
import { DegreeHeader } from './DegreeHeader';
import { SizeHeader } from './SizeHeader';
import { MatrixHeader } from './MatrixHeader';
import { CollapseAllButton } from './CollapseAllButton';

export const Header = () => (
  <>
    <CollapseAllButton />
    <MatrixHeader />
    <DegreeHeader />
    <SizeHeader />
    <AttributeHeaders />
  </>
);
