import { Box, ThemeProvider } from '@mui/material';
import { FC, useMemo } from 'react';
import { RecoilRoot } from 'recoil';
import defaultTheme from '../utils/theme';
import { Root } from './Root';
import { UpsetProps } from '../types';
import { processRawData } from '../utils/data';

/**
 * Renders the Upset component.
 *
 * @component
 * @param {CoreUpsetData | UpsetItem[]} data - The data for the Upset component.
 * @param {Partial<UpsetConfig>} [config={}] - The configuration options for the Upset component. This can be partial. Note that if extProvenance is also passed, the most recent state from extProvenance is used instead of this
 * @param {string[]} [visualizeAttributes] - List of attribute names (strings) which should be visualized. Defaults to the first 3 if no value is provided. If an empty list is provided, displays no attributes.
 * @param {boolean} [visualizeUpsetAttributes=false] - Whether or not to visualize UpSet generated attributes (`degree` and `deviation`). Defaults to `false`.
 * @param {boolean} [allowAttributeRemoval=false] - Whether or not to allow the user to remove attribute columns. This should be enabled only if there is an option within the parent application which allows for attributes to be added after removal. Default attribute removal behavior in UpSet 2.0 is done via context menu on attribute headers. Defaults to `false`.
 * @param {boolean} [hideSettings] - Hide the aggregations/filter settings sidebar.
 * @param {boolean} [parentHasHeight=false] - Indicates if the parent component has a fixed height. If this is set to `false`, the plot will occupy the full viewport height. When set to `true`, the plot will fit entirely within the parent component. Defaults to `false`.
 * @param {boolean} [canEditPlotInformation=false] - Whether or not the user has plot information edit permissions.
 * @param {Object} [extProvenance] - External provenance actions and [TrrackJS](https://github.com/Trrack/trrackjs) object for provenance history tracking and actions. This should only be used if your tool is using TrrackJS and has all the actions used by UpSet 2.0. Provenance is still tracked if nothing is provided. See [App.tsx](https://github.com/visdesignlab/upset2/blob/main/packages/app/src/App.tsx) to see how UpSet 2.0 and Multinet use an external Trrack object. Note that [initializeProvenanceTracking](https://github.com/visdesignlab/upset2/blob/main/packages/upset/src/provenance/index.ts#L300) and [getActions](https://github.com/visdesignlab/upset2/blob/main/packages/upset/src/provenance/index.ts#L322) are used to ensure that the provided provenance object is compatible.
 * @param {SidebarProps} [provVis] - The provenance visualization sidebar options.
 * @param {SidebarProps} [elementSidebar] - The element sidebar options. This sidebar is used for element queries, element selection datatable, and supplimental plot generation.
 * @param {SidebarProps} [altTextSidebar] - The alternative text sidebar options. This sidebar is used to display the generated text descriptions for an Upset 2.0 plot, given that the `generateAltText` function is provided.
 * @param {number} [footerHeight] - Height of the footer overlayed on the upset plot, in px, if one exists. Used to prevent the bottom of the sidebars from overlapping with the footer.
 * @param {() => Promise<AltText>} [generateAltText] - The function to generate alternative text.
 * @returns {JSX.Element} The rendered Upset component.
 */
export const Upset: FC<UpsetProps> = ({
  data,
  parentHasHeight = false,
  config = {},
  visibleDatasetAttributes,
  visualizeUpsetAttributes = false,
  allowAttributeRemoval = false,
  canEditPlotInformation = false,
  hideSettings,
  extProvenance,
  provVis,
  elementSidebar,
  altTextSidebar,
  footerHeight,
  generateAltText,
}) => {
  // If the provided data is not already processed by UpSet core, process it
  const processedData = useMemo(() => {
    // the CoreUpsetData will never be an Array, and the UpsetItem[] will always be an Array
    if (data instanceof Array) {
      return processRawData(data);
    }

    return data;
  }, [data]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: 'flex',
          height: parentHasHeight ? '100%' : '100vh',
          width: '100%',
          fontFamily: 'Roboto, Arial',
        }}
      >
        <RecoilRoot>
          <Root
            data={processedData}
            config={config}
            visibleDatasetAttributes={visibleDatasetAttributes}
            visualizeUpsetAttributes={visualizeUpsetAttributes}
            allowAttributeRemoval={allowAttributeRemoval}
            canEditPlotInformation={canEditPlotInformation}
            hideSettings={hideSettings}
            extProvenance={extProvenance}
            provVis={provVis}
            elementSidebar={elementSidebar}
            altTextSidebar={altTextSidebar}
            footerHeight={footerHeight}
            generateAltText={generateAltText}
          />
        </RecoilRoot>
      </Box>
    </ThemeProvider>
  );
};
