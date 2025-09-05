export type SimulateClient = {
  id: string;
  name: string;
};

export type SimulateOrganization = {
  id: string;
  name: string;
};

export type SimulateEcho = {
  total: number;
  context: string;
  batch: string;
  client: SimulateClient;
  organization: SimulateOrganization;
};

export type SimulateProgress = SimulateEcho & { completed: number };

export type SimulateType = 'single' | 'batch';

export type SimulateRequestType = {
  type: SimulateType;
  queue: string;
  delay: number;
  echo: SimulateEcho;
};
