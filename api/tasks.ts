/**
 * Tasks API
 * Example API interface for task operations
 */

import { getDatabase } from "@/database";

export interface Task {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all tasks
 */
export async function getTasks(): Promise<Task[]> {
  const db = await getDatabase();
  const result = await db.getAllAsync("SELECT * FROM tasks ORDER BY created_at DESC");
  return result as Task[];
}

/**
 * Create a new task
 */
export async function createTask(name: string): Promise<Task> {
  const db = await getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    "INSERT INTO tasks (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)",
    id,
    name,
    now,
    now
  );

  return { id, name, createdAt: now, updatedAt: now };
}

/**
 * Update a task
 */
export async function updateTask(id: string, name: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    "UPDATE tasks SET name = ?, updated_at = ? WHERE id = ?",
    name,
    now,
    id
  );
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM tasks WHERE id = ?", id);
}
