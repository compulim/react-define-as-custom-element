import React from 'react';
import { defineAsCustomElement } from 'react-define-as-custom-element';

const MyButton = () => {
  return <span>Hello, World!</span>;
};

defineAsCustomElement(
  MyButton,
  'built-in-element--my-button',
  {},
  { builtInElement: { customElementConstructor: HTMLButtonElement, extends: 'button' } }
);
