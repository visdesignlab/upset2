import { AttributeHeaders } from './AttributeHeaders';
import { SizeHeader } from './SizeHeader';
import { MatrixHeader } from './MatrixHeader';
import { CollapseAllButton } from './CollapseAllButton';
import { QueryButton } from './QueryButton';

export const Header = () => (
  <>
    <QueryButton />
    <CollapseAllButton />
    <MatrixHeader />
    <SizeHeader />
    <AttributeHeaders />
  </>
);
