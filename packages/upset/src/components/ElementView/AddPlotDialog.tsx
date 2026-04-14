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
  const active = value === index;

  return (
    <Box
      role="tabpanel"
      hidden={!active}
      sx={{
        width: 600,
      }}
      {...others}
    >
      <Box
        sx={{
          padding: '1em',
          minHeight: 300,
        }}
      >
        {children}
      </Box>
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
    <Dialog open={open} onClose={onClose} keepMounted>
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
        <AddScatterplot handleClose={onClose} active={currentTab === 'Scatterplot'} />
      </TabPanel>
      <TabPanel index="Histogram" value={currentTab}>
        <AddHistogram
          handleClose={onClose}
          density={false}
          active={currentTab === 'Histogram'}
        />
      </TabPanel>
      <TabPanel index="KDE" value={currentTab}>
        <AddHistogram handleClose={onClose} density active={currentTab === 'KDE'} />
      </TabPanel>
    </Dialog>
  );
};
