import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import { UpsetProvenance, UpsetActions } from './provenance';

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
  * Specifies whether the parent component has a fixed height.
  */
  parentHasHeight?: boolean;

  /**
  * The data for the Upset component.
  */
  data: CoreUpsetData;

  /**
  * Optional configuration for the Upset component.
  */
  config?: Partial<UpsetConfig>;

  /**
  * The number of attributes to load.
  */
  loadAttributes?: number;

  /**
  * External provenance information for the Upset component.
  */
  extProvenance?: {
    provenance: UpsetProvenance;
    actions: UpsetActions;
  };

  /**
  * The vertical offset for the Upset component.
  */
  yOffset?: number;

  /**
  * Visualization settings for the provenance component.
  */
  provVis?: {
    open: boolean;
    close: () => void;
  };

  /**
  * Sidebar settings for the element component.
  */
  elementSidebar?: {
    open: boolean;
    close: () => void;
  };

  /**
  * Sidebar settings for the alt text component.
  */
  altTextSidebar?: {
    open: boolean;
    close: () => void;
  };

  /**
  * Generates alternative text for the Upset component.
  */
  generateAltText?: () => Promise<string>;
}

