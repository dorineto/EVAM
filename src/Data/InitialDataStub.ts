import {Item, eItemTipo} from '../Entidades/Item';
import {eMedida, getMedida} from '../Entidades/Medida';
import {Receita} from '../Entidades/Receita';

export const listaMateriaPrima = [
    {
        item: {
            id: 1,
            descricao: 'Essencia lavanda',
            inclusao: new Date('2023-09-20 00:30:00').toISOString(),
            tipo: eItemTipo.MateriaPrima,
        },
        medida: getMedida(eMedida.mililitro),
        qtd: 1000,
        valorMediaUnidade: 0.3,
    },
    {
        item: {
            id: 2,
            descricao: 'Base glicerinada',
            inclusao: new Date('2023-09-20 00:32:00').toISOString(),
            tipo: eItemTipo.MateriaPrima,
        },
        medida: getMedida(eMedida.kilo),
        qtd: 10,
        valorMediaUnidade: 30,
    },
    {
        item: {
            id: 3,
            descricao: 'Parafina',
            inclusao: new Date('2023-09-20 00:33:00').toISOString(),
            tipo: eItemTipo.MateriaPrima,
        },
        medida: getMedida(eMedida.kilo),
        qtd: 10,
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
        qtd: 150,
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
        qtd: 15,
        valorMediaUnidade: 3.5,
    },
    {
        item: {
            id: 11,
            descricao: 'Álcool de cereais',
            inclusao: new Date('2023-09-29 15:02:00').toISOString(),
            tipo: eItemTipo.MateriaPrima,
        },
        medida: getMedida(eMedida.litro),
        qtd: 5,
        valorMediaUnidade: 10.5,
    },
];

export const listaProdutos = [
    {
        item: {
            id: 6,
            descricao: 'Vela de lavanda',
            inclusao: new Date('2023-09-28 13:35:00').toISOString(),
            tipo: eItemTipo.Produto,
        },
        medida: getMedida(eMedida.unidade),
        qtd: 3,
        valorMediaUnidade: 15.5,
    },
    {
        item: {
            id: 7,
            descricao: 'Vela de massagem',
            inclusao: new Date('2023-09-28 13:35:00').toISOString(),
            tipo: eItemTipo.Produto,
        },
        medida: getMedida(eMedida.unidade),
        qtd: 0,
        valorMediaUnidade: 20.7,
    },
    {
        item: {
            id: 8,
            descricao: 'Home spray lavanda',
            inclusao: new Date('2023-09-28 13:35:00').toISOString(),
            tipo: eItemTipo.Produto,
        },
        medida: getMedida(eMedida.litro),
        qtd: 1.5,
        valorMediaUnidade: 35.5,
    },
    {
        item: {
            id: 9,
            descricao: 'Incenso de cravo',
            inclusao: new Date('2023-09-28 13:35:00').toISOString(),
            tipo: eItemTipo.Produto,
        },
        medida: getMedida(eMedida.unidade),
        qtd: 15,
        valorMediaUnidade: 7.5,
    },
    {
        item: {
            id: 10,
            descricao: 'Vela 7 cristais',
            inclusao: new Date('2023-09-28 13:35:00').toISOString(),
            tipo: eItemTipo.Produto,
        },
        medida: getMedida(eMedida.unidade),
        qtd: 1,
        valorMediaUnidade: 17.5,
    },
];

function getItem(id: number, tipo: eItemTipo): Item {
    const listaConsulta =
        tipo === eItemTipo.MateriaPrima ? listaMateriaPrima : listaProdutos;

    const itemBuscado = listaConsulta.find(i => i.item.id === id)?.item;

    if (itemBuscado === undefined) {
        throw new Error(`Item não encontrado id: ${id}`);
    }

    return itemBuscado;
}

export const listaReceitas = [
    new Receita(
        1,
        'Vela de lavanda',
        {
            item: getItem(6, eItemTipo.Produto),
            medida: getMedida(eMedida.unidade),
            qtd: 5,
        },
        [
            {
                item: getItem(1, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.mililitro),
                qtd: 50,
                valorMediaUnidade: 0.3,
            },
            {
                item: getItem(3, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.kilo),
                qtd: 0.5,
                valorMediaUnidade: 15,
            },
            {
                item: getItem(4, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.unidade),
                qtd: 5,
                valorMediaUnidade: 0.2,
            },
            {
                item: getItem(5, eItemTipo.MateriaPrima),
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
            item: getItem(8, eItemTipo.Produto),
            medida: getMedida(eMedida.litro),
            qtd: 1,
        },
        [
            {
                item: getItem(1, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.mililitro),
                qtd: 100,
                valorMediaUnidade: 0.3,
            },
            {
                item: getItem(11, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.litro),
                qtd: 0.9,
                valorMediaUnidade: 10.5,
            },
        ],
        new Date('2023-09-29 14:36:00'),
    ),
];
