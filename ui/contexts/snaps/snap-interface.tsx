import {
  FormState,
  InterfaceState,
  UserInputEventType,
} from '@metamask/snaps-sdk';
import { debounce } from 'lodash';
import React, {
  FunctionComponent,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMemoizedInterface } from '../../selectors';
import { handleSnapRequest, updateInterfaceState } from '../../store/actions';
import { mergeValue } from './utils';

export type HandleEvent = (event: UserInputEventType, name?: string) => void;

export type HandleInputChange = (
  name: string,
  value: string | null,
  form?: string,
) => void;

export type GetValue = (name: string, form?: string) => string | undefined;

export type SnapInterfaceContextType = {
  handleEvent: HandleEvent;
  getValue: GetValue;
  handleInputChange: HandleInputChange;
};

export const SnapInterfaceContext =
  createContext<SnapInterfaceContextType | null>(null);

export type SnapInterfaceContextProviderProps = {
  interfaceId: string;
  snapId: string;
};

/**
 * The Snap interface context provider that handles all the interface state operations.
 *
 * @param params - The context provider params.
 * @param params.children - The childrens to wrap with the context provider.
 * @param params.interfaceId - The interface ID to use.
 * @param params.snapId - The Snap ID that requested the interface.
 * @returns The context provider.
 */
export const SnapInterfaceContextProvider: FunctionComponent<
  SnapInterfaceContextProviderProps
> = ({ children, interfaceId, snapId }) => {
  const dispatch = useDispatch();
  const { state: initialState } = useSelector(
    (state) => getMemoizedInterface(state, interfaceId),
    // Prevents the selector update.
    // We do this to avoid useless re-renders.
    () => true,
  );

  // We keep an internal copy of the state to speed-up the state update in the UI.
  // It's kept in a ref to avoid useless re-rendering of the entire tree of components.
  const internalState = useRef<InterfaceState>(initialState ?? {});

  // Since the internal state is kept in a reference, it won't update when the interface is updated.
  // We have to manually update it
  useEffect(() => {
    internalState.current = initialState;
  }, [initialState]);

  // The submittion of user input events is debounced to avoid crashing the snap if
  // there's too much events sent at the same time
  const snapRequestDebounced: HandleEvent = debounce(
    (event, name) =>
      handleSnapRequest({
        snapId,
        origin: '',
        handler: 'onUserInput',
        request: {
          jsonrpc: '2.0',
          method: ' ',
          params: {
            event: {
              type: event,
              name,
              value: internalState.current[name],
            },
            id: interfaceId,
          },
        },
      }),
    200,
  );

  // The update of the state is debounced to avoid crashes due to too much
  // updates in a short amount of time.
  const updateStateDebounced = debounce(
    (state) => dispatch(updateInterfaceState(interfaceId, state)),
    200,
  );

  /**
   * Handle the submission of an user input event to the Snap.
   *
   * @param event - The event object.
   * @param name - The name of the component emmitting the event.
   */
  const handleEvent: HandleEvent = (event, name) => {
    updateStateDebounced.flush();
    snapRequestDebounced(event, name);
  };

  /**
   * Handle the value change of an input.
   *
   * @param name - The name of the input.
   * @param value - The new value.
   * @param form - The name of the form containing the input.
   * Optional if the input is not contained in a form.
   */
  const handleInputChange: HandleInputChange = (name, value, form) => {
    const state = mergeValue(internalState.current, name, value, form);

    internalState.current = state;
    updateStateDebounced(state);
  };

  /**
   * Get the value of an input from the interface state.
   *
   * @param name - The name of the input.
   * @param form - The name of the form containing the input.
   * Optional if the input is not contained in a form.
   * @returns The value of the input or undefinded if the input has no value.
   */
  const getValue: GetValue = (name, form) => {
    const value = form
      ? (initialState[form] as FormState)?.[name]
      : (initialState as FormState)?.[name];

    if (value) {
      return value;
    }

    return undefined;
  };

  return (
    <SnapInterfaceContext.Provider
      value={{ handleEvent, getValue, handleInputChange }}
    >
      {children}
    </SnapInterfaceContext.Provider>
  );
};

/**
 * The utility hook to consume the Snap inteface context.
 *
 * @returns The snap interface context.
 */
export function useSnapInterfaceContext() {
  return useContext(SnapInterfaceContext) as SnapInterfaceContextType;
}
