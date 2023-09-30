import {ItemEstoque} from '../Entidades/Item';

export interface ItemRepositorio {
    listaMateriasPrimas: () => Promise<ItemEstoque[]>;
    buscaMateriaPrima: (id: number) => Promise<ItemEstoque | null>;
    gravaMateriaPrima: (item: ItemEstoque) => Promise<number>;
    deletaMateriaPrima: (id: number) => Promise<void>;
    listaProdutos: () => Promise<ItemEstoque[]>;
    buscaProduto: (id: number) => Promise<ItemEstoque | null>;
    gravaProduto: (item: ItemEstoque) => Promise<number>;
    deletaProduto: (id: number) => Promise<void>;
}
