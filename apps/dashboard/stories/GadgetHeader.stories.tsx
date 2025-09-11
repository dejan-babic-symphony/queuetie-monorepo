import { Card } from '@mui/material';
import { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { GadgetHeader } from '../src/components/Gadget/GadgetHeader';
import {
  GadgetInstanceContext,
  GadgetInstanceContextType,
} from '../src/providers/GadgetInstanceContext';

type Story = StoryObj<typeof GadgetHeader>;

const createMockContext = (
  overrides: Partial<GadgetInstanceContextType> = {}
): GadgetInstanceContextType => ({
  socketOn: true,
  isGroup: false,
  activeContent: 'progress',
  dispatchEnabled: true,
  client: {
    id: 'client-1',
    name: 'Marketing Dashboard',
  },
  organization: {
    id: 'org-1',
    name: 'Acme Corp',
  },
  progressControls: {},
  notifications: [],
  handleToggleSocket: fn(),
  handleShowProgress: fn(),
  handleShowNotifications: fn(),
  handleSimulateDispatch: fn(),
  handleClearNotifications: fn(),
  handleGroupBroadcast: fn(),
  handleGroupAdd: fn(),
  handleGroupLeave: fn(),
  handleRemove: fn(),
  ...overrides,
});

const GadgetInstanceDecorator: Decorator = (Story, { parameters }) => {
  const mockContext = createMockContext(parameters?.mockContext || {});

  return (
    <GadgetInstanceContext.Provider value={mockContext}>
      <Card sx={{ width: 345, margin: 2 }}>
        <Story />
      </Card>
    </GadgetInstanceContext.Provider>
  );
};

const meta: Meta<typeof GadgetHeader> = {
  component: GadgetHeader,
  title: 'gadget/GadgetHeader',
  tags: ['dashboard', 'gadget'],
  decorators: [GadgetInstanceDecorator],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default: Story = {};

export const Disconnected: Story = {
  parameters: {
    mockContext: {
      socketOn: false,
    },
  },
};

export const WithNotifications: Story = {
  parameters: {
    mockContext: {
      notifications: Array(5)
        .fill(null)
        .map((_, i) => ({
          id: `notification-${i}`,
          type: 'jobs_completed',
          timestamp: new Date().toISOString(),
          data: {},
        })),
    },
  },
};

export const ManyNotifications: Story = {
  parameters: {
    mockContext: {
      notifications: Array(150)
        .fill(null)
        .map((_, i) => ({
          id: `notification-${i}`,
          type: 'jobs_dispatching',
          timestamp: new Date().toISOString(),
          data: {},
        })),
    },
  },
};

export const NoNotifications: Story = {
  parameters: {
    mockContext: {
      notifications: [],
    },
  },
};

export const ProgressActive: Story = {
  parameters: {
    mockContext: {
      activeContent: 'progress',
    },
  },
};

export const NotificationsActive: Story = {
  parameters: {
    mockContext: {
      activeContent: 'notifications',
    },
  },
};

export const NoContentActive: Story = {
  parameters: {
    mockContext: {
      activeContent: 'none',
    },
  },
};

export const LongNames: Story = {
  parameters: {
    mockContext: {
      client: {
        id: 'client-long',
        name: 'Multi-Tenant Customer Relationship Management System',
      },
      organization: {
        id: 'org-long',
        name: 'Global Enterprise Technology Solutions and Digital Innovation Corporation',
      },
    },
  },
};
