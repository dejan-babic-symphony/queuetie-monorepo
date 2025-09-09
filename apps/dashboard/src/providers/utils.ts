import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { GadgetProps } from '../components/Gadget/types';

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Creates a new gadget with default or overridden properties
 */
export const createGadget = (override?: Partial<GadgetProps>): GadgetProps => {
  const id = uuidv4();

  const client = override?.client ?? {
    id: uuidv4(),
    name: `${capitalize(faker.word.adjective())} ${capitalize(faker.word.noun())}`,
  };

  const organization = override?.organization ?? {
    id: uuidv4(),
    name: capitalize(faker.word.sample()),
  };

  const gadget: GadgetProps = {
    id,
    isVisible: true,
    isGroup: false,
    client,
    organization,
    ...override,
  };

  return gadget;
};

/**
 * Auto-ungroups gadgets in an organization if only one remains
 */
export const autoUngroupIfNeeded = (
  gadgets: GadgetProps[],
  organizationId: string
): GadgetProps[] => {
  const remainingInOrg = gadgets.filter((g) => g.organization.id === organizationId).length;

  // If fewer than 2 remain (only 1 gadget left), ungroup them
  if (remainingInOrg < 2) {
    return gadgets.map((gadget) => {
      if (gadget.organization.id === organizationId) {
        return { ...gadget, isGroup: false };
      }
      return gadget;
    });
  }

  return gadgets;
};
