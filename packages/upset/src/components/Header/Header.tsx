import { AttributeHeaders } from './AttributeHeaders';
import { SizeHeader } from './SizeHeader';
import { MatrixHeader } from './MatrixHeader';
import { CollapseAllButton } from './CollapseAllButton';

export const Header = () => (
  <>
    <CollapseAllButton />
    <MatrixHeader />
    <SizeHeader />
    <AttributeHeaders />
  </>
);
