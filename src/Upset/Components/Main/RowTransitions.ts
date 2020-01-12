import { RenderRow } from '../../Interfaces/UpsetDatasStructure/Data';

interface BaseAnimationProps {
  y: number | number[];
  opacity: number;
  timing: { duration: number };
}

export type AnimationProps = Partial<BaseAnimationProps>;

export function getRowTransitions(rowHeight: number) {
  const enter = (_: RenderRow, i: number): AnimationProps => {
    return { y: i * rowHeight };
  };

  const start = (_: RenderRow, i: number): AnimationProps => {
    return { y: i * rowHeight, opacity: 0 };
  };

  const update = (_: RenderRow, i: number): AnimationProps => {
    return { y: [i * rowHeight], opacity: 1, timing: { duration: 250 } };
  };

  const leave = (_: RenderRow, i: number): AnimationProps => {
    return { y: [-i * rowHeight], opacity: 0, timing: { duration: 250 } };
  };
  return {
    enter,
    start,
    update,
    leave
  };
}
