import React from 'react';
import { defineAsCustomElementWithPortal } from '../../src/index';

const MyComponent = () => null;

const { Portal } = defineAsCustomElementWithPortal(MyComponent, 'my-component', { value: 'value' });

// @ts-expect-error 'Portal' components don't accept text as child elements. Text in JSX has the type 'string', but the expected type of 'children' is 'undefined'.
<Portal>Nothing could put here</Portal>;
