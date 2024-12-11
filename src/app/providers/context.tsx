"use client";

import { createContext, useReducer } from "react";
import { initialState, contextReducerActionType, reducer } from "./generalReducer";



export const generalContext = createContext({
  context: initialState,
  dispatch: {} as React.Dispatch<contextReducerActionType>,
});

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <generalContext.Provider value={{ context:state, dispatch }}>
      {children}
    </generalContext.Provider>
  );
}
