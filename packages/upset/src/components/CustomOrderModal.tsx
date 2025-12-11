import React, { useContext, useEffect, useState } from 'react';
import { ProvenanceContext } from './Root';
import type { UpsetActions } from '../provenance';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  visibleSetSelector,
  customOrderModalAtom,
} from '../atoms/config/visibleSetsAtoms';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, name }: { id: string; name: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.9 : 1,
    touchAction: 'manipulation',
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      component={Paper}
      sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
      dense
      secondaryAction={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DragIndicatorIcon />
        </Box>
      }
      {...attributes}
      {...listeners}
    >
      <ListItemText primary={name} />
    </ListItem>
  );
}

export function CustomOrderModal() {
  const [customOrderModalOpen, setCustomOrderModalOpen] =
    useRecoilState(customOrderModalAtom);
  const visibleSets = useRecoilValue(visibleSetSelector);

  const [sortedSets, setSortedSets] = useState<string[]>([]);
  useEffect(() => {
    setSortedSets(visibleSets ?? []);
  }, [visibleSets]);

  const { actions }: { actions: UpsetActions } = useContext(ProvenanceContext);

  // dnd-kit sensors
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = sortedSets.indexOf(String(active.id));
    const newIndex = sortedSets.indexOf(String(over.id));
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      setSortedSets((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  }

  return (
    <Dialog
      open={customOrderModalOpen}
      onClose={() => setCustomOrderModalOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Sort Sets by Manual Definition</DialogTitle>
      <DialogContent dividers>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortedSets} strategy={verticalListSortingStrategy}>
            <List>
              {sortedSets.map((set) => (
                <SortableItem key={set} id={set} name={set.replace(/^Set_/, '')} />
              ))}
              {sortedSets.length === 0 && (
                <div style={{ padding: 12, color: 'rgba(0,0,0,0.6)' }}>
                  No visible sets to sort.
                </div>
              )}
            </List>
          </SortableContext>
        </DndContext>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setCustomOrderModalOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            // call your provenance action with the new ordering
            actions.sortVisibleBy(sortedSets.join(','));
            setCustomOrderModalOpen(false);
          }}
          variant="contained"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
