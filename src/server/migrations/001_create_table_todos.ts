import { Kysely } from 'kysely'

const tableName = 'zenith_plugin_starter__todos'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable(tableName)
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('title', 'varchar(255)')
        .addColumn('completed', 'boolean')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable(tableName).execute()
}

