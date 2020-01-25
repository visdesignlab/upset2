import { Provenance } from '@visdesignlab/provenance-lib-core';
import UpsetState from './UpsetState';
import { DatasetInfo } from './DatasetInfo';
import { AggregationOptions } from './AggregationOptions';
import { SortingOptions } from './SortOptions';
import { AttributeVisualizationType } from '../Components/Main/Body/Attributes/AttributeRow';

export default interface UpsetProvenance {
  provenance: Provenance<UpsetState>;
  actions: {
    goForward: () => void;
    goBack: () => void;
    setDataset: (datasetInfo: DatasetInfo) => void;
    setFirstAggregation: (agg: AggregationOptions) => void;
    setFirstOverlap: (overlap: number) => void;
    setSecondAggregation: (agg: AggregationOptions) => void;
    setSecondOverlap: (overlap: number) => void;
    setSortBy: (sortBy: SortingOptions) => void;
    setSortBySet: (set: string) => void;
    setHideEmpty: (hide: boolean) => void;
    setMinDegree: (degree: number) => void;
    setMaxDegree: (degree: number) => void;
    setVisibleSets: (sets: string[]) => void;
    addSet: (set: string) => void;
    removeSet: (set: string) => void;
    setVisibleAttributes: (attributes: string[]) => void;
    addAttribute: (attribute: string) => void;
    removeAttribute: (attribute: string) => void;
    setAttributeType: (attribute: string, type: AttributeVisualizationType) => void;
  };
}
