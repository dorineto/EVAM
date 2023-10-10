import {ItemOrdem} from './Item';
import {Cliente} from './Cliente';
import {Local} from './Local';

import _ from 'lodash';

export class OrdemVenda {
    private _id: number;
    private _itensVendidos: ItemOrdem[];
    private _cliente: Cliente;
    private _local: Local;
    private _inclusao: string;

    constructor(
        id: number,
        cliente: Cliente,
        local: Local,
        itensVendidos: ItemOrdem[],
        inclusao: Date,
    ) {
        this._id = id;
        this._cliente = cliente;
        this._local = local;
        this._itensVendidos = itensVendidos;
        this._inclusao = inclusao.toISOString();
    }

    set id(idInp: number) {
        if (this._id > 0) {
            throw new Error('Id já setado');
        }

        this._id = idInp;
    }

    get id() {
        return this._id;
    }

    set itensVendidos(itensVendidosInp: ItemOrdem[]) {
        this._itensVendidos = _.cloneDeep(itensVendidosInp);
    }

    get itensVendidos(): ItemOrdem[] {
        return _.cloneDeep(this._itensVendidos);
    }

    get cliente(): Cliente {
        return _.cloneDeep(this._cliente);
    }

    set cliente(clienteInp: Cliente) {
        this._cliente = clienteInp;
    }

    get local(): Local {
        return _.cloneDeep(this._local);
    }

    set local(localInp: Local) {
        this._local = localInp;
    }

    get totalVenda(): number {
        return this._itensVendidos.reduce(
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
