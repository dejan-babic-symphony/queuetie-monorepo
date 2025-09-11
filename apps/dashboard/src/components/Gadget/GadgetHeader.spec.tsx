import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GadgetHeader } from './GadgetHeader';
import {
  GadgetInstanceContext,
  GadgetInstanceContextType,
} from '../../providers/GadgetInstanceContext';
import { DiceBearVariant } from '../DiceBear/types';

// Mock DiceBearAvatar component
vi.mock('../DiceBear', () => ({
  DiceBearAvatar: ({
    seed,
    size,
    variant,
  }: {
    seed: string;
    size?: number;
    variant?: DiceBearVariant;
  }) => (
    <div data-testid="dice-bear-avatar" data-seed={seed} data-size={size} data-variant={variant}>
      Avatar-{seed}
    </div>
  ),
}));

const createMockContext = (
  overrides: Partial<GadgetInstanceContextType> = {}
): GadgetInstanceContextType => ({
  socketOn: true,
  isGroup: false,
  activeContent: 'progress',
  dispatchEnabled: true,
  client: {
    id: 'client-1',
    name: 'Test Client',
  },
  organization: {
    id: 'org-1',
    name: 'Test Organization',
  },
  progressControls: {},
  notifications: [],
  handleToggleSocket: vi.fn(),
  handleShowProgress: vi.fn(),
  handleShowNotifications: vi.fn(),
  handleSimulateDispatch: vi.fn(),
  handleClearNotifications: vi.fn(),
  handleGroupBroadcast: vi.fn(),
  handleGroupAdd: vi.fn(),
  handleGroupLeave: vi.fn(),
  handleRemove: vi.fn(),
  ...overrides,
});

const renderWithContext = (contextOverrides: Partial<GadgetInstanceContextType> = {}) => {
  const mockContext = createMockContext(contextOverrides);
  return {
    ...render(
      <GadgetInstanceContext.Provider value={mockContext}>
        <GadgetHeader />
      </GadgetInstanceContext.Provider>
    ),
    mockContext,
  };
};

describe('GadgetHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render client name as title', () => {
      renderWithContext({
        client: { id: 'client-1', name: 'Marketing Dashboard' },
      });

      expect(screen.getByText('Marketing Dashboard')).toBeInTheDocument();
    });

    it('should render organization name in subheader', () => {
      renderWithContext({
        organization: { id: 'org-1', name: 'Acme Corporation' },
      });

      expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    });

    it('should render client avatar with correct seed', () => {
      renderWithContext({
        client: { id: 'client-1', name: 'Test Client' },
      });

      const avatars = screen.getAllByTestId('dice-bear-avatar');
      const clientAvatar = avatars.find(
        (avatar) => avatar.getAttribute('data-seed') === 'Test Client'
      );
      expect(clientAvatar).toHaveAttribute('data-seed', 'Test Client');
    });

    it('should render organization avatar with identicon variant', () => {
      renderWithContext({
        organization: { id: 'org-1', name: 'Test Org' },
      });

      const avatars = screen.getAllByTestId('dice-bear-avatar');
      const orgAvatar = avatars.find((avatar) => avatar.getAttribute('data-seed') === 'Test Org');

      expect(orgAvatar).toHaveAttribute('data-variant', 'identicon');
      expect(orgAvatar).toHaveAttribute('data-size', '12');
    });
  });

  describe('Connection Status Badge', () => {
    it('should show success badge when socket is connected', () => {
      renderWithContext({ socketOn: true });

      const badge = document.querySelector('.MuiBadge-colorSuccess');
      expect(badge).toBeInTheDocument();
    });

    it('should show error badge when socket is disconnected', () => {
      renderWithContext({ socketOn: false });

      const badge = document.querySelector('.MuiBadge-colorError');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render monitor button with correct label', () => {
      renderWithContext();

      const monitorButton = screen.getByRole('button', { name: 'Job progress monitor' });
      expect(monitorButton).toBeInTheDocument();
      expect(monitorButton).toHaveAttribute('title', 'Show job progress monitor');
    });

    it('should render notification button with correct label', () => {
      renderWithContext();

      const notificationButton = screen.getByRole('button', { name: 'Notifications' });
      expect(notificationButton).toBeInTheDocument();
      expect(notificationButton).toHaveAttribute('title', 'Show notifications');
    });

    it('should highlight monitor button when progress is active', () => {
      renderWithContext({ activeContent: 'progress' });

      const monitorButton = screen.getByRole('button', { name: 'Job progress monitor' });
      expect(monitorButton).toHaveClass('MuiIconButton-colorPrimary');
    });

    it('should highlight notification button when notifications are active', () => {
      renderWithContext({ activeContent: 'notifications' });

      const notificationButton = screen.getByRole('button', { name: 'Notifications' });
      expect(notificationButton).toHaveClass('MuiIconButton-colorPrimary');
    });

    it('should not highlight buttons when no content is active', () => {
      renderWithContext({ activeContent: 'none' });

      const monitorButton = screen.getByRole('button', { name: 'Job progress monitor' });
      const notificationButton = screen.getByRole('button', { name: 'Notifications' });

      expect(monitorButton).not.toHaveClass('MuiIconButton-colorPrimary');
      expect(notificationButton).not.toHaveClass('MuiIconButton-colorPrimary');
    });
  });

  describe('Notification Badge', () => {
    it('should show notification count when notifications exist', () => {
      const notifications = Array(5)
        .fill(null)
        .map((_, i) => ({
          id: `notification-${i}`,
          type: 'jobs_completed' as const,
          timestamp: new Date().toISOString(),
          message: `Test notification ${i}`,
          from: 'Test',
        }));

      renderWithContext({ notifications });

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should cap notification count at 99+', () => {
      const notifications = Array(150)
        .fill(null)
        .map((_, i) => ({
          id: `notification-${i}`,
          type: 'jobs_dispatching' as const,
          timestamp: new Date().toISOString(),
          message: `Test notification ${i}`,
          from: 'Test',
        }));

      renderWithContext({ notifications });

      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('should not show badge when no notifications exist', () => {
      renderWithContext({ notifications: [] });

      expect(screen.queryByText(/^\d+\+?$/)).not.toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call handleShowProgress when monitor button is clicked', () => {
      const { mockContext } = renderWithContext();

      const monitorButton = screen.getByRole('button', { name: 'Job progress monitor' });
      fireEvent.click(monitorButton);

      expect(mockContext.handleShowProgress).toHaveBeenCalledTimes(1);
    });

    it('should call handleShowNotifications when notification button is clicked', () => {
      const { mockContext } = renderWithContext();

      const notificationButton = screen.getByRole('button', { name: 'Notifications' });
      fireEvent.click(notificationButton);

      expect(mockContext.handleShowNotifications).toHaveBeenCalledTimes(1);
    });
  });

  describe('Text Truncation', () => {
    it('should truncate long client names and show tooltip', () => {
      const longClientName =
        'Multi-Tenant Customer Relationship Management System with Advanced Analytics';
      renderWithContext({
        client: { id: 'client-long', name: longClientName },
      });

      const titleElement = screen.getByText(longClientName);
      expect(titleElement).toHaveAttribute('title', longClientName);
      expect(titleElement).toHaveStyle('max-width: 190px');
      expect(titleElement).toHaveStyle('text-overflow: ellipsis');
    });

    it('should truncate long organization names and show tooltip', () => {
      const longOrgName =
        'Global Enterprise Technology Solutions and Digital Innovation Corporation Limited';
      renderWithContext({
        organization: { id: 'org-long', name: longOrgName },
      });

      const orgElement = screen.getByText(longOrgName);
      expect(orgElement).toHaveAttribute('title', longOrgName);
      expect(orgElement).toHaveStyle('max-width: 160px');
      expect(orgElement).toHaveStyle('text-overflow: ellipsis');
    });

    it('should not add tooltip for short names', () => {
      renderWithContext({
        client: { id: 'client-1', name: 'Short Name' },
      });

      const titleElement = screen.getByText('Short Name');
      expect(titleElement).toHaveAttribute('title', 'Short Name');
    });
  });

  describe('Context Requirements', () => {
    it('should handle null client gracefully', () => {
      renderWithContext({
        client: null,
      });

      // Component should render without crashing and show fallback text
      expect(screen.getByRole('button', { name: 'Job progress monitor' })).toBeInTheDocument();
      expect(screen.getByText('Unknown Client')).toBeInTheDocument();
    });

    it('should handle null organization gracefully', () => {
      renderWithContext({
        organization: null,
      });

      // Component should render without crashing and show fallback text
      expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
      expect(screen.getByText('Unknown Organization')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for buttons', () => {
      renderWithContext();

      const monitorButton = screen.getByRole('button', { name: 'Job progress monitor' });
      const notificationButton = screen.getByRole('button', { name: 'Notifications' });

      expect(monitorButton).toHaveAttribute('aria-label', 'Job progress monitor');
      expect(notificationButton).toHaveAttribute('aria-label', 'Notifications');
    });

    it('should have descriptive title attributes', () => {
      renderWithContext();

      const monitorButton = screen.getByRole('button', { name: 'Job progress monitor' });
      const notificationButton = screen.getByRole('button', { name: 'Notifications' });

      expect(monitorButton).toHaveAttribute('title', 'Show job progress monitor');
      expect(notificationButton).toHaveAttribute('title', 'Show notifications');
    });
  });

  describe('Style Constants', () => {
    it('should apply correct styles for text truncation', () => {
      const longClientName = 'Very Long Client Name That Should Be Truncated';
      renderWithContext({
        client: { id: 'client-1', name: longClientName },
      });

      const titleElement = screen.getByText(longClientName);

      expect(titleElement).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '190px',
      });
    });

    it('should apply flexbox styles to organization container', () => {
      renderWithContext({
        organization: { id: 'org-1', name: 'Test Org' },
      });

      const orgContainer = screen.getByText('Test Org').parentElement;
      expect(orgContainer).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
        gap: '8px', // Material-UI converts gap: 1 to 8px
      });
    });
  });
});
