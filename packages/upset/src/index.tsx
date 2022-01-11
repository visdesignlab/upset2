import React, {
  FC,
  HTMLAttributes,
  ReactChild,
  useEffect,
  useState,
} from 'react';
import {
  test,
  getSubsets,
  CoreUpsetData,
  Subset,
} from '@visdesignlab/upset2-core';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  /** custom content, defaults to 'the snozzberries taste like snozzberries' */
  children?: ReactChild;
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing: FC<Props> = () => {
  const [sets, setSets] = useState<CoreUpsetData | null>(null);
  const [subsets, setSubset] = useState<{ [key: string]: Subset } | null>(null);
  const [vSets, setVSets] = useState<string[]>([]);

  const unusedSets = sets
    ? Object.keys(sets.sets).filter((k) => !vSets.includes(k))
    : [];

  const isEnabled = sets !== null;

  useEffect(() => {
    test().then((d) => {
      setSets(d);
      setVSets(Object.keys(d.sets).slice(0, 6));
    });
  }, []);

  useEffect(() => {
    if (sets)
      setSubset(getSubsets(Object.values(sets.items), sets.sets, vSets));
  }, [sets, vSets]);

  return (
    <div>
      <button
        disabled={!isEnabled}
        type="button"
        onClick={() => console.log(sets)}
      >
        Log Sets
      </button>
      <button
        disabled={!isEnabled}
        type="button"
        onClick={() => console.log(subsets)}
      >
        Log Subsets
      </button>
      {subsets && (
        <>
          {' '}
          <span>{Object.values(subsets).length}</span>{' '}
          <span>
            {Object.values(subsets).filter((s) => s.items.length > 0).length}
          </span>{' '}
          <span>
            {Object.values(subsets).filter((s) => s.items.length === 0).length}
          </span>{' '}
        </>
      )}
      {sets && (
        <>
          <div>
            Visible Sets
            <ul>
              {vSets.map((id) => {
                const set = sets.sets[id];
                return (
                  <li key={set.id}>
                    {set.elementName}
                    {'   '}
                    <button
                      type="button"
                      disabled={vSets.length === 1}
                      onClick={() => setVSets((s) => s.filter((a) => a !== id))}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            Hidden Sets
            <ul>
              {unusedSets.map((id) => {
                const set = sets.sets[id];
                return (
                  <li key={set.id}>
                    {set.elementName}
                    {'   '}
                    <button
                      type="button"
                      onClick={() => setVSets((s) => [...s, id])}
                    >
                      Add
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
