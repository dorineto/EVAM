import {ItemOrdem} from './Item';
import _ from 'lodash';

export class OrdemCompra {
    private _itensComprados: ItemOrdem[];
    private _inclusao: string;

    constructor(itensComprados: ItemOrdem[], inclusao: Date) {
        this._itensComprados = itensComprados;
        this._inclusao = inclusao.toISOString();
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

    set inclusao(inclusao: Date) {
        this._inclusao = inclusao.toISOString();
    }

    get inclusao() {
        return new Date(this._inclusao);
    }
}
