import { defineAsCustomElement, useMethodCallback } from 'react-define-as-custom-element';

const MyValue = () => {
  useMethodCallback('setValue', () => {});
  useMethodCallback('setValue', () => {}); // Should throw on calling.

  return false;
};

defineAsCustomElement(MyValue, 'use-method-callback-dupe--my-value', {});
