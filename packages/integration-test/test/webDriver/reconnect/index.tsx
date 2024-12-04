import React, { useEffect } from 'react';
import { defineAsCustomElement } from 'react-define-as-custom-element';

declare global {
  interface Window {
    __connectedCallback__: { mock: { calls: unknown[][] } };
    __disconnectedCallback__: { mock: { calls: unknown[][] } };
    __mount__: { mock: { calls: unknown[][] } };
    __render__: { mock: { calls: unknown[][] } };
    __unmount__: { mock: { calls: unknown[][] } };
  }
}

const Header = ({ value }: { value?: string | undefined }) => {
  window.__render__.mock.calls.push([value]);

  useEffect(() => {
    window.__mount__.mock.calls.push([]);

    return () => {
      window.__unmount__.mock.calls.push([]);
    };
  }, []);

  return <h1>{value}</h1>;
};

defineAsCustomElement(Header, 'reconnect--header', { value: 'value' });

interface CustomElementConstructorWithLifecycleMethods {
  new (...params: any[]): HTMLElement & {
    adoptedCallback?(): void;
    attributeChangedCallback?(name: string, oldValue: string | undefined, newValue: string | undefined): void;
    connectedCallback?(): void;
    disconnectedCallback?(): void;
  };
}

const customElementConstructor = customElements.get('reconnect--header') as
  | CustomElementConstructorWithLifecycleMethods
  | undefined;

window.__connectedCallback__ = { mock: { calls: [] } };
window.__disconnectedCallback__ = { mock: { calls: [] } };
window.__mount__ = { mock: { calls: [] } };
window.__render__ = { mock: { calls: [] } };
window.__unmount__ = { mock: { calls: [] } };

customElementConstructor &&
  customElements.define(
    'reconnect--intercepted-header',
    class InterceptedClass extends customElementConstructor {
      override connectedCallback() {
        super.connectedCallback?.();

        window.__connectedCallback__.mock.calls.push([]);

        console.log('connectedCallback');
      }

      override disconnectedCallback() {
        super.disconnectedCallback?.();

        window.__disconnectedCallback__.mock.calls.push([]);

        console.log('disconnectedCallback');
      }
    }
  );
