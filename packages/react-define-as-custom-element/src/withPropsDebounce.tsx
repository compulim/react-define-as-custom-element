import { type ComponentType, createElement, memo, useEffect, useState } from 'react';

const withPropsDebounce = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const PropsDebounceComponent = (props: P) => {
    const [debouncedProps, setDebouncedProps] = useState<P>(props);

    useEffect(() => {
      const handler = setTimeout(() => debouncedProps !== props && setDebouncedProps(props), 0);

      return () => clearTimeout(handler);
    }, [props, setDebouncedProps]);

    return createElement(WrappedComponent, debouncedProps);
  };

  PropsDebounceComponent.displayName = `${WrappedComponent.displayName}WithPropsDebounce`;

  return memo(PropsDebounceComponent);
};

export default withPropsDebounce;
