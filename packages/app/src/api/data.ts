import { ColumnTypes } from "@visdesignlab/upset2-core";
import { Paginated, TableRow } from "multinet";
import { api } from "./api";

/**
 * Retrieves a table from the specified workspace.
 * 
 * @param {string} workspace - The name of the workspace.
 * @param {string} table - The name of the table to retrieve.
 * @returns {Promise<Paginated<TableRow>>} - A promise that resolves to the retrieved table.
 */
export async function getTable(workspace: string, table: string): Promise<Paginated<TableRow>> {
  return (
    api.table(workspace, table, {
      limit: Number.MAX_SAFE_INTEGER,
    })
  );
}

/**
 * Retrieves the column types for a given workspace and table.
 * 
 * @param {string} workspace - The name of the workspace.
 * @param {string} table - The name of the table.
 * @returns {Promise<ColumnTypes>} - A promise that resolves to the column types.
 */
export async function getColumnTypes(workspace: string, table: string): Promise<ColumnTypes> {
  return (
    api.columnTypes(workspace, table)
  );
}
