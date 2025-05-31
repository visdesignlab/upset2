import { useRecoilValue } from 'recoil';
import { isPopulatedSetQuery } from '@visdesignlab/upset2-core';
import { AttributeHeaders } from './AttributeHeaders';
import { SizeHeader } from './SizeHeader';
import { MatrixHeader } from './MatrixHeader';
import { CollapseAllButton } from './CollapseAllButton';
import { QueryButton } from './QueryButton';
import { setQuerySelector } from '../../atoms/config/queryBySetsAtoms';

export const Header = () => {
  const setQuery = useRecoilValue(setQuerySelector);

  return (
    <>
      {!isPopulatedSetQuery(setQuery) && (
        <g>
          <QueryButton />
          {/* Collapse All should be hidden while there is an active query, as this removes any aggregation */}
          <CollapseAllButton />
        </g>
      )}
      <MatrixHeader />
      <SizeHeader />
      <AttributeHeaders />
    </>
  );
};
