import React from 'react';
import './App.css';
import { Container } from '@mui/material';
import { EmptyDashboard } from './components/EmptyDashboard';
import { GadgetSpeedDial } from './components/GadgetSpeedDial';
import { GadgetGrid } from './components/Gadget';
import { useGadgets } from './hooks/useGadgets';
export const App: React.FC = () => {
  const { gadgets, hasGadgets, addGadget, clearGadgets, setGadgets } = useGadgets();

  return (
    <Container disableGutters>
      <GadgetGrid show={hasGadgets} gadgets={gadgets} onReorder={setGadgets} />
      <GadgetSpeedDial
        onAddGadget={addGadget}
        showClearButton={hasGadgets}
        onClearGadgets={clearGadgets}
      />
      <EmptyDashboard show={!hasGadgets} />
    </Container>
  );
};
