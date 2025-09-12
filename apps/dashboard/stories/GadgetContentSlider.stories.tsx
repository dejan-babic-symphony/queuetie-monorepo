import { Box, Card } from '@mui/material';
import { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { GadgetContentSlider } from '../src/components/Gadget/GadgetContentSlider';
import { GadgetNotifications } from '../src/components/Gadget/GadgetNotifications';
import { GadgetProgressGrid } from '../src/components/Gadget/GadgetProgressGrid';
import { ProgressStatus } from '../src/hooks/useProgressControl';
import {
  GadgetInstanceContext,
  GadgetInstanceContextType,
} from '../src/providers/GadgetInstanceContext';

type Story = StoryObj<typeof GadgetContentSlider>;

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
  progressControls: {
    'progress-1': {
      id: 'progress-1',
      progress: 65,
      status: ProgressStatus.Active,
    },
    'progress-2': {
      id: 'progress-2',
      progress: 100,
      status: ProgressStatus.Done,
    },
  },
  notifications: [
    {
      type: 'jobs_completed',
      timestamp: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
      message: 'Batch processing completed',
      from: 'Worker #1',
    },
    {
      type: 'jobs_dispatching',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      message: 'New jobs dispatched',
      from: 'Dispatcher',
    },
  ],
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
        <Box sx={{ padding: 2 }}>
          <Story />
        </Box>
      </Card>
    </GadgetInstanceContext.Provider>
  );
};

const meta: Meta<typeof GadgetContentSlider> = {
  component: GadgetContentSlider,
  title: 'gadget/GadgetContentSlider',
  tags: ['dashboard', 'gadget'],
  decorators: [GadgetInstanceDecorator],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    notifications: {
      table: { disable: true },
    },
    progress: {
      table: { disable: true },
    },
  },
  render: (args) => (
    <GadgetContentSlider
      notifications={<GadgetNotifications />}
      progress={<GadgetProgressGrid />}
      {...args}
    />
  ),
};

export default meta;

export const ShowingProgress: Story = {
  parameters: {
    mockContext: {
      activeContent: 'progress',
    },
  },
};

export const ShowingNotifications: Story = {
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

export const NoRegisteredProgress: Story = {
  name: 'No registered progress controls',
  parameters: {
    mockContext: {
      activeContent: 'progress',
      progressControls: {},
    },
  },
};

export const EmptyNotifications: Story = {
  name: 'Empty Notifications',
  parameters: {
    mockContext: {
      activeContent: 'notifications',
      notifications: [],
    },
  },
};

export const ManyNotifications: Story = {
  parameters: {
    mockContext: {
      activeContent: 'notifications',
      notifications: Array(8)
        .fill(null)
        .map((_, i) => ({
          type: i % 2 === 0 ? 'jobs_completed' : 'jobs_dispatching',
          timestamp: new Date(Date.now() - i * 60000).toISOString(),
          message: `Test notification ${i + 1}`,
          from: `Source ${i + 1}`,
        })),
    },
  },
};

export const MultipleProgressItems: Story = {
  parameters: {
    mockContext: {
      activeContent: 'progress',
      progressControls: {
        'progress-1': {
          id: 'progress-1',
          progress: 25,
          status: ProgressStatus.Active,
        },
        'progress-2': {
          id: 'progress-2',
          progress: 75,
          status: ProgressStatus.Active,
        },
        'progress-3': {
          id: 'progress-3',
          progress: 100,
          status: ProgressStatus.Done,
        },
      },
    },
  },
};
