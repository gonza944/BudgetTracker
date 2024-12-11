import { contextStateType } from "./generalReducer";

export const getCurrentProject = (state: contextStateType) =>
  state.currentProject;
export const getSelectedExpensesDay = (state: contextStateType) =>
  state.selectedExpensesDay;
export const getTriggerExpensesReload = (state: contextStateType) =>
  state.triggerExpensesReload;
