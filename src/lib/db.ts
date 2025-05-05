'use server';

import { Pool } from 'pg';

// Create a PostgreSQL connection pool with environment-aware configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
});

// Log connection information only in development
if (process.env.NODE_ENV !== 'production') {
  console.log('PostgreSQL connection info (dev only):', {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE,
    // Don't log the password
    passwordProvided: !!process.env.POSTGRES_PASSWORD
  });
}

// Handle connection errors gracefully
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  // Don't exit the process, just log the error to allow for recovery
  // We'll let the connection pool handle reconnection
});

// Lightweight query function with automatic connection handling
export async function query<T>(text: string, params?: any[], client?: any): Promise<T[]> {
  // Use provided client or get one from the pool
  const shouldRelease = !client;
  try {
    client = client || await pool.connect();
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (error: any) {
    console.error('Database query error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      console.error('Query:', text);
      console.error('Params:', params);
    }
    throw error;
  } finally {
    // Only release if we acquired a new client
    if (shouldRelease && client) {
      client.release();
    }
  }
}

// Single row query for performance when only one result is needed
export async function queryOne<T>(text: string, params?: any[], client?: any): Promise<T | null> {
  const rows = await query<T>(text, params, client);
  return rows.length > 0 ? rows[0] : null;
}

// Transaction helper function
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}