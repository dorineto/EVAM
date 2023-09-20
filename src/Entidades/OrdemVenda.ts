import {ItemOrdem} from './Item';
import {Cliente} from './Cliente';
import {Local} from './Local';

import _ from 'lodash';

export class OrdemVenda {
    private _itensVendidos: ItemOrdem[];
    private _cliente: Cliente;
    private _local: Local;

    constructor(cliente: Cliente, local: Local, itensVendidos: ItemOrdem[]) {
        this._cliente = cliente;
        this._local = local;
        this._itensVendidos = itensVendidos;
    }

    adicionaItems(...itemAdicionado: ItemOrdem[]) {
        throw new Error('Não implementado');
    }

    removerItems(...itemRemovidos: ItemOrdem[]) {
        throw new Error('Não implementado');
    }

    get itensVendidos(): ItemOrdem[] {
        return _.cloneDeep(this._itensVendidos);
    }

    get cliente(): Cliente {
        return _.cloneDeep(this._cliente);
    }

    set cliente(cliente: Cliente) {
        this._cliente = cliente;
    }

    get local(): Local {
        return _.cloneDeep(this._local);
    }

    set local(local: Local) {
        this.local = local;
    }

    get totalVenda(): number {
        return this._itensVendidos.reduce(
            (total, atualVal) => total + atualVal.valorTotal,
            0,
        );
    }
}
