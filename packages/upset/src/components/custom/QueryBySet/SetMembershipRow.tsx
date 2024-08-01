import { Dispatch, FC, SetStateAction } from 'react';
import { useRecoilValue } from 'recoil';
import { SetMembershipStatus } from '@visdesignlab/upset2-core';
import { css } from '@emotion/react';
import MemberShipCircle from '../../Columns/Matrix/MembershipCircle';
import translate from '../../../utils/transform';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import { Membership } from './QueryBySet';
import { visibleSetSelector } from '../../../atoms/config/visibleSetsAtoms';

type Props = {
  /**
   * Members objects
   */
  members: Membership;
  /**
   * Function to set members
   */
  setMembers: Dispatch<SetStateAction<Membership>>;
  /**
   * Membership type for the row, can only be 'not', 'maybe', or 'must'.
   */
  membershipType?: SetMembershipStatus
  /**
   * Whether this row is the top level 'combined' row.
   */
  combined?: boolean;
}

const highlightedSetMemberCircle = css`
  stroke: rgb(161, 217, 155);
  opacity: 1;
  stroke-width: 2.5;
`;

/**
 * Set Membership Rows for the query by sets interface.
 * @param props - The component props. @see @Props
 */
export const SetMembershipRow: FC<Props> = ({
  members, setMembers, membershipType, combined = false,
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetSelector);

  /**
   * Retrieves the membership status for a given set.
   * @param set - The name of the set.
   * @returns The membership status for the set.
   */
  function getMembershipStatus(set: string): SetMembershipStatus {
    if (combined || !membershipType) {
      return members[set];
    }
    return membershipType;
  }

  /**
   * Updates the members object for the selected set based on the membership type of the row.
   *
   * @param set - The name of the set.
   */
  function selectMembershipCircle(set: string) {
    if (combined || !membershipType) return;

    const newMembers = { ...members };
    newMembers[set] = membershipType;
    setMembers(newMembers);
  }

  return (
    <g>
      {!combined &&
        <text
          textAnchor="end"
          transform={translate(-(dimensions.set.width / 2) - 2, (dimensions.body.rowHeight / 4) - 3)}
          fontSize="14px"
        >
          {membershipType?.toLowerCase()}
        </text>}
      {visibleSets.map((set, index) => (
        <MemberShipCircle
          onClick={() => selectMembershipCircle(set)}
          transform={translate(((dimensions.set.width / 2) + dimensions.gap / 2) * index, 0)}
          membershipStatus={getMembershipStatus(set)}
          showoutline
          css={(!combined && getMembershipStatus(set) === members[set]) && highlightedSetMemberCircle}
        />
      ))}
    </g>
  );
};
