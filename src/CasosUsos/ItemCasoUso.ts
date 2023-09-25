import {ItemEstoque} from '../Entidades/Item';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';
import _ from 'lodash';

export class ItemCasoUso {
    private _itemRepositorio: ItemRepositorio;

    constructor(itemRepositorio: ItemRepositorio) {
        this._itemRepositorio = itemRepositorio;
    }

    async listaMateriasPrimas(): Promise<ItemEstoque[]> {
        return await this._itemRepositorio.listaMateriasPrimas();
    }

    async buscaMateriaPrima(id: number): Promise<ItemEstoque | null> {
        if (id <= 0) {
            return null;
        }

        return _.cloneDeep(await this._itemRepositorio.buscaMateriaPrima(id));
    }

    async gravaMateriaPrima(item: ItemEstoque): Promise<number> {
        if ((item.item.descricao ?? '').trim() === '') {
            throw new Error(
                'A descrição da materia-prima informada não pode ser vazia',
            );
        }

        if (item.qtd < 0) {
            throw new Error(
                'A quantidade em estoque informada não pode ser negativa',
            );
        }

        if (item.valorMediaUnidade < 0) {
            throw new Error('A média de preço infomada não pode ser negativa');
        }

        return await this._itemRepositorio.gravaMateriaPrima(item);
    }

    async deletaMateriaPrima(id: number): Promise<void> {
        if (id <= 0) {
            return;
        }

        await this._itemRepositorio.deletaMateriaPrima(id);
    }
}
