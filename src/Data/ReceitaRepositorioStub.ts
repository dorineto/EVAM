import _ from 'lodash';
import {eItemTipo} from '../Entidades/Item';
import {eMedida, getMedida} from '../Entidades/Medida';
import {Receita} from '../Entidades/Receita';
import {ReceitaRepositorio} from '../Repositorios/ReceitaRepositorio';

const listaInicial: Receita[] = [
    new Receita(
        1,
        'Vela de lavanda',
        {
            item: {
                id: 6,
                descricao: 'Vela de lavanda',
                inclusao: new Date('2023-09-28 13:35:00').toISOString(),
                tipo: eItemTipo.Produto,
            },
            medida: getMedida(eMedida.unidade),
            qtd: 5,
        },
        [
            {
                item: {
                    id: 1,
                    descricao: 'Essencia lavanda',
                    inclusao: new Date('2023-09-20 00:30:00').toISOString(),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.mililitro),
                qtd: 50,
                valorMediaUnidade: 0.3,
            },
            {
                item: {
                    id: 3,
                    descricao: 'Parafina',
                    inclusao: new Date('2023-09-20 00:33:00').toISOString(),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.kilo),
                qtd: 0.5,
                valorMediaUnidade: 15,
            },
            {
                item: {
                    id: 4,
                    descricao: 'Pavio com ilhós',
                    inclusao: new Date('2023-09-20 00:33:00').toISOString(),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.unidade),
                qtd: 5,
                valorMediaUnidade: 0.2,
            },
            {
                item: {
                    id: 5,
                    descricao: 'Copo de vidro',
                    inclusao: new Date('2023-09-27 13:42:00').toISOString(),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.unidade),
                qtd: 5,
                valorMediaUnidade: 3.5,
            },
        ],
        new Date('2023-09-29 14:36:00'),
    ),
    new Receita(
        2,
        'Home spray lavanda',
        {
            item: {
                id: 8,
                descricao: 'Home spray lavanda',
                inclusao: new Date('2023-09-28 13:35:00').toISOString(),
                tipo: eItemTipo.Produto,
            },
            medida: getMedida(eMedida.litro),
            qtd: 1,
        },
        [
            {
                item: {
                    id: 1,
                    descricao: 'Essencia lavanda',
                    inclusao: new Date('2023-09-20 00:30:00').toISOString(),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.mililitro),
                qtd: 100,
                valorMediaUnidade: 0.3,
            },
            {
                item: {
                    id: 11,
                    descricao: 'Álcool de cereais',
                    inclusao: new Date('2023-09-29 15:02:00').toISOString(),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.litro),
                qtd: 0.9,
                valorMediaUnidade: 10.5,
            },
        ],
        new Date('2023-09-29 14:36:00'),
    ),
];

export class ReceitaRepositorioStub implements ReceitaRepositorio {
    private _listaReceitas: Receita[];

    constructor() {
        this._listaReceitas = listaInicial;
    }

    async listaReceitas(): Promise<Receita[]> {
        return _.cloneDeep(this._listaReceitas);
    }
}
