import { useState, useEffect, useCallback } from 'react';
import { TaskCycleData, DailyTaskData } from '@/features/task-cycle/types';
import { initDatabase, deleteDatabase } from '@/services/database';
import {
  initCycleData,
  getDailyTaskByDate,
  upsertDailyTask,
  updateDailyTaskAndRefresh,
} from '@/services/database/queries';

/**
 * 数据库操作 Hook
 */
export const useDatabase = () => {
  const [cycleData, setCycleData] = useState<TaskCycleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 初始化数据库
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initDatabase();
        const data = await initCycleData();
        setCycleData(data);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err instanceof Error ? err : new Error('Database initialization failed'));
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // 获取每日任务
  const getDailyTask = useCallback(async (date: Date): Promise<DailyTaskData | null> => {
    try {
      return await getDailyTaskByDate(date);
    } catch (err) {
      console.error('Error getting daily task:', err);
      setError(err instanceof Error ? err : new Error('Failed to get daily task'));
      return null;
    }
  }, []);

  // 记录锻炼（更新每日任务）
  const logWorkout = useCallback(async (
    date: Date,
    duration: number,
    workoutType?: string,
    notes?: string
  ): Promise<boolean> => {
    try {
      const task: DailyTaskData = {
        date,
        status: 'completed',
        duration,
        notes,
        workoutType,
      };

      // 更新任务
      const newCycleData = await updateDailyTaskAndRefresh(task);
      setCycleData(newCycleData);
      return true;
    } catch (err) {
      console.error('Error logging workout:', err);
      setError(err instanceof Error ? err : new Error('Failed to log workout'));
      return false;
    }
  }, []);

  // 重置数据库（开发测试用）
  const resetDatabase = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteDatabase();
      await initDatabase();
      const data = await initCycleData();
      setCycleData(data);
      return true;
    } catch (err) {
      console.error('Error resetting database:', err);
      setError(err instanceof Error ? err : new Error('Failed to reset database'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cycleData,
    isLoading,
    error,
    getDailyTask,
    logWorkout,
    resetDatabase,
  };
};

export default useDatabase;
