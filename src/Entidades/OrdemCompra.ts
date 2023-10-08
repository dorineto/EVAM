import {ItemOrdem} from './Item';
import _ from 'lodash';

export class OrdemCompra {
    private _id: number;
    private _itensComprados: ItemOrdem[];
    private _inclusao: string;

    constructor(id: number, itensComprados: ItemOrdem[], inclusao: Date) {
        this._id = id;
        this._itensComprados = itensComprados;
        this._inclusao = inclusao.toISOString();
    }

    get id(): number {
        return this._id;
    }

    set id(idSet: number) {
        if (this._id > 0) {
            throw new Error('Id já setado');
        }

        this._id = idSet;
    }

    get itensComprados(): ItemOrdem[] {
        return _.cloneDeep(this._itensComprados);
    }

    set itensComprados(itensCompradosSet: ItemOrdem[]) {
        this._itensComprados = _.cloneDeep(itensCompradosSet);
    }

    get totalCompra(): number {
        return this._itensComprados.reduce(
            (total, atualVal) => total + atualVal.valorTotal,
            0,
        );
    }

    set inclusao(inclusao: Date) {
        this._inclusao = inclusao.toISOString();
    }

    get inclusao() {
        return new Date(this._inclusao);
    }
}
