/**
 * Exec Positions
 * 
 * Hardcoded list of available executive positions for the onboarding form.
 * In the future, fetch these from `exec_positions` table via API.
 */

export const EXEC_POSITIONS = [
    {id: 1, name: "President"},
    {id: 2, name: "VP Marketing"},
    {id: 3, name: "VP Finance"},
    {id: 4, name: "VP Events"},
    {id: 5, name: "VP Academic"},
    {id: 6, name: "VP Operations"}
] as const;

export type ExecPositionName = typeof EXEC_POSITIONS[number];