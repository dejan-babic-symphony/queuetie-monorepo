import { Container } from '@mui/material';
import React from 'react';
import './App.css';
import { EmptyDashboard } from './components/EmptyDashboard';
import { GadgetGrid } from './components/Gadget';
import { GadgetSpeedDial } from './components/GadgetSpeedDial';
import { useGadgetState } from './hooks/useGadgetState';
import { useGadgetAnimations } from './hooks/useGadgetAnimations';

export const App: React.FC = () => {
  const { gadgets, hasGadgets, addGadget, setGadgets } = useGadgetState();
  const { clearGadgetsAnimated } = useGadgetAnimations();

  return (
    <Container disableGutters>
      <GadgetGrid show={hasGadgets} gadgets={gadgets} onReorder={setGadgets} />
      <GadgetSpeedDial
        onAddGadget={addGadget}
        showClearButton={hasGadgets}
        onClearGadgets={clearGadgetsAnimated}
      />
      {!hasGadgets && <EmptyDashboard />}
    </Container>
  );
};
