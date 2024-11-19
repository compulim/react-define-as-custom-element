import React, { useEffect } from 'react';
import { defineAsCustomElement, useCustomElement } from 'react-define-as-custom-element';

declare global {
  interface Window {
    __lastClickEvent__: Event | undefined;
  }
}

const MyContainer = () => {
  const [element] = useCustomElement();

  useEffect(() => {
    element.addEventListener('click', event => {
      window.__lastClickEvent__ = event;
    });
  }, [element]);

  return <slot name="body" />;
};

defineAsCustomElement(MyContainer, 'slot-event--my-container', {});
