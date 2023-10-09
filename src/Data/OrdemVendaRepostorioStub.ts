import _ from 'lodash';
import {OrdemVenda} from '../Entidades/OrdemVenda';
import {OrdemVendaRepositorio} from '../Repositorios/OrdemVendaRepostorio';
import {listaClientes, listaLocais, listaVendas} from './InitialDataStub';
import ItemRepositorioStub from './ItemRepositorioStub';
import {Cliente} from '../Entidades/Cliente';
import {Local} from '../Entidades/Local';

export class OrdemVendaRepositorioStub implements OrdemVendaRepositorio {
    private _ordemVendasGravadas: OrdemVenda[];
    private _clientesGravados: Cliente[];
    private _locaisGravados: Local[];
    private _itemRepositorio: ItemRepositorioStub;

    constructor(itemRepositorio: ItemRepositorioStub) {
        this._ordemVendasGravadas = listaVendas;
        this._clientesGravados = listaClientes;
        this._locaisGravados = listaLocais;

        this._itemRepositorio = itemRepositorio;
    }

    async listaOrdemVendas(): Promise<OrdemVenda[]> {
        return _.cloneDeep(this._ordemVendasGravadas);
    }

    async listaClientes(): Promise<Cliente[]> {
        return _.cloneDeep(this._clientesGravados);
    }

    async listaLocais(): Promise<Local[]> {
        return _.cloneDeep(this._locaisGravados);
    }

    buscaOrdemVenda: (id: number) => Promise<OrdemVenda | null>;
    gravaOrdemVenda: (compra: OrdemVenda) => Promise<number>;
    deletaOrdemVenda: (id: number) => Promise<void>;
}
