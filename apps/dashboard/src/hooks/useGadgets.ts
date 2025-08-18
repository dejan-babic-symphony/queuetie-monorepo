import { faker } from '@faker-js/faker';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GadgetProps } from '../components/Gadget/types';

export const useGadgets = () => {
  const [gadgets, setGadgets] = useState<GadgetProps[]>([]);
  const countsByOrgId = useRef<Record<string, number>>({});
  const gadgetsRef = useRef<GadgetProps[]>([]);
  const hasGadgets = gadgets.length > 0;

  useEffect(() => {
    const counts = gadgets.reduce(
      (acc, gadget) => {
        const id = gadget.organization.id;
        acc[id] = (acc[id] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    countsByOrgId.current = counts;
    gadgetsRef.current = gadgets;
  }, [gadgets]);

  const addGadget = () => {
    setGadgets((previousGadgets) => {
      const newGadget: GadgetProps = createGadget();
      return [...previousGadgets, newGadget];
    });
  };
  const clearGadgets = () => {
    setGadgets((previousGadgets) => {
      return previousGadgets.map((gadget) => ({ ...gadget, visible: false }));
    });

    setTimeout(() => {
      setGadgets([]);
    }, 500);
  };

  const updateGadget = (targetId: string, update: Partial<GadgetProps>) => {
    setGadgets((previousGadgets) => {
      return previousGadgets.map((gadget) => {
        if (gadget.id === targetId) {
          return { ...gadget, ...update };
        }
        return gadget;
      });
    });
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const createGadget = (override?: Partial<GadgetProps>) => {
    const id = uuidv4();

    const client = override?.client ?? {
      id: uuidv4(),
      name: `${capitalize(faker.word.adjective())} ${capitalize(faker.word.noun())}`,
    };

    const organization = override?.organization ?? {
      id: uuidv4(),
      name: capitalize(faker.word.sample()),
    };

    const onGroup = () => {
      setGadgets((previousGadgets) => {
        const newGadget: GadgetProps = createGadget({ organization, isGroup: true });
        return [...previousGadgets, newGadget];
      });
      updateGadget(id, { isGroup: true });
    };

    const onGroupLeave = () => {
      const { organization: newOrganization, onGroup, onGroupLeave } = createGadget();
      updateGadget(id, {
        organization: newOrganization,
        onGroup,
        onGroupLeave,
        isGroup: false,
      });

      unGroupIfLast();
    };
    const onRemove = () => {
      updateGadget(id, { isVisible: false });
      setTimeout(() => {
        const filteredGadgets = gadgetsRef.current.filter((gadget) => gadget.id !== id);
        setGadgets(filteredGadgets);
        unGroupIfLast();
      }, 500);
    };
    const unGroupIfLast = () => {
      if (countsByOrgId.current[organization.id] <= 2) {
        const needsUpdate = gadgetsRef.current.filter((g) => {
          return g.organization.id == organization.id;
        });
        needsUpdate.forEach((gadget) => updateGadget(gadget.id, { isGroup: false }));
      }
    };

    const gadget = {
      id,
      isVisible: true,
      isGroup: false,
      client,
      organization,
      onGroup,
      onGroupLeave,
      onRemove,
    };

    return { ...gadget, ...override };
  };

  return {
    gadgets,
    hasGadgets,
    addGadget,
    clearGadgets,
    setGadgets,
    updateGadget,
    createGadget,
  };
};
