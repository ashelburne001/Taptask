import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Database {
  private db: sqlite3.Database | null = null;

  async initialize(dbPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, async (err) => {
        if (err) reject(err);
        else {
          try {
            await this.runSchema();
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }

  private async runSchema(): Promise<void> {
    // Try dist directory first, then fall back to src directory for development
    let schemaPath = path.join(__dirname, 'schema.sql');
    try {
      const schema = await fs.readFile(schemaPath, 'utf-8');
      await this.executeSchema(schema);
    } catch {
      // Fallback to src directory for development mode
      schemaPath = path.join(__dirname, '../../src/db/schema.sql');
      const schema = await fs.readFile(schemaPath, 'utf-8');
      await this.executeSchema(schema);
    }
  }

  private async executeSchema(schema: string): Promise<void> {
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await this.run(statement);
    }
  }

  async run(sql: string, params: any[] = []): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    return new Promise((resolve, reject) => {
      this.db!.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return new Promise((resolve, reject) => {
      this.db!.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');
    return new Promise((resolve, reject) => {
      this.db!.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve((rows || []) as T[]);
      });
    });
  }

  async close(): Promise<void> {
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      this.db!.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export const db = new Database();
