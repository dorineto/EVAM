import {Receita} from '../Entidades/Receita';
import {ReceitaRepositorio} from '../Repositorios/ReceitaRepositorio';

export class ReceitaCasoUso {
    private _receitaRepositorio: ReceitaRepositorio;

    constructor(receitaRepositorio: ReceitaRepositorio) {
        this._receitaRepositorio = receitaRepositorio;
    }

    // TODO: fazer os testes desse metodod do caso de uso
    async listaReceitas(): Promise<Receita[]> {
        return await this._receitaRepositorio.listaReceitas();
    }
}
