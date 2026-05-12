# Database Design: Cyclic Tasks & Multi-Dimensional Goals

## 背景

Saikuru 是一个习惯追踪应用，当前数据库层为 demo 状态，可全新设计。需求核心：
1. **周期性任务**：每 X 天/周/月为一个周期，可设起止日或无限循环
2. **周期目标模板**：每个周期需达成一组目标（打卡天数、累计次数、累计时长），所有周期共用同一套模板
3. **整体任务目标**：一个任务可同时有多个长期目标（坚持 streak、累计次数/时长）

## 关键设计决策

- **不存储周期实体**：周期边界通过 `cycle_start_date + cycle_type + cycle_length` 计算得出，避免周期同步/生成逻辑
- **目标模板绑定任务**：`task_targets` 为任务级配置，所有周期自动继承
- **多整体目标**：`task_goals` 独立表，支持每个任务多个长期目标，带 `current_value` 缓存减少聚合查询

## Schema

### tasks
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | UUID |
| name | TEXT NOT NULL | 任务名称 |
| description | TEXT | 描述 |
| icon | TEXT | 图标名 |
| color | TEXT | 主题色 |
| cycle_type | TEXT NOT NULL | `days` / `weeks` / `months` |
| cycle_length | INTEGER NOT NULL DEFAULT 1 | 每周期长度（如 7 天） |
| cycle_start_date | TEXT NOT NULL | 首周期起始日 `YYYY-MM-DD` |
| is_infinite | INTEGER NOT NULL DEFAULT 1 | 1=无限循环，0=有结束日 |
| task_end_date | TEXT | 任务结束日（is_infinite=0 时必填） |
| target_logic | TEXT NOT NULL DEFAULT 'and' | 多周期目标逻辑 `and` / `or` |
| is_active | INTEGER NOT NULL DEFAULT 1 | 软删除标记 |
| created_at | TEXT NOT NULL | ISO8601 |
| updated_at | TEXT NOT NULL | ISO8601 |

### task_targets（周期目标模板，1:N）
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | UUID |
| task_id | TEXT NOT NULL FK -> tasks(id) ON DELETE CASCADE | |
| target_type | TEXT NOT NULL | `frequency`（打卡天数）/ `count`（累计次数）/ `duration`（累计分钟） |
| target_value | INTEGER NOT NULL | 目标数值 |
| operator | TEXT NOT NULL DEFAULT 'gte' | `gte` / `lte` / `eq` |
| created_at | TEXT NOT NULL | |
| updated_at | TEXT NOT NULL | |

### task_goals（整体任务目标，1:N）
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | UUID |
| task_id | TEXT NOT NULL FK -> tasks(id) ON DELETE CASCADE | |
| goal_type | TEXT NOT NULL | `streak` / `total_count` / `total_duration` |
| target_value | INTEGER NOT NULL | 目标值 |
| current_value | INTEGER NOT NULL DEFAULT 0 | 当前进度（缓存） |
| status | TEXT NOT NULL DEFAULT 'active' | `active` / `achieved` / `failed` / `abandoned` |
| created_at | TEXT NOT NULL | |
| updated_at | TEXT NOT NULL | |

### daily_records（每日打卡记录，1:N）
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | UUID |
| task_id | TEXT NOT NULL FK -> tasks(id) ON DELETE CASCADE | |
| date | TEXT NOT NULL | `YYYY-MM-DD` |
| count | INTEGER NOT NULL DEFAULT 0 | 当日次数 |
| duration | INTEGER NOT NULL DEFAULT 0 | 当日时长（分钟） |
| notes | TEXT | 备注 |
| created_at | TEXT NOT NULL | |
| updated_at | TEXT NOT NULL | |

### Indexes
```sql
CREATE INDEX idx_task_targets_task ON task_targets(task_id);
CREATE INDEX idx_task_goals_task ON task_goals(task_id);
CREATE INDEX idx_records_task_date ON daily_records(task_id, date);
CREATE INDEX idx_records_date ON daily_records(date);
```

## TypeScript Models

```ts
// server/models/task.ts
export type CycleType = "days" | "weeks" | "months";
export type TargetLogic = "and" | "or";

export interface Task {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  cycleType: CycleType;
  cycleLength: number;
  cycleStartDate: string;
  isInfinite: boolean;
  taskEndDate: string | null;
  targetLogic: TargetLogic;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;

// server/models/task-target.ts
export type TargetType = "frequency" | "count" | "duration";
export type TargetOperator = "gte" | "lte" | "eq";

export interface TaskTarget {
  id: string;
  taskId: string;
  targetType: TargetType;
  targetValue: number;
  operator: TargetOperator;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskTargetInput = Omit<TaskTarget, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskTargetInput = Partial<Omit<TaskTarget, "id" | "taskId" | "createdAt" | "updatedAt">>;

// server/models/task-goal.ts
export type GoalType = "streak" | "total_count" | "total_duration";
export type GoalStatus = "active" | "achieved" | "failed" | "abandoned";

export interface TaskGoal {
  id: string;
  taskId: string;
  goalType: GoalType;
  targetValue: number;
  currentValue: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskGoalInput = Omit<TaskGoal, "id" | "currentValue" | "status" | "createdAt" | "updatedAt">;
export type UpdateTaskGoalInput = Partial<Omit<TaskGoal, "id" | "taskId" | "createdAt" | "updatedAt">>;

// server/models/record.ts
export interface DailyRecord {
  id: string;
  taskId: string;
  date: string;
  count: number;
  duration: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateRecordInput = Omit<DailyRecord, "id" | "createdAt" | "updatedAt">;
export type UpdateRecordInput = Partial<Omit<DailyRecord, "id" | "taskId" | "date" | "createdAt" | "updatedAt">>;
```

## 周期计算工具函数

所有周期相关的业务逻辑都放在 `server/` 下，方便后续直接迁移到云端。

```ts
// server/utils/cycle.ts
export function getCycleNumber(
  startDate: string,
  cycleType: CycleType,
  cycleLength: number,
  date: string
): number;

export function getCycleDateRange(
  startDate: string,
  cycleType: CycleType,
  cycleLength: number,
  cycleNumber: number
): [start: string, end: string];

export function getCurrentCycleNumber(task: Task): number;

export function isDateInTaskRange(task: Task, date: string): boolean;
```

周期边界为**左闭右开** `[start, end)`，便于 SQL 范围查询。

## Store 层

### server/store/task.ts
- `getAllTasks()` -- 列出所有活跃任务
- `getTaskById(id)` -- 含关联的 task_targets 和 task_goals
- `createTask(input, targets?, goals?)` -- 创建任务，可选批量插入目标和整体目标
- `updateTask(id, input)` -- 更新任务配置
- `deleteTask(id)` -- 级联删除（FK ON DELETE CASCADE）

### server/store/task-target.ts
- `getTargetsByTask(taskId)` -- 获取任务的周期目标模板
- `createTarget(input)` / `updateTarget(id, input)` / `deleteTarget(id)`
- `batchReplaceTargets(taskId, targets[])` -- 全量替换（编辑任务时使用）

### server/store/task-goal.ts
- `getGoalsByTask(taskId)` -- 获取任务的所有整体目标
- `createGoal(input)` / `updateGoal(id, input)` / `deleteGoal(id)`
- `recomputeGoalProgress(taskId)` -- 从 daily_records 重新计算 current_value 和 status

### server/store/record.ts
- `getRecordsByTaskAndDate(taskId, date)`
- `getRecordsByTaskAndDateRange(taskId, start, end)` -- 用于周期进度聚合
- `getRecordsByTask(taskId, limit?, offset?)`
- `createRecord(input)` -- 插入后触发 goal 进度重算
- `updateRecord(id, input)` -- 若 count/duration 变化，触发 goal 进度重算
- `deleteRecord(id)` -- 触发 goal 进度重算

## 进度查询模式

**周期进度**：
1. 用 `getCycleDateRange` 计算周期日期范围
2. `SELECT SUM(count), SUM(duration), COUNT(DISTINCT date) FROM daily_records WHERE task_id = ? AND date >= ? AND date < ?`
3. 与 `task_targets` 逐项比对

**整体目标进度**：读取 `task_goals.current_value`（缓存），或按需 `recomputeGoalProgress` 重新计算。

## 实现顺序

1. **Schema & 连接层**：重写 `server/db/connection.ts` 创建新表
2. **工具函数**：`server/utils/cycle.ts` 周期计算
3. **Model 类型**：新增/修改 model 文件
4. **Store 层**：实现所有 CRUD
5. **进度查询**：封装周期进度聚合和整体目标重算
