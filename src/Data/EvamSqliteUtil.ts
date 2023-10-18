import {
    enablePromise,
    SQLiteDatabase,
    openDatabase,
    deleteDatabase,
} from 'react-native-sqlite-storage';

enablePromise(true);

export class EvamSqliteUtil {
    private _iniciadoEstruturaBanco: boolean = false;
    private _resetaBanco: boolean = false;
    private _dbInfo = {
        name: 'evam-db.db',
        location: 'default',
    };

    constructor(resetaBanco: boolean = false) {
        this._resetaBanco = resetaBanco;
    }

    async criaEstruturaBanco(): Promise<void> {
        try {
            const connection = await this.getConnection();

            if (this._resetaBanco) {
                deleteDatabase(this._dbInfo);
            }

            const querysCreateTables: string[] = [];

            // querysCreateTables.push(`

            // `);

            for (let queryTable in querysCreateTables) {
                await connection.executeSql(queryTable);
            }

            this._iniciadoEstruturaBanco = true;
        } catch (e) {
            console.log(`[iniciaEstruturaBanco] Error: ${JSON.stringify(e)}`);
            throw e;
        }
    }

    async getConnection(): Promise<SQLiteDatabase> {
        return await openDatabase(this._dbInfo);
    }

    get estruturaIniciada(): boolean {
        return this._iniciadoEstruturaBanco;
    }
}
