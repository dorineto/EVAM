import {Receita} from '../Entidades/Receita';

export interface ReceitaRepositorio {
    listaReceitas: () => Promise<Receita[]>;
}
