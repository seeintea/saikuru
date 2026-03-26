# Saikuru 打卡软件长期规划

## 当前状态分析

### 已有功能
- **首页（tabs-index）**：Summary 组件、日历组件、Header
- **创建页（tabs-create）**：待实现
- **我的页（tabs-mine）**：待实现
- **任务周期页（task-cycle）**：周视图、月视图、统计组件

### 技术栈
- React 19 + TypeScript
- Expo Router（文件路由）
- React Native Reanimated（动画）
- react-native-calendars（日历）
- AsyncStorage（本地存储）

---

## 打卡软件核心能力需求

### 1. 任务管理能力

#### 1.1 任务创建与配置
- 创建自定义任务（名称、描述、图标）
- 设置任务周期（天数、周数、月数）
- 配置双维度目标：
  - 打卡次数目标（每周 X 次）
  - 时间累计目标（每周 X 分钟）
  - 支持"且"或"或"关系
- 配置里程碑（次数、时间双维度）

#### 1.2 任务列表与切换
- 支持多任务并行
- 任务列表管理（增删改查）
- 快速切换当前关注任务

#### 1.3 任务模板
- 预设任务模板（学习、健身、阅读等）
- 自定义模板保存

---

### 2. 打卡记录能力

#### 2.1 快速打卡
- 一键打卡（记录次数）
- 计时打卡（开始/结束，记录时长）
- 批量打卡（补签）

#### 2.2 打卡详情
- 记录打卡备注
- 上传图片/附件
- 记录心情/状态标签

#### 2.3 打卡历史
- 按日期查看历史记录
- 编辑/删除历史记录
- 导出打卡数据

---

### 3. 数据统计与分析能力

#### 3.1 实时进度展示
- 当前周期进度
- 双维度（次数、时间）进度条
- 剩余时间/次数预估
- 里程碑达成情况

#### 3.2 历史数据分析
- 周/月/年统计图表
- 趋势分析（进度变化曲线）
- 最佳连续打卡天数
- 平均每日投入

#### 3.3 里程碑激励
- 达成里程碑的奖励提示
- 里程碑徽章/成就系统
- 社交分享功能

---

### 4. 提醒与通知能力

#### 4.1 自定义提醒
- 设置每日提醒时间
- 多时段提醒
- 智能提醒（根据习惯推荐）

#### 4.2 进度提醒
- 里程碑临近提醒
- 周期即将结束提醒
- 落后进度提醒

---

### 5. 数据持久化能力

#### 5.1 本地存储
- AsyncStorage 存储
- 数据备份/恢复
- 导出为 JSON/CSV

#### 5.2 数据同步（未来）
- 云存储集成
- 多设备同步
- 数据加密

---

### 6. 用户个性化能力

#### 6.1 界面自定义
- 主题切换（深色/浅色）
- 主色调自定义
- 字体大小调整

#### 6.2 统计偏好
- 选择默认统计周期
- 自定义数据展示方式
- 隐藏/显示特定模块

---

## 模块优先级规划

### Phase 1: 核心功能（MVP）
1. **任务管理**：单任务配置与管理
2. **打卡功能**：快速打卡 + 计时打卡
3. **基础统计**：当前周期进度展示
4. **本地存储**：数据持久化

### Phase 2: 功能完善
1. **多任务支持**：任务列表与切换
2. **历史记录**：查看与编辑历史
3. **里程碑系统**：完整的里程碑管理
4. **提醒功能**：基础提醒通知

### Phase 3: 数据分析
1. **高级统计**：图表展示
2. **趋势分析**：进度变化曲线
3. **导出功能**：数据导出

### Phase 4: 体验优化
1. **个性化**：主题与自定义
2. **激励系统**：徽章与成就
3. **社交分享**：分享进度

---

## 技术架构建议

### 数据结构设计

```typescript
// 任务配置
interface Task {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  config: TaskConfig;
  createdAt: string;
  isActive: boolean;
}

// 任务配置
interface TaskConfig {
  cycleType: 'days' | 'weeks' | 'months';
  cycleLength: number;
  countTarget?: number;
  timeTarget?: number;
  targetLogic: 'and' | 'or';
  milestones: Milestone[];
}

// 打卡记录
interface CheckInRecord {
  id: string;
  taskId: string;
  date: string;
  count: number;
  duration?: number;
  notes?: string;
  tags?: string[];
  attachments?: string[];
}
```

### 状态管理

- 使用 React Context + useReducer 管理全局状态
- 持久化到 AsyncStorage
- 考虑引入 zustand 等轻量级状态库（可选）

### 目录结构

```
features/
├── tasks/              # 任务管理
│   ├── components/
│   ├── hooks/
│   └── types/
├── check-in/           # 打卡功能
│   ├── components/
│   └── hooks/
├── statistics/         # 统计分析
│   ├── components/
│   └── utils/
└── user/               # 用户设置
    └── components/
```