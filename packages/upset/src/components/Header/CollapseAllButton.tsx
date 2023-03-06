import { DoubleArrow } from "@mui/icons-material";
import Group from "../custom/Group";
import { css, SvgIcon } from "@mui/material";
import { collapsedAtom } from "../../atoms/collapsedAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { firstAggregateSelector } from "../../atoms/config/aggregateAtoms";
import { dimensionsSelector } from "../../atoms/dimensionsAtom";
import { mousePointer } from '../../utils/styles';

const iconSize = 16;

const hidden = css`
    display: none;
`;

const collapseAllStyle = css`
    cursor: pointer;
    transform: translate(-${iconSize}px, 0)
`;

export const CollapseAllButton = () => {
    const [ collapsedIds, setCollapsedIds ] = useRecoilState(collapsedAtom);
    const firstAggregateBy = useRecoilValue(firstAggregateSelector);
    const dimensions = useRecoilValue(dimensionsSelector);

    const [ allCollapsed, setAllCollapsed ] = useState(false);

    const toggleCollapseAll = () => {
      const collapsed = !allCollapsed;
      const ids: {[id: string]: boolean} = {};
      Object.entries(collapsedIds).forEach((entry) => {
        ids[entry[0]] = collapsed;
      })
  
      setAllCollapsed(collapsed);
      setCollapsedIds(ids);
    }
    
    const getTransform = () => {
        if (!allCollapsed) {
            return `rotate(-90deg) translate(-${iconSize}px, -${iconSize}px)`;
        } else {
            return `rotate(90deg)`;
        }
    }

    return (
        <>
            <Group tx={iconSize + 5} ty={dimensions.header.totalHeight - iconSize} css={firstAggregateBy === 'None' && hidden}>
                <rect height={iconSize} width={iconSize} css={collapseAllStyle} onClick={toggleCollapseAll} opacity={0}></rect>
                <SvgIcon
                    sx={{ transform: getTransform }} 
                    height={iconSize} 
                    width={iconSize}
                    css={mousePointer}
                    onClick={toggleCollapseAll}
                    >
                    <DoubleArrow></DoubleArrow>
                </SvgIcon>
            </Group>
        </>
    );
};