import { defineAsCustomElement } from '../index.ts';

type Props = Readonly<{
  value?: number | undefined; // "value" is not a string, should fail typechecking.
}>;

const MyComponent = (_: Props) => null;

// @ts-expect-error Type 'string' is not assignable to type 'number'.
defineAsCustomElement(MyComponent, 'my-component', { value: 'value' });
