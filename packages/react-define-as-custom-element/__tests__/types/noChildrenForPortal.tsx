import React from 'react';
import { defineAsCustomElementWithPortal } from '../../src/index';

const MyComponent = () => null;

const { Portal } = defineAsCustomElementWithPortal(MyComponent, 'my-component', { value: 'value' });

// @ts-expect-error Type '{ children: string; }' has no properties in common with type 'IntrinsicAttributes'.
<Portal>Nothing could put here</Portal>;
