import {ItemEstoque} from '../Entidades/Item';

export interface ItemRepositorio {
    listaMateriasPrimas: () => Promise<ItemEstoque[]>;
    buscaMateriaPrima: (id: number) => Promise<ItemEstoque | null>;
    gravaMateriaPrima: (item: ItemEstoque) => Promise<number>;
    deletaMateriaPrima: (id: number) => Promise<void>;
}
