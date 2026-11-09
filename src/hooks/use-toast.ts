"use client";

import * as React from "react";
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 4000;

type ToasterToast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type State = { toasts: ToasterToast[] };

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export function reducer(state: State, action: { type: string; toast?: ToasterToast; id?: string }): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast!, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast! } : t
        ),
      };
    case "REMOVE_TOAST":
      if (action.id === undefined) return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };
  }
  return state;
}

export function useToast() {
  const [state, setState] = React.useState<State>({ toasts: [] });

  const dispatch = React.useCallback(
    (action: { type: string; toast?: ToasterToast; id?: string }) =>
      setState((prev) => reducer(prev, action)),
    []
  );

  const toast = React.useCallback(
    (props: { title?: string; description?: string; action?: React.ReactNode }) => {
      const id = genId();
      const update = (next: Partial<ToasterToast>) =>
        dispatch({ type: "UPDATE_TOAST", toast: { ...next, id } });
      const dismiss = () => dispatch({ type: "REMOVE_TOAST", id });

      dispatch({
        type: "ADD_TOAST",
        toast: { id, open: true, ...props },
      });

      setTimeout(() => dismiss(), TOAST_REMOVE_DELAY);
      return { id, dismiss, update };
    },
    [dispatch]
  );

  return { toast, toasts: state.toasts };
}

export {
  ToastProvider,
  ToastViewport,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastTitle,
};
export type { ToasterToast };
