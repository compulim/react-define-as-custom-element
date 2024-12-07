import { type AttributeAsProps, type AttributesMap } from '../types.ts';

type MountCallback<P extends object> = (
  props: P,
  element: HTMLElement | ShadowRoot,
  setMethodCallback: (fn: (...args: any[]) => any) => void
) => void;
type UnmountCallback = (element: HTMLElement | ShadowRoot) => void;

export default function createReactCustomElement<T extends string>(
  customElementConstructor: CustomElementConstructor | undefined
) {
  const registry = new FinalizationRegistry((dispose: () => void) => dispose());

  return class ReactCustomElement extends (customElementConstructor || HTMLElement) {
    constructor(
      attributesMap: AttributesMap<T>,
      methodName: string | undefined,
      shadowRootInit: ShadowRootInit | undefined,
      mountCallback: MountCallback<AttributeAsProps<T>>,
      unmountCallback: UnmountCallback
    ) {
      super();

      this.#attributesMap = attributesMap;
      this.#mountCallback = mountCallback;
      this.#unmountCallback = unmountCallback;

      this.#element = shadowRootInit ? this.attachShadow(shadowRootInit) : this;

      if (methodName) {
        (this as any)[methodName] = (...args: any[]) => {
          if (!this.#methodCallback) {
            throw new Error('useMethodCallback() must be called before this method can be called.');
          }

          return this.#methodCallback(...args);
        };
      }

      registry.register(new WeakRef(this), this[Symbol.dispose].bind(this));
    }

    #attributesMap: AttributesMap<T>;
    #connected: boolean = false;
    #element: ReactCustomElement | ShadowRoot;
    #methodCallback: ((...args: any) => any) | undefined;
    #mountCallback: MountCallback<AttributeAsProps<T>>;
    #propsMap: Map<T, string | undefined> = new Map();
    #setMethodCallbackBound = this.#setMethodCallback.bind(this);
    #unmountCallback: UnmountCallback | undefined;
    #version: number = 0;

    [Symbol.dispose]() {
      this.#unmountCallback?.(this.#element);
      this.#unmountCallback = undefined;
    }

    #getProps(): AttributeAsProps<T> {
      return Object.freeze(Object.fromEntries(this.#propsMap.entries()) as AttributeAsProps<T>);
    }

    #refresh() {
      if (this.#connected) {
        const version = ++this.#version;

        queueMicrotask(() => {
          if (version === this.#version) {
            const element = this.#element;

            element && this.#mountCallback(this.#getProps(), element, this.#setMethodCallbackBound);
          }
        });
      }
    }

    #setMethodCallback(fn: (...args: any) => any) {
      this.#methodCallback = fn;
    }

    attributeChangedCallback(name: string, _oldValue: string | undefined, newValue: string | undefined) {
      const propName = this.#attributesMap[name];

      if (propName) {
        this.#propsMap.set(propName, newValue);
        this.#refresh();
      }
    }

    connectedCallback() {
      this.#connected = true;
      this.#refresh();
    }

    disconnectedCallback() {
      this.#connected = false;
    }
  };
}
