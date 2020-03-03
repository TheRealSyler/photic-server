import { logAction } from './utils/logAction';

export interface Repository {
  name: string;
  description: null | string;
  tech: string[];
  website: null | string;
}

interface Data {
  repositories?: Repository[];
}

type MetaData = {
  [key in keyof Data]: {
    lastChanged: number;
  };
};

class DataBase {
  private data: Data = {};
  private metadata: MetaData = {};

  get(key: keyof Data) {
    logAction('DB GET', key);
    return this.data[key];
  }
  set<T extends keyof Data>(key: T, data: Data[T]) {
    logAction('DB SET', key);
    this.data[key] = data;
    this.metadata[key] = {
      lastChanged: Date.now()
    };
  }
  getInfo(key: keyof Data) {
    logAction('DB INFO', key);
    return this.metadata[key];
  }
}

export const db = new DataBase();
