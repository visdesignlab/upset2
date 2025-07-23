import {
  AltText,
  CoreUpsetData,
  SelectionType,
  UpsetConfig,
} from '@visdesignlab/upset2-core';
import { UpsetProvenance, UpsetActions } from './provenance';

/**
 * Props for providing functions to open and close any sidebar.
 */
export interface SidebarProps {
  /**
   * Indicates whether the sidebar is open or closed.
   */
  open: boolean;

  /**
   * Callback function to close the sidebar.
   */
  close: () => void;
}

export type ContextMenuItem = {
  /**
   * The label for the context menu item.
   */
  label: string;

  /**
   * The function to call when the context menu item is clicked.
   */
  onClick: () => void;

  /**
   * Specifies whether the context menu item is disabled.
   */
  disabled?: boolean;
};

/**
 * Represents the props for the context menu.
 */
export type ContextMenuInfo = {
  /**
   * The x-coordinate of the mouse.
   */
  mouseX: number;

  /**
   * The y-coordinate of the mouse.
   */
  mouseY: number;

  /**
   * The Unique ID of the context menu.
   */
  id: string;

  /**
   * The items to display in the context menu.
   */
  items: ContextMenuItem[];
};

/**
 * Raw data object for an UpSet plot.
 * This is used to generate the processed data. Column annotations are inferred from the data types.
 */
export interface UpsetItem {
  [key: string]: string | number | boolean;
}

/**
 * An item from the dataset which has been processed for a Vega plot in the element view.
 * All fields mapped from the record type should be numbers;
 * unfortunately there does not appear to be a way to enforce this in TypeScript.
 * @private This is separate from the Item type because atts need to be flattened and certain other properties
 * are necessary for compatibility with the Vega spec in generatePlotSpec.ts
 */
export type VegaItem = {
  subset?: string;
  subsetName?: string;
  color: string;
  isCurrentSelected: boolean;
  isCurrent: boolean;
  bookmarked: boolean;
  selectionType?: Omit<SelectionType, 'null'>;
} & Record<string, string | number | boolean>;

/**
 * Represents the props for the Upset component.
 */
export interface UpsetProps {
  /**
   * The data for the Upset component.
   */
  data: CoreUpsetData | UpsetItem[];

  /**
   * Optional configuration for the Upset component.
   */
  config?: Partial<UpsetConfig>;

  /**
   * List of attribute names (strings) which should be visualized.
   * Defaults to the first 3 if no value is provided.
   * If an empty list is provided, displays no attributes.
   */
  visibleDatasetAttributes?: string[];

  /**
   * Whether or not to visualize UpSet generated attributes (`degree` and `deviation`).
   * Defaults to `false`.
   */
  visualizeUpsetAttributes?: boolean;

  /**
   * Whether or not to allow the user to remove attribute columns.
   * This should be enabled only if there is an option within the parent application which allows for attributes to be added after removal.
   * Default attribute removal behavior in UpSet 2.0 is done via context menu on attribute headers.
   * Defaults to `false`.
   */
  allowAttributeRemoval?: boolean;

  /**
   * Whether or not the user has plot information edit permissions.
   */
  canEditPlotInformation?: boolean;

  /**
   * Hide the aggregations/filter settings sidebar.
   */
  hideSettings?: boolean;

  /**
   * Indicates if the parent component has a fixed height.
   * If this is set to `false`, the plot will occupy the full viewport height.
   * When set to `true`, the plot will fit entirely within the parent component.
   * Defaults to `false`.
   */
  parentHasHeight?: boolean;

  /**
   * External provenance actions and [TrrackJS](https://github.com/Trrack/trrackjs) object for provenance history tracking and actions.
   * This should only be used if your tool is using TrrackJS and has all the actions used by UpSet 2.0.
   * Provenance is still tracked if nothing is provided.
   * Note that [initializeProvenanceTracking](https://github.com/visdesignlab/upset2/blob/main/packages/upset/src/provenance/index.ts#L300) and [getActions](https://github.com/visdesignlab/upset2/blob/main/packages/upset/src/provenance/index.ts#L322) are used to ensure that the provided provenance object is compatible.
   */
  extProvenance?: {
    provenance: UpsetProvenance;
    actions: UpsetActions;
  };

  /**
   * Sidebar options for the provVis component.
   */
  provVis?: SidebarProps;

  /**
   * Sidebar options for the element sidebar component.
   * This sidebar is used for element queries, element selection datatable, and supplemental plot generation.
   */
  elementSidebar?: SidebarProps;

  /**
   * Sidebar options for the alt text sidebar component.
   * This sidebar is used to display the generated text descriptions for an Upset 2.0 plot, given that the `generateAltText` function is provided.
   */
  altTextSidebar?: SidebarProps;

  /**
   * Height of the footer overlayed on the upset plot, in px, if one exists.
   * Used to prevent the bottom of the sidebars from overlapping with the footer.
   */
  footerHeight?: number;

  /**
   * Async function which should return a generated AltText object.
   */
  generateAltText?: () => Promise<AltText>;
}
