import {Medida} from './Medida';

export enum eItemTipo {
    MateriaPrima = 1,
    Produto = 2,
}

export interface Item {
    id: number;
    tipo: eItemTipo;
    descricao: string;
    inclusao: string;
}

export interface ItemMensurado {
    item: Item;
    medida: Medida;
    qtd: number;
}

export interface ItemEstoque extends ItemMensurado {
    valorMediaUnidade: number;
}

export interface ItemReceita extends ItemMensurado {
    valorMediaUnidade: number;
}

export interface ItemOrdem extends ItemMensurado {
    valorTotal: number;
}
