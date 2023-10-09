import _ from 'lodash';
import {Cliente} from '../Entidades/Cliente';
import {Local} from '../Entidades/Local';
import {OrdemVenda} from '../Entidades/OrdemVenda';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';
import {OrdemVendaRepositorio} from '../Repositorios/OrdemVendaRepostorio';

export class OrdemVendaCasoUso {
    private _ordemVendaRepositorio: OrdemVendaRepositorio;
    private _itemRepositorio: ItemRepositorio;

    constructor(
        ordemVendaRepositorio: OrdemVendaRepositorio,
        itemRepositorio: ItemRepositorio,
    ) {
        this._ordemVendaRepositorio = ordemVendaRepositorio;
        this._itemRepositorio = itemRepositorio;
    }

    async listaOrdemVendas(): Promise<OrdemVenda[]> {
        return await this._ordemVendaRepositorio.listaOrdemVendas();
    }

    async listaClientes(): Promise<Cliente[]> {
        return await this._ordemVendaRepositorio.listaClientes();
    }

    async listaLocais(): Promise<Local[]> {
        return await this._ordemVendaRepositorio.listaLocais();
    }

    async buscaOrdemVenda(id: number): Promise<OrdemVenda | null> {
        if (id <= 0) {
            return null;
        }

        return _.cloneDeep(
            await this._ordemVendaRepositorio.buscaOrdemVenda(id),
        );
    }

    async gravaOrdemVenda(venda: OrdemVenda): Promise<number> {
        console.log(venda);
        return 0;
    }
}
