export interface CreateFormItem {
  name: string;
  description: string;
  cycleType: "days" | "weeks" | "months";
  cycleLength: number;
  cycleStartDate: string;
  isInfinite: 0 | 1;
  taskEndDate?: string;
  targetLogic: "and" | "or";
  targets: {
    targetType: "frequency" | "count" | "duration";
    targetValue: number;
    operator: "gte" | "lte" | "eq";
  }[];
}
