import { type InvariantOf } from 'type-fest';

export type AttributesMap<N extends string> = Readonly<{
  [attributeName: string]: N extends 'dispatchEvent' ? never : N;
}>;

export type DefineAsCustomElementInit = Readonly<{
  builtInElement?:
    | {
        customElementConstructor: CustomElementConstructor;
        extends: string;
      }
    | undefined;
  shadowRoot?: ShadowRootInit | undefined;
}>;

export type AttributeAsProps<T extends string> = InvariantOf<{ readonly [PropName in T]?: string | undefined }>;
