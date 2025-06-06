import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogTitle, IconButton, Tab, Tabs } from '@mui/material';
import { FC, ReactNode, useState } from 'react';

import { AddHistogram, AddScatterplot } from './AddPlot';

type PlotType = 'Scatterplot' | 'Histogram' | 'KDE';

type TabProps = {
  children?: ReactNode;
  index: PlotType;
  value: PlotType;
};

function TabPanel({ children, index, value, ...others }: TabProps) {
  return (
    <Box
      sx={{
        width: 600,
      }}
    >
      {value === index && (
        <Box
          sx={{
            padding: '1em',
            minHeight: 300,
          }}
          {...others}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export const AddPlotDialog: FC<Props> = ({ open, onClose }) => {
  const [currentTab, setCurrentTab] = useState<PlotType>('Scatterplot');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Add Plot
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs
        value={currentTab}
        onChange={(_, newValue: PlotType) => {
          setCurrentTab(newValue);
        }}
      >
        <Tab label="Scatterplot" value="Scatterplot" />
        <Tab label="Histogram" value="Histogram" />
        <Tab label="KDE" value="KDE" />
      </Tabs>

      <TabPanel index="Scatterplot" value={currentTab}>
        <AddScatterplot handleClose={onClose} />
      </TabPanel>
      <TabPanel index="Histogram" value={currentTab}>
        <AddHistogram handleClose={onClose} density={false} />
      </TabPanel>
      <TabPanel index="KDE" value={currentTab}>
        <AddHistogram handleClose={onClose} density />
      </TabPanel>
    </Dialog>
  );
};
