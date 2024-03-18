import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import { UpsetProvenance, UpsetActions } from './provenance';

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
