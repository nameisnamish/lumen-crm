import { describe, it, expect } from "vitest";
import { pipelineReducer, ACTIONS, toBoard } from "../../src/hooks/usePipelineReducer";

describe("pipelineReducer", () => {
  const getMockLeads = () => [
    { _id: "1", name: "Lead 1", status: "New", value: 1000 },
    { _id: "2", name: "Lead 2", status: "Qualified", value: 2000 },
    { _id: "3", name: "Lead 3", status: "New", value: 3000 },
  ];

  it("should initialize board correctly with toBoard", () => {
    const board = toBoard(getMockLeads());
    expect(board.New).toHaveLength(2);
    expect(board.Qualified).toHaveLength(1);
    expect(board.Proposal).toHaveLength(0);
  });

  it("should handle SET_BOARD action", () => {
    const initialState = { board: {}, snapshot: null };
    const state = pipelineReducer(initialState, {
      type: ACTIONS.SET_BOARD,
      payload: getMockLeads(),
    });
    expect(state.board.New).toHaveLength(2);
    expect(state.board.Qualified).toHaveLength(1);
    expect(state.snapshot).toBeNull();
  });

  it("should move deal between columns and save snapshot for optimistic updates", () => {
    const board = toBoard(getMockLeads());
    const initialState = { board, snapshot: null };

    const state = pipelineReducer(initialState, {
      type: ACTIONS.MOVE_DEAL,
      payload: { activeId: "1", from: "New", to: "Proposal", overIndex: 0 },
    });

    expect(state.board.New).toHaveLength(1);
    expect(state.board.Proposal).toHaveLength(1);
    expect(state.board.Proposal[0]._id).toBe("1");
    expect(state.board.Proposal[0].status).toBe("Proposal");
    expect(state.snapshot).toEqual(board);
  });

  it("should rollback to snapshot on ROLLBACK action", () => {
    const board = toBoard(getMockLeads());
    const movedState = pipelineReducer(
      { board, snapshot: null },
      {
        type: ACTIONS.MOVE_DEAL,
        payload: { activeId: "1", from: "New", to: "Proposal", overIndex: 0 },
      }
    );

    expect(movedState.board.Proposal).toHaveLength(1);

    const rollbackedState = pipelineReducer(movedState, { type: ACTIONS.ROLLBACK });
    expect(rollbackedState.board.New).toHaveLength(2);
    expect(rollbackedState.board.Proposal).toHaveLength(0);
    expect(rollbackedState.snapshot).toBeNull();
  });

  it("should add a deal to the appropriate column with ADD_DEAL", () => {
    const board = toBoard(getMockLeads());
    const newDeal = { _id: "4", name: "New Lead", status: "Proposal", value: 5000 };

    const state = pipelineReducer({ board, snapshot: null }, {
      type: ACTIONS.ADD_DEAL,
      payload: newDeal,
    });

    expect(state.board.Proposal).toHaveLength(1);
    expect(state.board.Proposal[0].name).toBe("New Lead");
  });

  it("should remove a deal with REMOVE_DEAL", () => {
    const board = toBoard(getMockLeads());
    const state = pipelineReducer({ board, snapshot: null }, {
      type: ACTIONS.REMOVE_DEAL,
      payload: "1",
    });

    expect(state.board.New).toHaveLength(1);
    expect(state.board.New.find((l) => l._id === "1")).toBeUndefined();
  });
});
