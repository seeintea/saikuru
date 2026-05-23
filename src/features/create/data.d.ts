export interface CreateFormItem {
  name: string;
  description: string;
  cycleType: "days" | "weeks" | "months";
  cycleLength: number;
  cycleStartDate: string;
  isInfinite: boolean;
  taskEndDate?: string;
  targetLogic: "and" | "or";
  targets: {
    targetType: "frequency" | "count" | "duration";
    targetValue: number;
    operator: "gte" | "lte" | "eq";
  }[];
}
