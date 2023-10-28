import {
    enablePromise,
    SQLiteDatabase,
    openDatabase,
    deleteDatabase,
    DatabaseParams,
} from 'react-native-sqlite-storage';
import {scriptCriacaoDB} from './EvamDatabaseScript';

enablePromise(true);

export class EvamSqliteUtil {
    private _iniciadoEstruturaBanco: boolean = false;
    private _dropDatabase: boolean = false;
    private _dbInfo: DatabaseParams = {
        name: 'evam-db.db',
        location: 'default',
    };

    constructor(dropDatabase: boolean = false) {
        this._dropDatabase = dropDatabase;
    }

    private async isSetup(): Promise<boolean> {
        const connection = await this.getConnection();

        const [resultado] = await connection.executeSql(
            "select name from sqlite_master where type = 'table' and name = 'Item'",
        );

        return resultado.rows.length > 0;
    }

    async criaEstruturaBanco(): Promise<void> {
        try {
            const setup = await this.isSetup();

            if (this._dropDatabase && setup) {
                await deleteDatabase({...this._dbInfo});
            }

            const connection = await this.getConnection();

            for (let queryTable of scriptCriacaoDB) {
                await connection.executeSql(queryTable);
            }

            this._iniciadoEstruturaBanco = true;
        } catch (e) {
            console.log(`[criaEstruturaBanco] Error: ${JSON.stringify(e)}`);
            throw e;
        }
    }

    async getConnection(): Promise<SQLiteDatabase> {
        try {
            return await openDatabase({...this._dbInfo});
        } catch (e) {
            console.log(`[getConnection] Error: ${JSON.stringify(e)}`);
            throw e;
        }
    }

    get estruturaIniciada(): boolean {
        return this._iniciadoEstruturaBanco;
    }
}
