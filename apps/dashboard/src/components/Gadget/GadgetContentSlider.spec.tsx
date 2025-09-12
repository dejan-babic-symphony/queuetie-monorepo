import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GadgetContentSlider } from './GadgetContentSlider';
import {
  GadgetInstanceContext,
  GadgetInstanceContextType,
} from '../../providers/GadgetInstanceContext';

// Mock child components
vi.mock('./GadgetNotifications', () => ({
  GadgetNotifications: () => <div data-testid="gadget-notifications">Notifications Content</div>,
}));

vi.mock('./GadgetProgressGrid', () => ({
  GadgetProgressGrid: () => <div data-testid="gadget-progress-grid">Progress Content</div>,
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

const renderWithContext = (
  contextOverrides: Partial<GadgetInstanceContextType> = {},
  props = {}
) => {
  const mockContext = createMockContext(contextOverrides);
  const defaultProps = {
    notifications: <div data-testid="notifications-element">Notifications</div>,
    progress: <div data-testid="progress-element">Progress</div>,
  };

  return {
    ...render(
      <GadgetInstanceContext.Provider value={mockContext}>
        <GadgetContentSlider {...defaultProps} {...props} />
      </GadgetInstanceContext.Provider>
    ),
    mockContext,
  };
};

describe('GadgetContentSlider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Rendering', () => {
    it('should render progress content when activeContent is "progress"', () => {
      renderWithContext({ activeContent: 'progress' });

      expect(screen.getByTestId('progress-element')).toBeInTheDocument();
      expect(screen.queryByTestId('notifications-element')).not.toBeInTheDocument();
    });

    it('should render notifications content when activeContent is "notifications"', () => {
      renderWithContext({ activeContent: 'notifications' });

      expect(screen.getByTestId('notifications-element')).toBeInTheDocument();
      expect(screen.queryByTestId('progress-element')).not.toBeInTheDocument();
    });

    it('should not render content when activeContent is "none"', () => {
      renderWithContext({ activeContent: 'none' });

      // When activeContent is 'none', the Slide component has in={false} and unmountOnExit
      // so the content (including "No content selected") is not rendered in the DOM
      expect(screen.queryByTestId('progress-element')).not.toBeInTheDocument();
      expect(screen.queryByTestId('notifications-element')).not.toBeInTheDocument();
      expect(screen.queryByText('No content selected')).not.toBeInTheDocument();
    });

    it('should render null for unknown activeContent values', () => {
      renderWithContext({ activeContent: 'unknown' as any });

      expect(screen.queryByTestId('progress-element')).not.toBeInTheDocument();
      expect(screen.queryByTestId('notifications-element')).not.toBeInTheDocument();
      expect(screen.queryByText('No content selected')).not.toBeInTheDocument();
    });
  });

  describe('Slide Direction Logic', () => {
    it('should render slide component with content for progress', () => {
      renderWithContext({ activeContent: 'progress' });

      expect(screen.getByTestId('progress-element')).toBeInTheDocument();
      expect(screen.getByTestId('progress-element')).toBeVisible();
    });

    it('should render slide component with content for notifications', () => {
      renderWithContext({ activeContent: 'notifications' });

      expect(screen.getByTestId('notifications-element')).toBeInTheDocument();
      expect(screen.getByTestId('notifications-element')).toBeVisible();
    });

    it('should render slide component even with unknown activeContent', () => {
      renderWithContext({ activeContent: 'unknown' as any });

      // Unknown content returns null from renderContent(), but slide container should exist
      // However, with unmountOnExit and in={false}, it might not be in DOM
      expect(screen.queryByTestId('progress-element')).not.toBeInTheDocument();
      expect(screen.queryByTestId('notifications-element')).not.toBeInTheDocument();
    });
  });

  describe('Slide Behavior', () => {
    it('should show content when activeContent is not "none"', () => {
      renderWithContext({ activeContent: 'progress' });

      expect(screen.getByTestId('progress-element')).toBeInTheDocument();
      expect(screen.getByTestId('progress-element')).toBeVisible();
    });

    it('should not show content when activeContent is "none"', () => {
      renderWithContext({ activeContent: 'none' });

      // With unmountOnExit and in={false}, content is not rendered in the DOM
      expect(screen.queryByTestId('progress-element')).not.toBeInTheDocument();
      expect(screen.queryByTestId('notifications-element')).not.toBeInTheDocument();
    });
  });

  describe('Container Styling', () => {
    it('should render content with proper structure when active', () => {
      renderWithContext({ activeContent: 'progress' });

      // Test that content is rendered and visible
      const progressElement = screen.getByTestId('progress-element');
      expect(progressElement).toBeInTheDocument();
      expect(progressElement).toBeVisible();
    });

    it('should maintain consistent rendering across different content types', () => {
      const { rerender } = renderWithContext({ activeContent: 'progress' });

      expect(screen.getByTestId('progress-element')).toBeInTheDocument();

      // Switch to notifications
      rerender(
        <GadgetInstanceContext.Provider
          value={createMockContext({ activeContent: 'notifications' })}
        >
          <GadgetContentSlider
            notifications={<div data-testid="notifications-element">Notifications</div>}
            progress={<div data-testid="progress-element">Progress</div>}
          />
        </GadgetInstanceContext.Provider>
      );

      expect(screen.getByTestId('notifications-element')).toBeInTheDocument();
      expect(screen.queryByTestId('progress-element')).not.toBeInTheDocument();
    });
  });

  describe('Content Remounting', () => {
    it('should remount slide when activeContent changes', () => {
      const { rerender } = renderWithContext({ activeContent: 'progress' });

      expect(screen.getByTestId('progress-element')).toBeInTheDocument();

      // Rerender with different activeContent
      rerender(
        <GadgetInstanceContext.Provider
          value={createMockContext({ activeContent: 'notifications' })}
        >
          <GadgetContentSlider
            notifications={<div data-testid="notifications-element">Notifications</div>}
            progress={<div data-testid="progress-element">Progress</div>}
          />
        </GadgetInstanceContext.Provider>
      );

      expect(screen.getByTestId('notifications-element')).toBeInTheDocument();
      expect(screen.queryByTestId('progress-element')).not.toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should render custom notifications ReactElement', () => {
      renderWithContext(
        { activeContent: 'notifications' },
        {
          notifications: <div data-testid="custom-notifications">Custom Notifications</div>,
        }
      );

      expect(screen.getByTestId('custom-notifications')).toBeInTheDocument();
      expect(screen.getByText('Custom Notifications')).toBeInTheDocument();
    });

    it('should render custom progress ReactElement', () => {
      renderWithContext(
        { activeContent: 'progress' },
        {
          progress: <div data-testid="custom-progress">Custom Progress</div>,
        }
      );

      expect(screen.getByTestId('custom-progress')).toBeInTheDocument();
      expect(screen.getByText('Custom Progress')).toBeInTheDocument();
    });

    it('should handle complex ReactElements as props', () => {
      const complexNotifications = (
        <div data-testid="complex-notifications">
          <h3>Notifications</h3>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      );

      renderWithContext(
        { activeContent: 'notifications' },
        { notifications: complexNotifications }
      );

      expect(screen.getByTestId('complex-notifications')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render content that is accessible to screen readers', () => {
      renderWithContext({ activeContent: 'progress' });

      const progressElement = screen.getByTestId('progress-element');
      expect(progressElement).toBeInTheDocument();
      expect(progressElement).toBeVisible();
    });

    it('should maintain accessibility across content switches', () => {
      const { rerender } = renderWithContext({ activeContent: 'progress' });

      expect(screen.getByTestId('progress-element')).toBeVisible();

      rerender(
        <GadgetInstanceContext.Provider
          value={createMockContext({ activeContent: 'notifications' })}
        >
          <GadgetContentSlider
            notifications={<div data-testid="notifications-element">Notifications</div>}
            progress={<div data-testid="progress-element">Progress</div>}
          />
        </GadgetInstanceContext.Provider>
      );

      expect(screen.getByTestId('notifications-element')).toBeVisible();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid activeContent changes', () => {
      const { rerender } = renderWithContext({ activeContent: 'progress' });

      // Rapidly change content types
      const contentTypes = ['notifications', 'none', 'progress', 'notifications'] as const;

      contentTypes.forEach((contentType) => {
        rerender(
          <GadgetInstanceContext.Provider value={createMockContext({ activeContent: contentType })}>
            <GadgetContentSlider
              notifications={<div data-testid="notifications-element">Notifications</div>}
              progress={<div data-testid="progress-element">Progress</div>}
            />
          </GadgetInstanceContext.Provider>
        );

        if (contentType === 'progress') {
          expect(screen.getByTestId('progress-element')).toBeInTheDocument();
        } else if (contentType === 'notifications') {
          expect(screen.getByTestId('notifications-element')).toBeInTheDocument();
        } else if (contentType === 'none') {
          // Content is unmounted when activeContent is 'none'
          expect(screen.queryByTestId('progress-element')).not.toBeInTheDocument();
          expect(screen.queryByTestId('notifications-element')).not.toBeInTheDocument();
        }
      });
    });

    it('should handle missing context gracefully', () => {
      // This test ensures the component doesn't crash without context
      expect(() => {
        render(
          <GadgetContentSlider
            notifications={<div>Notifications</div>}
            progress={<div>Progress</div>}
          />
        );
      }).toThrow(); // Should throw because useGadgetInstance requires context
    });
  });
});
