import _ from 'lodash';
import {OrdemCompra} from '../../Entidades/OrdemCompra';
import {OrdemCompraRepositorio} from '../../Repositorios/OrdemCompraRepositorio';
import {listaOrdemCompras} from './InitialDataStub';
import {ItemEstoque, ItemOrdem, eItemTipo} from '../../Entidades/Item';
import {ItemRepositorio} from '../../Repositorios/ItemRepositorio';

export class OrdemCompraRepositorioStub implements OrdemCompraRepositorio {
    private _ordemComprasGravadas: OrdemCompra[];
    private _itemRepositorio: ItemRepositorio;

    constructor(itemRepositorio: ItemRepositorio) {
        this._ordemComprasGravadas = listaOrdemCompras;
        this._itemRepositorio = itemRepositorio;
    }

    async listaOrdemCompras(): Promise<OrdemCompra[]> {
        return _.cloneDeep(this._ordemComprasGravadas);
    }

    async buscaOrdemCompra(id: number): Promise<OrdemCompra | null> {
        return this._ordemComprasGravadas.find(ocg => ocg.id === id) ?? null;
    }

    async gravaOrdemCompra(compra: OrdemCompra): Promise<number> {
        let compraGravada =
            this._ordemComprasGravadas.find(ocg => ocg.id === compra.id) ??
            _.cloneDeep(compra);

        const itensEstoqueComprados: {[id: number]: ItemEstoque} = {};

        for (let item of compra.itensComprados) {
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

            itensEstoqueComprados[itemBuscado.item.id] = itemBuscado;
        }

        const itensCompradosGrava: ItemOrdem[] = compra.itensComprados.map(
            ic => {
                return {
                    ...ic,
                    item: itensEstoqueComprados[ic.item.id].item,
                };
            },
        );

        compraGravada.inclusao = compra.inclusao;
        compraGravada.itensComprados = itensCompradosGrava;

        if (compraGravada.id === 0) {
            const id =
                Math.max(...this._ordemComprasGravadas.map(r => r.id)) + 1;

            compraGravada.id = id;

            this._ordemComprasGravadas.push(compraGravada);
        }

        return compraGravada.id;
    }

    async deletaOrdemCompra(id: number): Promise<void> {
        this._ordemComprasGravadas = this._ordemComprasGravadas.filter(
            ocg => ocg.id !== id,
        );
    }
}
