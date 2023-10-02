import _ from 'lodash';
import {Receita} from '../Entidades/Receita';
import {ReceitaRepositorio} from '../Repositorios/ReceitaRepositorio';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';

export class ReceitaCasoUso {
    private _receitaRepositorio: ReceitaRepositorio;
    private _itemRepositorio: ItemRepositorio;

    constructor(
        receitaRepositorio: ReceitaRepositorio,
        itemRepositorio: ItemRepositorio,
    ) {
        this._receitaRepositorio = receitaRepositorio;
        this._itemRepositorio = itemRepositorio;
    }

    async listaReceitas(): Promise<Receita[]> {
        return await this._receitaRepositorio.listaReceitas();
    }

    async buscaReceita(id: number): Promise<Receita | null> {
        if (id <= 0) {
            return null;
        }

        return _.cloneDeep(await this._receitaRepositorio.buscaReceita(id));
    }

    async gravaReceita(receita: Receita): Promise<number> {
        return 0;
    }
}
