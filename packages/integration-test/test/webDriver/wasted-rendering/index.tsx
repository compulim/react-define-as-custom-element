import React from 'react';
import { defineAsCustomElement } from 'react-define-as-custom-element';

declare global {
  interface Window {
    __numRendered__: number;
  }
}

window.__numRendered__ = 0;

const Header = ({ value }: { value?: string | undefined }) => {
  // eslint-disable-next-line react-hooks/immutability
  window.__numRendered__++;

  return <h1>{value}</h1>;
};

defineAsCustomElement(Header, 'wasted-rendering--header', { value: 'value' });
