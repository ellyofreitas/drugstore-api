declare module 'postgres-shift' {
  import type postgres from 'postgres';

  type MigrationHook = (migration: {
    migration_id: string;
    name: string;
    path: string;
  }) => void;

  export default function shift(options: {
    sql: postgres.Sql;
    path?: string;
    before?: MigrationHook;
    after?: MigrationHook;
  }): Promise<void>;
}
