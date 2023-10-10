import _ from 'lodash';
import {OrdemVenda} from '../Entidades/OrdemVenda';
import {OrdemVendaRepositorio} from '../Repositorios/OrdemVendaRepostorio';
import {listaClientes, listaLocais, listaVendas} from './InitialDataStub';
import ItemRepositorioStub from './ItemRepositorioStub';
import {Cliente} from '../Entidades/Cliente';
import {Local} from '../Entidades/Local';
import {ItemEstoque, ItemOrdem, eItemTipo} from '../Entidades/Item';

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

    async buscaOrdemVenda(id: number): Promise<OrdemVenda | null> {
        return this._ordemVendasGravadas.find(ovg => ovg.id === id) ?? null;
    }

    async gravaCliente(cliente: Cliente): Promise<number> {
        const clienteGravado =
            this._clientesGravados.find(cg => cg.id === cliente.id) ??
            _.cloneDeep(cliente);

        clienteGravado.nome = cliente.nome;
        clienteGravado.inclusao = cliente.inclusao;

        if (cliente.id === 0) {
            const id = Math.max(...this._clientesGravados.map(r => r.id)) + 1;

            clienteGravado.id = id;

            this._clientesGravados.push(clienteGravado);
        }

        return clienteGravado.id;
    }

    async gravaLocal(local: Local): Promise<number> {
        const localGravado =
            this._locaisGravados.find(lg => lg.id === local.id) ??
            _.cloneDeep(local);

        localGravado.descricao = local.descricao;
        localGravado.inclusao = local.inclusao;

        if (local.id === 0) {
            const id = Math.max(...this._locaisGravados.map(r => r.id)) + 1;

            localGravado.id = id;

            this._locaisGravados.push(localGravado);
        }

        return localGravado.id;
    }

    async gravaOrdemVenda(venda: OrdemVenda): Promise<number> {
        const vendaGravada =
            this._ordemVendasGravadas.find(ovg => ovg.id === venda.id) ??
            _.cloneDeep(venda);

        const itensEstoqueVendas: {[id: number]: ItemEstoque} = {};

        for (let item of venda.itensVendidos) {
            let itemBuscado: ItemEstoque | null = null;

            if (item.item.tipo === eItemTipo.MateriaPrima) {
                itemBuscado = await this._itemRepositorio.buscaMateriaPrima(
                    item.item.id,
                );
            } else {
                itemBuscado = await this._itemRepositorio.buscaProduto(
                    item.item.id,
                );
            }

            if (!itemBuscado) {
                throw new Error(`Item não encontrado: ID=${item.item.id}`);
            }

            itensEstoqueVendas[itemBuscado.item.id] = itemBuscado;
        }

        const itensCompradosGrava: ItemOrdem[] = venda.itensVendidos.map(iv => {
            return {
                ...iv,
                item: itensEstoqueVendas[iv.item.id].item,
            };
        });

        console.log(venda);

        const clienteGravado = this._clientesGravados.find(
            cg => cg.id === venda.cliente.id,
        );

        if (!clienteGravado) {
            throw new Error(`Cliente não encontrado: ID=${venda.cliente.id}`);
        }

        const localGravado = this._locaisGravados.find(
            lg => lg.id === venda.local.id,
        );

        if (!localGravado) {
            throw new Error(`Local não encontrado: ID=${venda.local.id}`);
        }

        vendaGravada.cliente = clienteGravado;
        vendaGravada.local = localGravado;
        vendaGravada.inclusao = venda.inclusao;
        vendaGravada.itensVendidos = itensCompradosGrava;

        if (vendaGravada.id === 0) {
            const id =
                Math.max(...this._ordemVendasGravadas.map(r => r.id)) + 1;

            vendaGravada.id = id;

            this._ordemVendasGravadas.push(vendaGravada);
        }

        return vendaGravada.id;
    }

    async deletaOrdemVenda(id: number): Promise<void> {
        this._ordemVendasGravadas = this._ordemVendasGravadas.filter(
            ovg => ovg.id !== id,
        );
    }
}
