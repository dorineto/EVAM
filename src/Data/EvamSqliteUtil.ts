import {
    enablePromise,
    SQLiteDatabase,
    openDatabase,
    deleteDatabase,
    DEBUG,
} from 'react-native-sqlite-storage';
import {scriptCriacaoDB} from './EvamDatabaseScript';

DEBUG(true);
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
        console.log('criaEstruturaBanco');
        try {
            const connection = await this.getConnection();

            console.log();
            // if (this._resetaBanco) {
            //     await deleteDatabase(this._dbInfo);
            // }

            for (let queryTable of scriptCriacaoDB) {
                await connection.executeSql(queryTable);
            }

            connection.close();
            this._iniciadoEstruturaBanco = true;
        } catch (e) {
            console.log(`[criaEstruturaBanco] Error: ${JSON.stringify(e)}`);
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
