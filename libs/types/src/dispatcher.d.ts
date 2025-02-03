import { UUID } from 'crypto';

export type SimulateUser = {
  id: UUID;
  name: string;
};

export type SimulateOrganization = {
  id: UUID;
  name: string;
};

export type SimulateEcho = {
  total: number;
  context: UUID;
  user: User;
  organization: Organization;
};

export type SimulateRequestType = {
  type: string;
  queue: string;
  delay: number;
  echo: Echo;
};
