import { css, SvgIcon, Tooltip } from "@mui/material";
import { DoubleArrow } from "@mui/icons-material";
import { isRowAggregate } from "@visdesignlab/upset2-core";
import { useRecoilValue } from "recoil";
import { useContext, useState } from "react";
import Group from "../custom/Group";
import { mousePointer } from '../../utils/styles';
import { ProvenanceContext } from "../Root";
import { firstAggregateSelector } from "../../atoms/config/aggregateAtoms";
import { dimensionsSelector } from "../../atoms/dimensionsAtom";
import { rowsSelector } from "../../atoms/renderRowsAtom";

const iconSize = 16;

const hidden = css`
    display: none;
`;

const collapseAllStyle = css`
    cursor: pointer;
    transform: translate(-${iconSize}px, 0)
`;

export const CollapseAllButton = () => {
    const firstAggregateBy = useRecoilValue(firstAggregateSelector);
    const dimensions = useRecoilValue(dimensionsSelector);
    const { actions } = useContext(ProvenanceContext);
    const rows = useRecoilValue(rowsSelector);
    const [ allCollapsed, setAllCollapsed ] = useState(false);

    const toggleCollapseAll = () => {
        const ids: string[] = [];

        if (allCollapsed === true) {
            actions.expandAll();
            setAllCollapsed(false);
        }
        else {
            Object.entries(rows.values).forEach((entry) => {
            const row = entry[1];
            if(isRowAggregate(row)) {
                ids.push(row.id);
            }
        })
    
            setAllCollapsed(true);
            actions.collapseAll(ids);
        }
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
                <Tooltip title={`${allCollapsed ? "Expand All" : "Collapse All"}`}>
                    <g>
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
                    </g>
                </Tooltip>
            </Group>
        </>
    );
};