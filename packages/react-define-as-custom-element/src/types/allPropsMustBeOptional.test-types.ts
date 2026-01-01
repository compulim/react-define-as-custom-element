import { defineAsCustomElement } from '../index.ts';

type Props = Readonly<{
  value: string; // "value" is not optional, should fail typechecking.
}>;

const MyComponent = (_: Props) => null;

// @ts-expect-error  Type 'string | undefined' is not assignable to type 'string'.
defineAsCustomElement(MyComponent, 'my-component', { value: 'value' });
