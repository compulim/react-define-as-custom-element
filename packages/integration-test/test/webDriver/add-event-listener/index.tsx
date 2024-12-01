import React, { useCallback, useEffect } from 'react';
import { defineAsCustomElement, useCustomElement } from 'react-define-as-custom-element';

const MyForm = () => {
  const [element] = useCustomElement();

  const handleClick = useCallback((event: Event) => {
    '__handleClick__' in window &&
      typeof window.__handleClick__ === 'function' &&
      window.__handleClick__({ tagName: (event.target as HTMLElement).tagName, type: event.type });
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    element?.addEventListener('click', handleClick, { signal: abortController.signal });

    return () => abortController.abort();
  }, [handleClick]);

  return <slot />;
};

defineAsCustomElement(MyForm, 'add-event-listener--my-form', {}, { shadowRoot: { mode: 'open' } });
