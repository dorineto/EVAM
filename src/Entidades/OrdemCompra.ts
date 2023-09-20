import {ItemOrdem} from './Item';
import _ from 'lodash';

export class OrdemCompra {
    private _itensComprados: ItemOrdem[];

    constructor(itensComprados: ItemOrdem[]) {
        this._itensComprados = itensComprados;
    }

    adicionaItems(...itemAdicionado: ItemOrdem[]) {
        throw new Error('Não implementado');
    }

    removerItems(...itemRemovidos: ItemOrdem[]) {
        throw new Error('Não implementado');
    }

    get itensComprados(): ItemOrdem[] {
        return _.cloneDeep(this._itensComprados);
    }

    get totalCompra(): number {
        return this._itensComprados.reduce(
            (total, atualVal) => total + atualVal.valorTotal,
            0,
        );
    }
}
