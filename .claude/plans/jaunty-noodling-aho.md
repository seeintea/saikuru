# 数据来源迭代计划

## 项目背景
当前项目是一个纯前端的 Expo React Native 应用，所有数据都使用本地 mock 生成，仅在当前会话有效。用户希望分两步实现数据持久化和后端迁移。

## 总体目标
1. **第一步**：将数据存储方式从内存 mock 改为 SQLite 本地数据库
2. **第二步**：迁移到后端服务（REST API + 数据库）

## 当前数据结构概览

### 核心数据类型 (`/features/task-cycle/types/index.ts`)
```typescript
// 任务完成状态
type TaskCompletionStatus = 'completed' | 'partial' | 'missed' | 'pending';

// 每日任务数据
interface DailyTaskData {
  date: Date;
  status: TaskCompletionStatus;
  duration?: number; // 锻炼时长（分钟）
  notes?: string; // 备注
  workoutType?: string; // 锻炼类型
}

// 每周任务数据
interface WeeklyTaskData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  goal: number; // 每周目标时长（分钟）
  days: DailyTaskData[];
  totalCompleted: number; // 本周已完成总时长
  completionRate: number; // 完成百分比
}

// 周期数据结构（8周）
interface TaskCycleData {
  totalWeeks: 8;
  currentWeek: number;
  weeks: WeeklyTaskData[];
  overallCompletionRate: number;
  streak: number; // 连续打卡天数
}
```

### 数据使用流程
- 主页面组件通过 `useState` 初始化 `createCycleData()`（mock 数据）
- 通过 props 传递给各个子组件
- 记录锻炼后更新本地数据并重新渲染

---

## 第一步：SQLite 本地存储

### 技术选型
- **expo-sqlite**：Expo 官方 SQLite 集成
- **expo-file-system**：可能用于数据库文件管理（可选）
- **react-query** 或 **useState**：数据状态管理（保持简单）

### 实现步骤

#### 1. 安装依赖
```bash
npm install expo-sqlite
# 或
pnpm add expo-sqlite
```

#### 2. 创建数据库管理模块
- 路径：`/services/database/index.ts`
- 创建数据库表结构
- 实现数据操作方法

```typescript
// 数据库初始化和升级
const initDatabase = async () => {
  // 创建 tasks 表
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      duration INTEGER,
      notes TEXT,
      workout_type TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 创建 weekly_goals 表
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS weekly_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_number INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      goal_duration INTEGER DEFAULT 150,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
```

#### 3. 实现数据操作接口
- 路径：`/services/database/queries.ts`
- 包含所有 SQL 查询和数据转换逻辑

#### 4. 创建数据管理 Hook
- 路径：`/hooks/use-database.ts`
- 封装数据库操作，提供状态管理
- 实现数据同步机制

#### 5. 集成到主页面
- 修改 `features/task-cycle/index.tsx`
- 替换 mock 数据初始化

#### 6. 处理离线同步
- 添加数据库初始化检查
- 实现数据迁移逻辑（从内存到 SQLite）

### 文件变更影响
| 文件路径 | 变更类型 | 说明 |
|---------|---------|------|
| `/services/database/` | 新增 | 数据库管理模块 |
| `/hooks/use-database.ts` | 新增 | 数据管理 Hook |
| `/features/task-cycle/index.tsx` | 修改 | 替换数据初始化方式 |
| `/features/task-cycle/utils/mock-data.ts` | 可选删除 | 可能保留用于开发环境 |
| `package.json` | 修改 | 添加 expo-sqlite 依赖 |

---

## 第二步：后端服务集成

### 技术架构
- **后端框架**：Node.js + Express / NestJS 或其他
- **数据库**：PostgreSQL / MySQL / MongoDB
- **API 风格**：RESTful API
- **认证**：JWT 或 OAuth2
- **HTTP 客户端**：axios 或 fetch（Expo 内置）

### 实现步骤

#### 1. 安装依赖
```bash
npm install axios
# 或使用 Expo fetch
```

#### 2. 创建 API 服务
- 路径：`/services/api/index.ts`
- 实现 API 客户端
- 添加错误处理和重试机制

```typescript
interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // 实现 GET 请求
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    // 实现 POST 请求
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    // 实现 PUT 请求
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    // 实现 DELETE 请求
  }
}
```

#### 3. 创建后端数据类型
- 路径：`/services/api/types.ts`
- 定义 API 请求和响应类型
- 确保与前端类型兼容

#### 4. 实现同步逻辑
- 路径：`/services/sync/index.ts`
- 离线数据同步（本地 SQLite 与服务器）
- 冲突解决策略

#### 5. 更新数据管理 Hook
- 路径：`/hooks/use-database.ts`
- 集成 API 调用
- 实现缓存和刷新机制

#### 6. 后端集成测试
- 添加测试数据到服务器
- 模拟网络失败场景
- 测试离线使用场景

### 文件变更影响
| 文件路径 | 变更类型 | 说明 |
|---------|---------|------|
| `/services/api/` | 新增 | API 服务模块 |
| `/services/sync/` | 新增 | 数据同步模块 |
| `/hooks/use-database.ts` | 修改 | 集成 API |
| `/services/database/` | 修改 | 添加同步状态字段 |
| `package.json` | 修改 | 添加 axios 依赖（可选） |

---

## 数据迁移方案

### 1. 从内存到 SQLite
```typescript
// 迁移逻辑
const migrateFromMemoryToSQLite = async (mockData: TaskCycleData) => {
  // 将 mock 数据插入到 SQLite 中
};
```

### 2. 从 SQLite 到后端
```typescript
// 同步逻辑
const syncToBackend = async () => {
  // 获取本地变更
  // 发送到服务器
  // 处理响应
};
```

---

## 错误处理和边界情况

### 1. 数据库初始化失败
- 显示错误信息
- 降级到内存 mock 数据
- 提供重试按钮

### 2. 网络请求失败
- 显示离线模式提示
- 本地操作继续可用
- 自动重试机制

### 3. 数据冲突
- 时间戳优先策略
- 用户手动解决冲突
- 显示冲突提示界面

---

## 进度监控

### 第一步完成指标
- ✅ SQLite 集成和表创建
- ✅ 数据读写操作实现
- ✅ 与现有 UI 集成
- ✅ 数据持久化验证
- ✅ 开发和生产环境测试

### 第二步完成指标
- ✅ 后端 API 集成
- ✅ 数据同步实现
- ✅ 离线模式支持
- ✅ 冲突解决机制
- ✅ 完整的端到端测试

---

## 风险评估

### 第一步风险
- **低风险**：expo-sqlite 是 Expo 官方推荐方案，文档齐全
- **开发时间**：1-2 周（包含测试和调试）

### 第二步风险
- **中风险**：需要后端开发支持，API 设计可能变更
- **开发时间**：取决于后端进度，前端部分 1-2 周

---

## 开发建议

### 保持简单
- 第一步仅实现本地存储，不涉及网络
- 第二步再添加后端集成
- 保持现有 UI 不变

### 渐进式重构
- 先实现 SQLite 版本，确保稳定
- 再进行后端迁移
- 每个阶段都要有完整的测试

### 数据安全
- SQLite 数据加密（可选，使用 expo-secure-store）
- API 请求 HTTPS
- 用户数据脱敏

---

## 后续优化方向

### 性能优化
- 数据库查询优化（索引）
- 分页加载大量数据
- 图片/文件存储优化

### 用户体验
- 备份和恢复功能
- 数据导出（CSV/JSON）
- 统计和分析功能

### 架构优化
- 引入 react-query 或类似库
- 数据状态管理重构
- 缓存策略优化
