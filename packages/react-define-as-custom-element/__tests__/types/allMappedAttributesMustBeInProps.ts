import { defineAsCustomElement } from '../../src/index';

type Props = Readonly<{
  value?: string | undefined;
}>;

const MyComponent = (_props: Props) => null;

// @ts-expect-error has no properties in common with type 'Readonly<{ value?: string | undefined; }>'.
defineAsCustomElement(MyComponent, 'my-component', { attr: 'propName' });
