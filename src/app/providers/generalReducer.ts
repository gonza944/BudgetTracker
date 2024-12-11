export type contextReducerActionType =
  | {
      type: "SET_PROJECT";
      payload: string;
    }
  | {
      type: "SET_SELECTED_EXPENSES_DAY";
      payload: Date;
    } | {
      type: "TRIGGER_EXPENSES_RELOAD";
    } | {
      type: "EXPENSES_RELOADED";
    };
export type contextStateType = {
  currentProject: string;
  selectedExpensesDay: Date;
  triggerExpensesReload: boolean;
};

export const initialState: contextStateType = {
  currentProject: "project:viaje-europa-2024",
  selectedExpensesDay: new Date(),
  triggerExpensesReload: false,
};

export const reducer = (
  state: contextStateType,
  action: contextReducerActionType
) => {
  switch (action.type) {
    case "SET_PROJECT":
      return {
        ...state,
        currentProject: action.payload,
        triggerExpensesReload: true,
      };
    case "SET_SELECTED_EXPENSES_DAY":
      return {
        ...state,
        selectedExpensesDay: action.payload,
        triggerExpensesReload: true,
      };
    case "TRIGGER_EXPENSES_RELOAD":
      return {
        ...state,
        triggerExpensesReload: true,
      };
    case "EXPENSES_RELOADED":
      return {
        ...state,
        triggerExpensesReload: false,
      };
    default:
      return state;
  }
};
