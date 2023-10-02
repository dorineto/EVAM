import _ from 'lodash';
import {ItemEstoque, eItemTipo} from '../Entidades/Item';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';
import {listaMateriaPrima, listaProdutos} from './InitialDataStub';

export default class ItemRepositorioStub implements ItemRepositorio {
    private _itensGravados: ItemEstoque[];

    constructor() {
        this._itensGravados = [...listaMateriaPrima, ...listaProdutos];
    }

    async listaMateriasPrimas(): Promise<ItemEstoque[]> {
        return await this.listaItemEstoque(eItemTipo.MateriaPrima);
    }

    async listaProdutos(): Promise<ItemEstoque[]> {
        return await this.listaItemEstoque(eItemTipo.Produto);
    }

    private async listaItemEstoque(tipo: eItemTipo): Promise<ItemEstoque[]> {
        return this._itensGravados.filter(ig => ig.item.tipo === tipo);
    }

    async buscaMateriaPrima(id: number): Promise<ItemEstoque | null> {
        return await this.buscaItemEstoque(id, eItemTipo.MateriaPrima);
    }

    async buscaProduto(id: number): Promise<ItemEstoque | null> {
        return await this.buscaItemEstoque(id, eItemTipo.Produto);
    }

    private async buscaItemEstoque(
        id: number,
        tipo: eItemTipo,
    ): Promise<ItemEstoque | null> {
        return (
            this._itensGravados.find(
                ig => ig.item.tipo === tipo && ig.item.id === id,
            ) ?? null
        );
    }

    async gravaMateriaPrima(item: ItemEstoque): Promise<number> {
        return await this.gravaItemEstoque(item);
    }

    async gravaProduto(item: ItemEstoque): Promise<number> {
        return await this.gravaItemEstoque(item);
    }

    private async gravaItemEstoque(item: ItemEstoque): Promise<number> {
        let itemGravado = this._itensGravados.find(
            i => i.item.id === item.item.id,
        );

        if (itemGravado) {
            itemGravado.item.descricao = item.item.descricao;
            itemGravado.medida = item.medida;
            itemGravado.qtd = item.qtd;
            itemGravado.valorMediaUnidade = item.valorMediaUnidade;

            return itemGravado.item.id;
        }

        let novoId = Math.max(...this._itensGravados.map(i => i.item.id)) + 1;

        let itemGrava = _.cloneDeep(item);

        itemGrava.item.id = novoId;

        this._itensGravados.push(itemGrava);

        return novoId;
    }

    async deletaMateriaPrima(id: number): Promise<void> {
        await this.deletaItemEstoque(id);
    }

    async deletaProduto(id: number): Promise<void> {
        await this.deletaItemEstoque(id);
    }

    async deletaItemEstoque(id: number): Promise<void> {
        this._itensGravados = this._itensGravados.filter(
            ig => ig.item.id !== id,
        );
    }
}
