import { useEffect, useState } from 'react';
import { GadgetProps } from '../components/Gadget/types';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export const useGadgets = () => {
  const [gadgets, setGadgets] = useState<GadgetProps[]>([]);
  const [hasGadgets, setHasGadgets] = useState<boolean>(false);

  useEffect(() => {
    setHasGadgets(gadgets.length > 0);
  }, [gadgets]);

  const addGadget = () => {
    setGadgets((previousGadgets) => {
      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
      const newGadget: GadgetProps = {
        id: uuidv4(),
        visible: true,
        client: {
          id: uuidv4(),
          name: `${capitalize(faker.word.adjective())} ${capitalize(faker.word.noun())}`,
        },
        organization: {
          id: uuidv4(),
          name: capitalize(faker.word.sample()),
        },
      };

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

  return { gadgets, hasGadgets, addGadget, clearGadgets, setGadgets };
};
