import React, { memo, useEffect, useMemo, useState, type ReactNode } from 'react';

import AppContext, { type AppContextType } from './private/AppContext.js';

type AppProviderProps = Readonly<{
  children?: ReactNode | undefined;
}>;

const AppProvider = memo(({ children }: AppProviderProps) => {
  const [value, setValue] = useState<string>('');

  const context = useMemo<AppContextType>(() => Object.freeze({ setValue, value }), [setValue, value]);

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date().toLocaleString()), 500);

    return () => clearInterval(interval);
  }, []);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
});

export default memo(AppProvider);
