import dbPool from "../../config/database";

export const queryGet = async <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  try {
    const result = await dbPool.query(sql, params);
    return result.rows as T[];
  } catch (error) {
    console.error("❌ Query Get Error:", error);
    throw error;
  }
};

export const queryGetOne = async <T = any>(sql: string, params: any[] = []): Promise<T | null> => {
  try {
    const result = await dbPool.query(sql, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ Query Get One Error:", error);
    throw error;
  }
};

export const queryInsert = async (sql: string, params: any[]): Promise<number> => {
  try {
    const result = await dbPool.query(sql, params);
    return result.rowCount!;
  } catch (error) {
    console.error("❌ Query Insert Error:", error);
    throw error;
  }
};

export const queryUpdateOne = async <T = any>(sql: string, params: any[]): Promise<T | null> => {
  try {
    const result = await dbPool.query(sql, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ Query Update Error:", error);
    throw error;
  }
};


export const queryDelete = async (sql: string, params: any[]): Promise<boolean> => {
  try {
    const result = await dbPool.query(sql, params);
    return result.rowCount! > 0;
  } catch (error) {
    console.error("❌ Query Delete Error:", error);
    throw error;
  }
};
