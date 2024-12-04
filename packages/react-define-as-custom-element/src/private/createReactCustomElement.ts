import { type AttributeAsProps, type AttributesMap } from '../types.ts';

type MountCallback<P extends object> = (props: P, element: HTMLElement | ShadowRoot) => void;
type UnmountCallback = (element: HTMLElement | ShadowRoot) => void;

export default function createReactCustomElement<T extends string>(
  customElementConstructor: CustomElementConstructor | undefined
) {
  return class ReactCustomElement extends (customElementConstructor || HTMLElement) {
    constructor(
      attributesMap: AttributesMap<T>,
      shadowRootInit: ShadowRootInit | undefined,
      mountCallback: MountCallback<AttributeAsProps<T>>,
      unmountCallback: UnmountCallback
    ) {
      super();

      this.#attributesMap = attributesMap;
      this.#mountCallback = mountCallback;
      this.#shadowRootInit = shadowRootInit;
      this.#unmountCallback = unmountCallback;
    }

    #attributesMap: AttributesMap<T>;
    #element: HTMLElement | ShadowRoot | undefined;
    #mountCallback: MountCallback<AttributeAsProps<T>>;
    #propsMap: Map<T, string | undefined> = new Map();
    #shadowRootInit: ShadowRootInit | undefined;
    #unmountCallback: UnmountCallback;

    #getProps(): AttributeAsProps<T> {
      return Object.freeze(Object.fromEntries(this.#propsMap.entries()) as AttributeAsProps<T>);
    }

    #refresh() {
      const element = this.#element;

      element && this.#mountCallback(this.#getProps(), element);
    }

    attributeChangedCallback(name: string, _oldValue: string | undefined, newValue: string | undefined) {
      const propName = this.#attributesMap[name];

      if (propName) {
        this.#propsMap.set(propName, newValue);

        this.#refresh();
      }
    }

    connectedCallback() {
      const shadowRootInit = this.#shadowRootInit;

      this.#element = shadowRootInit ? this.attachShadow(shadowRootInit) : this;

      this.#refresh();
    }

    disconnectedCallback() {
      const element = this.#element;

      element && this.#unmountCallback(element);
    }
  };
}
