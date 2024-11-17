/// <reference types="jest" />

import createSignalingState, { type SignalingState } from './signalingState';

describe('after call patchState', () => {
  let nextPromise: Promise<void>;
  let state: SignalingState<number>;

  beforeEach(() => {
    state = createSignalingState(1);
    nextPromise = state.next();

    state.patchState(state => (state || 0) + 1);
  });

  test('should resolve next()', () => expect(nextPromise).resolves.toBeUndefined());
  test('getState() should return 1', () => expect(state.getState()).toBe(2));
});
