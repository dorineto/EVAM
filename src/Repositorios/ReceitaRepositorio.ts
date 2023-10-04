import {Receita} from '../Entidades/Receita';

export interface ReceitaRepositorio {
    listaReceitas: () => Promise<Receita[]>;
    buscaReceita: (id: number) => Promise<Receita | null>;
    gravaReceita: (receita: Receita) => Promise<number>;
    deletaReceita: (id: number) => Promise<void>;
}
