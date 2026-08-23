import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { MotionConfig } from 'motion/react';
import { router } from '@/app/router/router';
import { overlayTween } from '@/shared/lib';
import { QueryVisibilitySync } from './QueryVisibilitySync';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: true,
        staleTime: 30_000,
      },
    },
  });
}

export function AppProviders() {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <QueryVisibilitySync />
      <MotionConfig reducedMotion="user" transition={overlayTween}>
        <RouterProvider router={router} />
      </MotionConfig>
    </QueryClientProvider>
  );
}
