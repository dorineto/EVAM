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
        const _ = await this.getConnection();

        if (this._resetaBanco) {
            deleteDatabase(this._dbInfo);
        }

        this._iniciadoEstruturaBanco = true;
    }

    async getConnection(): Promise<SQLiteDatabase> {
        return await openDatabase(this._dbInfo);
    }

    get estruturaIniciada(): boolean {
        return this._iniciadoEstruturaBanco;
    }
}
