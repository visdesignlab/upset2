import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
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

/**
* Represents the alternative text for an Upset plot.
*/
export interface AltText {
  /**
  * The long description for the Upset plot.
  */
  longDescription: string;

  /**
  * The short description for the Upset plot.
  */
  shortDescription: string;

  /**
  * The technique description for the Upset plot.
  */
  techniqueDescription: string;

  /**
  * Optional warnings for the Upset plot.
  * Not yet implemented by the API as of 4/22/24
  */
  warnings?: string;
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
}

/**
 * Represents the props for the context menu.
 */
export type ContextMenuInfo = {
  /**
   * The x-coordinate of the mouse.
   */
  mouseX: number,

  /**
   * The y-coordinate of the mouse.
   */
  mouseY: number,

  /**
   * The Unique ID of the context menu.
   */
  id: string,

  /**
   * The items to display in the context menu.
   */
  items: ContextMenuItem[],
}

/**
* Represents the props for the Upset component.
*/
export interface UpsetProps {
  /**
  * The data for the Upset component.
  */
  data: CoreUpsetData;

  /**
  * Optional configuration for the Upset component.
  */
  config?: Partial<UpsetConfig>;

  /**
  * The attributes to load.
  * If empty, load none, if undefined, load some (default 3).
  */
  visualizeDatasetAttributes?: string[];

  /**
   * Whether or not to visualize Degree and Deviation
   */
  visualizeUpsetAttributes?: boolean;

  /**
   * Option for allowing attribute removal
   */
  allowAttributeRemoval?: boolean;

  /**
   * Option for hiding the settings sidebar
   */
  hideSettings?: boolean;

  /**
  * Specifies whether the parent component has a fixed height.
  */
  parentHasHeight?: boolean;

  /**
  * The vertical offset for the Upset component.
  */
  yOffset?: number;

  /**
  * External provenance information for the Upset component.
  */
  extProvenance?: {
    provenance: UpsetProvenance;
    actions: UpsetActions;
  };

  /**
  * Visualization settings for the provenance component.
  */
  provVis?: SidebarProps;

  /**
  * Sidebar settings for the element component.
  */
  elementSidebar?: SidebarProps;

  /**
  * Sidebar settings for the alt text component.
  */
  altTextSidebar?: SidebarProps;

  /**
  * Generates alternative text for the Upset component.
  */
  generateAltText?: () => Promise<AltText>;
}
