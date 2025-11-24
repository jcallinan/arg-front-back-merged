import React from 'react';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { store } from '@/store/store';

// Create a new QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  route?: string;
}

const AllTheProviders = ({ children, route = '/' }: { children: React.ReactNode; route?: string }) => {
  const queryClient = createTestQueryClient();

  // Mock window.location for routing tests
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route);
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ConfigProvider
            theme={{
              token: {
                colorPrimaryBorder: '#2d2d2d',
                colorPrimaryHover: '#2d2d2d',
              },
            }}
          >
            {children}
          </ConfigProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { route, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders route={route}>{children}</AllTheProviders>,
    ...renderOptions,
  });
};

// Re-export everything needed from React Testing Library
export * from '@testing-library/react';

export { render as customRender }; // Already defined above as `customRender`
export { screen, fireEvent } from '@testing-library/react';


// Override render method
export { customRender as render }; 