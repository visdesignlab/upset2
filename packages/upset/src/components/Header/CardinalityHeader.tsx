import { css } from '@emotion/react';
import { drag, select } from 'd3';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { sortBySelector } from '../../atoms/config/sortByAtom';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { itemsAtom } from '../../atoms/itemsAtoms';
import { maxCardinality } from '../../atoms/maxCardinalityAtom';
import { subsetSelector } from '../../atoms/subsetAtoms';
import { useScale } from '../../hooks/useScale';
import translate from '../../utils/transform';
import { Axis } from '../Axis';
import { ProvenanceContext } from '../Root';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';

/** @jsxImportSource @emotion/react */
const hide = css`
  opacity: 0;
  transition: opacity 0.5s;
`;

const show = css`
  opacity: 1;
  transition: opacity 0.5s;
`;

export const CardinalityHeader: FC = () => {
  const { actions } = useContext(ProvenanceContext);
  const sliderRef = useRef<SVGRectElement>(null);
  const sliderParentRef = useRef<SVGGElement>(null);
  const dimensions = useRecoilValue(dimensionsSelector);
  const items = useRecoilValue(itemsAtom);
  const subsets = useRecoilValue(subsetSelector);
  const sortBy = useRecoilValue(sortBySelector);

  const itemCount = Object.keys(items).length;
  const [sliding, setSliding] = useState(false);
  const [ advancedScale, setAdvancedScale ] = useState(false);
  const [maxC, setMaxCardinality] = useRecoilState(maxCardinality);

  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const handleContextMenuClose = () => {
    setContextMenu(null);
  }

  const openContextMenu = (e: React.MouseEvent) => {
    setContextMenu(
      {
        mouseX: e.clientX,
        mouseY: e.clientY,
        id: `header-menu-Cardinality`,
        items: getMenuItems()
      }
    );
  }

  const getMenuItems = () => {
    return [
      {
        label: "Sort by Cardinality",
        onClick: () => {
          sortByCardinality();
          handleContextMenuClose();
        },
        disabled: sortBy === "Cardinality"
      },
      {
        label: "Toggle Advanced Scale",
        onClick: () => {
          const advScale = advancedScale;
          
          setAdvancedScale(!advScale);
          handleContextMenuClose();
        },
      }
    ]
  }

  const sortByCardinality = () => {
    actions.sortBy('Cardinality');
  }

  useEffect(() => {
    if (maxC !== -1) return;
    const subs = Object.values(subsets.values);
    if (subs.length === 0) return;

    const cardinalities = subs.map(s => s.size);
    const maxCard = Math.max(...cardinalities);
    setMaxCardinality(maxCard);
  }, [subsets, maxCardinality]);

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
      .on('drag', event => {
        let newPosition = event.x;

        if (newPosition < 0) newPosition = 0;
        if (newPosition > dimensions.attribute.width) {
          newPosition = dimensions.attribute.width;
        }

        const cardinality = globalScale.invert(newPosition);

        if (cardinality > 0.1 * itemCount) setMaxCardinality(cardinality);
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
        dimensions.bookmarkStar.gap,
        dimensions.header.totalHeight - dimensions.cardinality.height,
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
          transform={translate(0, dimensions.cardinality.scaleHeight)}
          scale={globalScale}
          type="top"
          margin={0}
          showLabel={false}
          label=""
          tickFormatter={() => ''}
        />
        <rect
          height={dimensions.cardinality.scaleHeight}
          width={globalScale(maxC)}
          css={css`
            fill: #aaa;
            opacity: 0.2;
            pointer-events: none;
          `}
          stroke="none"
        />
        <g
          className="slider-knob"
          transform={translate(
            globalScale(maxC),
            dimensions.cardinality.scaleHeight / 2 - Math.sqrt(200) / 2,
          )}
        >
          <rect
            ref={sliderRef}
            css={css`
              fill: #ccc;
              opacity: 0.5;
              pointer-events: all;
              cursor: col-resize;
              stroke: black;
              stroke-width: 1px;
            `}
            transform="rotate(45)"
            height="10"
            width="10"
          />
        </g>
      </g>
      }
      <g
        className="sliderInfluence"
        css={css`
          ${!sliding ? hide : show}
        `}
        transform={translate(0, dimensions.cardinality.scaleHeight)}
      >
        <path
          opacity="0.3"
          fill="#ccc"
          d={`M ${globalScale(maxC)} 0 H 0 V ${dimensions.cardinality
            .buttonHeight +
            2 * dimensions.cardinality.gap} H ${dimensions.attribute.width} z`}
        />
      </g>
      <g
        className="cardinality-button"
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
          dimensions.cardinality.scaleHeight + dimensions.cardinality.gap,
        )}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openContextMenu(e);
      }}
      >
        <rect
          css={css`
            fill: #ccc;
            stroke: black;
            opacity: 0.5;
            stroke-width: 0.3px;
          `}
          height={dimensions.cardinality.buttonHeight}
          width={dimensions.attribute.width}
          onClick={() => {
            if (sortBy !== 'Cardinality') actions.sortBy('Cardinality');
          }}
        />
        <text
          css={css`
            pointer-event: none;
          `}
          dominantBaseline="middle"
          transform={translate(
            dimensions.attribute.width / 2,
            dimensions.cardinality.buttonHeight / 2,
          )}
          textAnchor="middle"
        >
          Cardinality
        </text>
      </g>
      <g
        className="details-scale"
        transform={translate(
          0,
          dimensions.cardinality.scaleHeight +
          4 +
            dimensions.cardinality.gap +
            dimensions.cardinality.buttonHeight +
            dimensions.cardinality.gap,
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
          transform={translate(0, dimensions.cardinality.scaleHeight - 4)}
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
