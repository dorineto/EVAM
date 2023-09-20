import {ItemEstoque} from '../Entidades/Item';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';

export class ItemCasoUso {
    private _itemRepositorio: ItemRepositorio;

    constructor(itemRepositorio: ItemRepositorio) {
        this._itemRepositorio = itemRepositorio;
    }

    // TODO: Criar testes unitiarios para esse caso de uso
    async listaMateriasPrimas(): Promise<ItemEstoque[]> {
        return await this._itemRepositorio.listaMateriasPrimas();
    }
}
