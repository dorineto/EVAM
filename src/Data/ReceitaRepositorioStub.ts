import _ from 'lodash';
import {eItemTipo} from '../Entidades/Item';
import {eMedida, getMedida} from '../Entidades/Medida';
import {Receita} from '../Entidades/Receita';
import {ReceitaRepositorio} from '../Repositorios/ReceitaRepositorio';
import {listaReceitas} from './InitialDataStub';

export class ReceitaRepositorioStub implements ReceitaRepositorio {
    private _listaReceitas: Receita[];

    constructor() {
        this._listaReceitas = [...listaReceitas];
    }
    
    buscaReceita: (id: number) => Promise<Receita | null>;
    gravaReceita: (receita: Receita) => Promise<number>;

    async listaReceitas(): Promise<Receita[]> {
        return _.cloneDeep(this._listaReceitas);
    }
}
