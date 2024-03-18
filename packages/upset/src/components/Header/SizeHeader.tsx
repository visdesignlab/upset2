import { css } from '@emotion/react';
import { drag, select } from 'd3';
import {
  FC, useContext, useEffect, useRef, useState,
} from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { sortByOrderSelector, sortBySelector } from '../../atoms/config/sortByAtom';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { itemsAtom } from '../../atoms/itemsAtoms';
import { maxSize } from '../../atoms/maxSizeAtom';
import { subsetSelector } from '../../atoms/subsetAtoms';
import { useScale } from '../../hooks/useScale';
import translate from '../../utils/transform';
import { Axis } from '../custom/Axis';
import { ProvenanceContext } from '../Root';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';
import { HeaderSortArrow } from '../custom/HeaderSortArrow';

/** @jsxImportSource @emotion/react */
const hide = css`
  opacity: 0;
  transition: opacity 0.5s;
`;

const show = css`
  opacity: 1;
  transition: opacity 0.5s;
`;

export const SizeHeader: FC = () => {
  const { actions } = useContext(ProvenanceContext);
  const sliderRef = useRef<SVGRectElement>(null);
  const sliderParentRef = useRef<SVGGElement>(null);
  const dimensions = useRecoilValue(dimensionsSelector);
  const items = useRecoilValue(itemsAtom);
  const subsets = useRecoilValue(subsetSelector);
  const sortBy = useRecoilValue(sortBySelector);
  const sortByOrder = useRecoilValue(sortByOrderSelector);

  const itemCount = Object.keys(items).length;
  const [sliding, setSliding] = useState(false);
  const [advancedScale, setAdvancedScale] = useState(false);
  const [maxC, setMaxSize] = useRecoilState(maxSize);

  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const sortBySize = (order: string) => {
    actions.sortBy('Size', order);
  };

  const handleOnClick = () => {
    if (sortBy !== 'Size') {
      sortBySize('Ascending');
    } else {
      sortBySize(sortByOrder === 'Ascending' ? 'Descending' : 'Ascending');
    }
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const getMenuItems = () => [
    {
      label: 'Sort by Size - Ascending',
      onClick: () => {
        sortBySize('Ascending');
        handleContextMenuClose();
      },
      disabled: sortBy === 'Size' && sortByOrder === 'Ascending',
    },
    {
      label: 'Sort by Size - Descending',
      onClick: () => {
        sortBySize('Descending');
        handleContextMenuClose();
      },
      disabled: sortBy === 'Size' && sortByOrder === 'Descending',
    },
    {
      label: 'Toggle Advanced Scale',
      onClick: () => {
        const advScale = advancedScale;

        setAdvancedScale(!advScale);
        handleContextMenuClose();
      },
    },
  ];

  const openContextMenu = (e: MouseEvent) => {
    setContextMenu(
      {
        mouseX: e.clientX,
        mouseY: e.clientY,
        id: 'header-menu-Size',
        items: getMenuItems(),
      },
    );
  };

  useEffect(() => {
    if (maxC !== -1) return;
    const subs = Object.values(subsets.values);
    if (subs.length === 0) return;

    const sizes = subs.map((s) => s.size);
    const maxS = Math.max(...sizes);
    setMaxSize(maxS);
  }, [subsets, maxSize]);

  const globalScale = useScale([0, itemCount], [0, dimensions.attribute.width]);

  const detailScale = useScale([0, maxC], [0, dimensions.attribute.width]);

  useEffect(() => {
    const { current: parent } = sliderParentRef;
    const { current } = sliderRef;
    if (!current || !parent) return () => null;

    const dragBehavior = drag()
      .container(parent)
      .on('start', () => {
        setSliding(true);
      })
      .on('drag', (event) => {
        let newPosition = event.x;

        if (newPosition < 0) newPosition = 0;
        if (newPosition > dimensions.attribute.width) {
          newPosition = dimensions.attribute.width;
        }

        const size = globalScale.invert(newPosition);

        if (size > 0.1 * itemCount) setMaxSize(size);
      })
      .on('end', () => {
        setSliding(false);
      });

    select(current).call(dragBehavior as any);

    return () => {
      dragBehavior
        .on('start', null)
        .on('drag', null)
        .on('end', null);
    };
  }, [sliderRef, sliderParentRef, dimensions, globalScale]);

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap +
        dimensions.degreeColumn.width +
        dimensions.degreeColumn.gap,
        dimensions.header.totalHeight - dimensions.size.height,
      )}
    >
      {advancedScale &&
      <g className="sliding-scale" ref={sliderParentRef}>
        <Axis
          scale={globalScale}
          fontSize={0.8}
          type="bottom"
          margin={0}
          showLabel={false}
          label=""
          hideLine
        />
        <Axis
          transform={translate(0, dimensions.size.scaleHeight)}
          scale={globalScale}
          type="top"
          margin={0}
          showLabel={false}
          label=""
          tickFormatter={() => ''}
        />
        <rect
          height={dimensions.size.scaleHeight}
          width={globalScale(maxC)}
          fill="#aaa"
          opacity="0.2"
          pointerEvents="none"
          stroke="none"
        />
        <g
          className="slider-knob"
          transform={translate(
            globalScale(maxC),
            dimensions.size.scaleHeight / 2 - Math.sqrt(200) / 2,
          )}
        >
          <rect
            ref={sliderRef}
            fill="#ccc"
            opacity="0.5"
            pointerEvents="all"
            cursor="col-resize"
            stroke="black"
            strokeWidth="1px"
            transform="rotate(45)"
            height="10"
            width="10"
          />
        </g>
      </g>}
      <g
        className="sliderInfluence"
        transform={translate(0, dimensions.size.scaleHeight)}
      >
        <path
          opacity={(!sliding) ? 0.0 : 0.3}
          fill="#ccc"
          d={`M ${globalScale(maxC)} 0 H 0 V ${dimensions.size
            .buttonHeight +
            2 * dimensions.size.gap} H ${dimensions.attribute.width} z`}
        />
      </g>
      <g
        className="size-button"
        css={css`
          ${sliding ? hide : show};
          cursor: context-menu;
          &:hover {
            opacity: 0.7;
            transition: opacity 0s;
          }
        `}
        transform={translate(
          0,
          dimensions.size.scaleHeight + dimensions.size.gap,
        )}
        onContextMenu={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          openContextMenu(e);
        }}
        onClick={handleOnClick}
      >
        <rect
          fill="#ccc"
          stroke="#000"
          opacity="0.5"
          strokeWidth="0.3px"
          height={dimensions.size.buttonHeight}
          width={dimensions.attribute.width}
        />
        <g
          transform={translate(
            dimensions.attribute.width / 2,
            dimensions.size.buttonHeight / 2,
          )}
        >
          <text
            id="header-text"
            css={css`
              pointer-event: none;
            `}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Size
          </text>
          { sortBy === 'Size' &&
            <HeaderSortArrow />}
        </g>
      </g>
      <g
        className="details-scale"
        transform={translate(
          0,
          dimensions.size.scaleHeight +
          4 +
            dimensions.size.gap +
            dimensions.size.buttonHeight +
            dimensions.size.gap,
        )}
      >
        <Axis
          transform={translate(0, -8)}
          scale={detailScale}
          fontSize={0.8}
          type="bottom"
          margin={0}
          showLabel={false}
          label=""
          hideLine
        />
        <Axis
          transform={translate(0, dimensions.size.scaleHeight - 4)}
          scale={detailScale}
          type="top"
          margin={0}
          showLabel={false}
          label=""
          tickFormatter={() => ''}
        />
      </g>
    </g>
  );
};
