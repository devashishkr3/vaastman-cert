'use client';

import { ProgressProvider } from '@bprogress/next/app';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="3px"
      color="#009900"
      options={{ showSpinner: false }}
      shallowRouting={true}
    >
      {children}
    </ProgressProvider>
  );
};

export default Providers;
