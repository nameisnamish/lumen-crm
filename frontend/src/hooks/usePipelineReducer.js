import { useReducer, useCallback, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { leadsApi } from "../lib/services";
import { PIPELINE_STAGES } from "../lib/constants";
import { toast } from "sonner";

/* ── Action types ────────────────────────────────────────────────────── */
export const ACTIONS = {
  SET_BOARD: "SET_BOARD",
  MOVE_DEAL: "MOVE_DEAL",
  REORDER_IN_COLUMN: "REORDER_IN_COLUMN",
  ADD_DEAL: "ADD_DEAL",
  UPDATE_DEAL: "UPDATE_DEAL",
  REMOVE_DEAL: "REMOVE_DEAL",
  ROLLBACK: "ROLLBACK",
};

/* ── Helper: flat lead[] → { [stage]: Lead[] } ───────────────────────── */
export function toBoard(leads) {
  const board = Object.fromEntries(PIPELINE_STAGES.map((s) => [s, []]));
  for (const l of leads) (board[l.status] || board.New).push(l);
  return board;
}

/* ── Reducer ─────────────────────────────────────────────────────────── */
export function pipelineReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_BOARD:
      return { ...state, board: toBoard(action.payload), snapshot: null };

    case ACTIONS.MOVE_DEAL: {
      const { activeId, from, to, overIndex } = action.payload;
      const fromItems = [...state.board[from]];
      const toItems = from === to ? fromItems : [...state.board[to]];
      const idx = fromItems.findIndex((l) => l._id === activeId);
      if (idx === -1) return state;
      const [moved] = fromItems.splice(idx, 1);
      const updatedMoved = { ...moved, status: to };
      toItems.splice(overIndex === -1 ? toItems.length : overIndex, 0, updatedMoved);

      const nextBoard =
        from === to
          ? { ...state.board, [from]: toItems }
          : { ...state.board, [from]: fromItems, [to]: toItems };

      return { ...state, board: nextBoard, snapshot: state.board };
    }

    case ACTIONS.REORDER_IN_COLUMN: {
      const { container, oldIndex, newIndex } = action.payload;
      const items = [...state.board[container]];
      const reordered = arrayMove(items, oldIndex, newIndex);
      return {
        ...state,
        board: { ...state.board, [container]: reordered },
        snapshot: state.board,
      };
    }

    case ACTIONS.ADD_DEAL: {
      const lead = action.payload;
      const stage = lead.status || "New";
      return {
        ...state,
        board: {
          ...state.board,
          [stage]: [lead, ...state.board[stage]],
        },
      };
    }

    case ACTIONS.UPDATE_DEAL: {
      const updated = action.payload;
      const nextBoard = { ...state.board };
      // Remove from any column it may currently exist in
      for (const stage of PIPELINE_STAGES) {
        nextBoard[stage] = nextBoard[stage].filter((l) => l._id !== updated._id);
      }
      // Add to the correct stage
      const targetStage = updated.status || "New";
      nextBoard[targetStage] = [updated, ...nextBoard[targetStage]];
      return { ...state, board: nextBoard };
    }

    case ACTIONS.REMOVE_DEAL: {
      const id = action.payload;
      const nextBoard = { ...state.board };
      for (const stage of PIPELINE_STAGES) {
        nextBoard[stage] = nextBoard[stage].filter((l) => l._id !== id);
      }
      return { ...state, board: nextBoard };
    }

    case ACTIONS.ROLLBACK:
      return state.snapshot
        ? { ...state, board: state.snapshot, snapshot: null }
        : state;

    default:
      return state;
  }
}

/* ── Hook ────────────────────────────────────────────────────────────── */
export function usePipelineReducer() {
  const [state, dispatch] = useReducer(pipelineReducer, {
    board: null,
    snapshot: null,
  });

  /* Initial load */
  const loadBoard = useCallback(async () => {
    try {
      const res = await leadsApi.list();
      dispatch({ type: ACTIONS.SET_BOARD, payload: res.leads || [] });
    } catch {
      dispatch({ type: ACTIONS.SET_BOARD, payload: [] });
      toast.error("Failed to load pipeline");
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  /* Persist reorder to backend — optimistic with rollback */
  const persistBoard = useCallback(
    async (board) => {
      const updates = [];
      PIPELINE_STAGES.forEach((stage) => {
        board[stage].forEach((l, order) =>
          updates.push({ id: l._id, status: stage, order })
        );
      });
      try {
        await leadsApi.reorder(updates);
      } catch {
        toast.error("Could not save pipeline — reverting");
        dispatch({ type: ACTIONS.ROLLBACK });
      }
    },
    []
  );

  const moveDeal = useCallback(
    (activeId, from, to, overIndex) => {
      dispatch({
        type: ACTIONS.MOVE_DEAL,
        payload: { activeId, from, to, overIndex },
      });
    },
    []
  );

  const reorderInColumn = useCallback(
    (container, oldIndex, newIndex) => {
      dispatch({
        type: ACTIONS.REORDER_IN_COLUMN,
        payload: { container, oldIndex, newIndex },
      });
    },
    []
  );

  const addDeal = useCallback((lead) => {
    dispatch({ type: ACTIONS.ADD_DEAL, payload: lead });
  }, []);

  const updateDeal = useCallback((lead) => {
    dispatch({ type: ACTIONS.UPDATE_DEAL, payload: lead });
  }, []);

  const removeDeal = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_DEAL, payload: id });
  }, []);

  return {
    board: state.board,
    dispatch,
    moveDeal,
    reorderInColumn,
    persistBoard,
    addDeal,
    updateDeal,
    removeDeal,
    refetch: loadBoard,
  };
}
