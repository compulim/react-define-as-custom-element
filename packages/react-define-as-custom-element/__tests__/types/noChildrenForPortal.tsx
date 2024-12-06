import React from 'react';
import { defineAsCustomElementWithPortal } from '../../src/index';

const MyComponent = () => null;

const { Portal } = defineAsCustomElementWithPortal(MyComponent, 'my-component', { value: 'value' });

// @ts-expect-error This JSX tag's 'children' prop expects type 'never' which requires multiple children, but only a single child was provided.
<Portal>Nothing could put here</Portal>;
