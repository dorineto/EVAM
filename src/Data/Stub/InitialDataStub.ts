import {Cliente} from '../../Entidades/Cliente';
import {Item, eItemTipo} from '../../Entidades/Item';
import {Local} from '../../Entidades/Local';
import {eMedida, getMedida} from '../../Entidades/Medida';
import {OrdemCompra} from '../../Entidades/OrdemCompra';
import {OrdemVenda} from '../../Entidades/OrdemVenda';
import {Receita} from '../../Entidades/Receita';

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

export const listaOrdemCompras = [
    new OrdemCompra(
        1,
        [
            {
                item: getItem(1, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.mililitro),
                qtd: 150,
                valorTotal: 25.8,
            },
            {
                item: getItem(2, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.kilo),
                qtd: 1.5,
                valorTotal: 38,
            },
            {
                item: getItem(3, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.kilo),
                qtd: 0.5,
                valorTotal: 15,
            },
        ],
        new Date('2023-10-05 12:24:00'),
    ),
    new OrdemCompra(
        2,
        [
            {
                item: getItem(5, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.unidade),
                qtd: 10,
                valorTotal: 50.3,
            },
            {
                item: getItem(4, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.unidade),
                qtd: 13,
                valorTotal: 10,
            },
        ],
        new Date('2023-10-06 12:24:00'),
    ),
    new OrdemCompra(
        3,
        [
            {
                item: getItem(1, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.mililitro),
                qtd: 100,
                valorTotal: 15.8,
            },
            {
                item: getItem(4, eItemTipo.MateriaPrima),
                medida: getMedida(eMedida.unidade),
                qtd: 5,
                valorTotal: 7,
            },
        ],
        new Date('2023-10-07 12:24:00'),
    ),
];

export const listaClientes: Cliente[] = [
    {
        id: 1,
        nome: 'Roberta Moreira',
        inclusao: new Date('2023-10-08 12:57:00').toISOString(),
    },
    {
        id: 2,
        nome: 'Giovanni Lima',
        inclusao: new Date('2023-10-08 12:57:00').toISOString(),
    },
    {
        id: 3,
        nome: 'Marcia Ribeiro',
        inclusao: new Date('2023-10-08 12:57:00').toISOString(),
    },
    {
        id: 4,
        nome: 'Antonio Costa',
        inclusao: new Date('2023-10-08 12:57:00').toISOString(),
    },
];

export const listaLocais: Local[] = [
    {
        id: 1,
        descricao: 'Elo7',
        inclusao: new Date('2023-10-08 13:00:00').toISOString(),
    },
    {
        id: 2,
        descricao: 'Shopping Center 3',
        inclusao: new Date('2023-10-08 13:00:00').toISOString(),
    },
    {
        id: 3,
        descricao: 'Mercadão das flores',
        inclusao: new Date('2023-10-08 13:00:00').toISOString(),
    },
    {
        id: 4,
        descricao: 'Pedido via WhatsApp',
        inclusao: new Date('2023-10-08 13:00:00').toISOString(),
    },
];

function getCliente(id: number): Cliente {
    const retorno = listaClientes.find(lc => lc.id === id);

    if (!retorno) {
        throw Error('Não foi possivel encontrar o cliente com o id informado');
    }

    return retorno;
}

function getLocal(id: number): Local {
    const retorno = listaLocais.find(ll => ll.id === id);

    if (!retorno) {
        throw Error('Não foi possivel encontrar o local com o id informado');
    }

    return retorno;
}

export const listaVendas: OrdemVenda[] = [
    new OrdemVenda(
        1,
        getCliente(1),
        getLocal(1),
        [
            {
                item: getItem(6, eItemTipo.Produto),
                medida: getMedida(eMedida.unidade),
                qtd: 2,
                valorTotal: 42.78,
            },
            {
                item: getItem(8, eItemTipo.Produto),
                medida: getMedida(eMedida.litro),
                qtd: 0.5,
                valorTotal: 20.58,
            },
        ],
        new Date('2023-10-04 13:13:00'),
    ),
    new OrdemVenda(
        2,
        getCliente(2),
        getLocal(1),
        [
            {
                item: getItem(8, eItemTipo.Produto),
                medida: getMedida(eMedida.litro),
                qtd: 1,
                valorTotal: 41.16,
            },
        ],
        new Date('2023-10-04 13:13:00'),
    ),
    new OrdemVenda(
        3,
        getCliente(3),
        getLocal(4),
        [
            {
                item: getItem(9, eItemTipo.Produto),
                medida: getMedida(eMedida.unidade),
                qtd: 10,
                valorTotal: 25,
            },
            {
                item: getItem(10, eItemTipo.Produto),
                medida: getMedida(eMedida.unidade),
                qtd: 1,
                valorTotal: 35.7,
            },
        ],
        new Date('2023-10-04 13:13:00'),
    ),
    new OrdemVenda(
        4,
        getCliente(4),
        getLocal(3),
        [
            {
                item: getItem(6, eItemTipo.Produto),
                medida: getMedida(eMedida.unidade),
                qtd: 3,
                valorTotal: 50,
            },
        ],
        new Date('2023-10-05 13:13:00'),
    ),
    new OrdemVenda(
        5,
        getCliente(1),
        getLocal(1),
        [
            {
                item: getItem(7, eItemTipo.Produto),
                medida: getMedida(eMedida.unidade),
                qtd: 1,
                valorTotal: 25,
            },
        ],
        new Date('2023-10-06 13:13:00'),
    ),
    new OrdemVenda(
        6,
        getCliente(2),
        getLocal(2),
        [
            {
                item: getItem(8, eItemTipo.Produto),
                medida: getMedida(eMedida.litro),
                qtd: 1.5,
                valorTotal: 58.2,
            },
        ],
        new Date('2023-10-07 13:13:00'),
    ),
    new OrdemVenda(
        7,
        getCliente(4),
        getLocal(2),
        [
            {
                item: getItem(9, eItemTipo.Produto),
                medida: getMedida(eMedida.unidade),
                qtd: 5,
                valorTotal: 36,
            },
            {
                item: getItem(10, eItemTipo.Produto),
                medida: getMedida(eMedida.unidade),
                qtd: 1,
                valorTotal: 45.5,
            },
        ],
        new Date('2023-10-07 13:13:00'),
    ),
    new OrdemVenda(
        8,
        getCliente(3),
        getLocal(2),
        [
            {
                item: getItem(8, eItemTipo.Produto),
                medida: getMedida(eMedida.unidade),
                qtd: 1,
                valorTotal: 25,
            },
            {
                item: getItem(9, eItemTipo.Produto),
                medida: getMedida(eMedida.unidade),
                qtd: 2,
                valorTotal: 11,
            },
        ],
        new Date('2023-10-07 13:13:00'),
    ),
];
