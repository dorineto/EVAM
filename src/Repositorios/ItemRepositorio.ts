import {ItemEstoque} from '../Entidades/Item';

export interface ItemRepositorio {
    listaMateriasPrimas: () => Promise<ItemEstoque[]>;
}
