import { RenderRow } from '../../Interfaces/UpsetDatasStructure/Data';

interface BaseAnimationProps {
  y: number | number[];
  opacity: number;
  timing: { duration: number };
}

export type AnimationProps = Partial<BaseAnimationProps>;

export function getRowTransitions(rowHeight: number) {
  const duration = 250;
  const enter = (_: RenderRow, i: number): AnimationProps => {
    return { y: i * rowHeight, timing: { duration } };
  };

  const start = (_: RenderRow, i: number): AnimationProps => {
    return { y: i * rowHeight, opacity: 0, timing: { duration } };
  };

  const update = (_: RenderRow, i: number): AnimationProps => {
    return { y: [i * rowHeight], opacity: 1, timing: { duration } };
  };

  const leave = (_: RenderRow, i: number): AnimationProps => {
    return { y: [-i * rowHeight], opacity: 0, timing: { duration } };
  };
  return {
    enter,
    start,
    update,
    leave
  };
}
