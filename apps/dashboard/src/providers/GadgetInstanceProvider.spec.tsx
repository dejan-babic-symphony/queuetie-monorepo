import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GadgetProvider } from './GadgetInstanceProvider';
import { GadgetInstanceContext } from './GadgetInstanceContext';

describe('GadgetInstanceProvider', () => {
  it('should be an alias for GadgetInstanceContext.Provider', () => {
    expect(GadgetProvider).toBe(GadgetInstanceContext.Provider);
  });

  it('should render children when provided with context value', () => {
    const mockContextValue = {
      socketOn: true,
      isGroup: false,
      contentToggled: false,
      dispatchEnabled: true,
      client: null,
      organization: null,
      progressControls: {},
      notifications: [],
      handleToggleSocket: () => {},
      handleContentToggle: () => {},
      handleSimulateDispatch: () => {},
      handleClearNotifications: () => {},
      handleGroupBroadcast: () => {},
      handleGroupAdd: () => {},
      handleGroupLeave: () => {},
      handleRemove: () => {},
    };

    const { getByText } = render(
      <GadgetProvider value={mockContextValue}>
        <div>Test Child</div>
      </GadgetProvider>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should pass through provider props correctly', () => {
    const mockContextValue = {
      socketOn: false,
      isGroup: true,
      contentToggled: true,
      dispatchEnabled: false,
      client: { id: 'test-client', name: 'Test Client' },
      organization: { id: 'test-org', name: 'Test Organization' },
      progressControls: { 'test-id': { id: 'test-id', progress: 50, status: 1 } },
      notifications: [
        {
          type: 'test',
          message: 'Test message',
          from: 'Test',
          timestamp: '2025-01-01T00:00:00.000Z',
        },
      ],
      handleToggleSocket: () => {},
      handleContentToggle: () => {},
      handleSimulateDispatch: () => {},
      handleClearNotifications: () => {},
      handleGroupBroadcast: () => {},
      handleGroupAdd: () => {},
      handleGroupLeave: () => {},
      handleRemove: () => {},
    };

    const TestComponent = () => {
      const context = React.useContext(GadgetInstanceContext);
      return <div data-testid="context-data">{JSON.stringify(context?.socketOn)}</div>;
    };

    const { getByTestId } = render(
      <GadgetProvider value={mockContextValue}>
        <TestComponent />
      </GadgetProvider>
    );

    expect(getByTestId('context-data')).toHaveTextContent('false');
  });
});
