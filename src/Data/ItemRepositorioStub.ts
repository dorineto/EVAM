import _ from 'lodash';
import {ItemEstoque, eItemTipo} from '../Entidades/Item';
import {eMedida, getMedida} from '../Entidades/Medida';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';

const listaInicial = [
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

export default class ItemRepositorioStub implements ItemRepositorio {
    private _itensGravados: ItemEstoque[];

    constructor() {
        this._itensGravados = listaInicial;
    }

    async listaMateriasPrimas(): Promise<ItemEstoque[]> {
        return await this.listaItemEstoque(eItemTipo.MateriaPrima);
    }

    async listaProdutos(): Promise<ItemEstoque[]> {
        return await this.listaItemEstoque(eItemTipo.Produto);
    }

    private async listaItemEstoque(tipo: eItemTipo): Promise<ItemEstoque[]> {
        return this._itensGravados.filter(ig => ig.item.tipo === tipo);
    }

    async buscaMateriaPrima(id: number): Promise<ItemEstoque | null> {
        return await this.buscaItemEstoque(id, eItemTipo.MateriaPrima);
    }

    async buscaProduto(id: number): Promise<ItemEstoque | null> {
        return await this.buscaItemEstoque(id, eItemTipo.Produto);
    }

    private async buscaItemEstoque(
        id: number,
        tipo: eItemTipo,
    ): Promise<ItemEstoque | null> {
        return (
            this._itensGravados.find(
                ig => ig.item.tipo === tipo && ig.item.id === id,
            ) ?? null
        );
    }

    async gravaMateriaPrima(item: ItemEstoque): Promise<number> {
        return await this.gravaItemEstoque(item);
    }

    async gravaProduto(item: ItemEstoque): Promise<number> {
        return await this.gravaItemEstoque(item);
    }

    private async gravaItemEstoque(item: ItemEstoque): Promise<number> {
        let itemGravado = this._itensGravados.find(
            i => i.item.id === item.item.id,
        );

        if (itemGravado) {
            itemGravado.item.descricao = item.item.descricao;
            itemGravado.medida = item.medida;
            itemGravado.qtd = item.qtd;
            itemGravado.valorMediaUnidade = item.valorMediaUnidade;

            return itemGravado.item.id;
        }

        let novoId = Math.max(...this._itensGravados.map(i => i.item.id)) + 1;

        let itemGrava = _.cloneDeep(item);

        itemGrava.item.id = novoId;

        this._itensGravados.push(itemGrava);

        return novoId;
    }

    async deletaMateriaPrima(id: number): Promise<void> {
        await this.deletaItemEstoque(id);
    }

    async deletaProduto(id: number): Promise<void> {
        await this.deletaItemEstoque(id);
    }

    async deletaItemEstoque(id: number): Promise<void> {
        this._itensGravados = this._itensGravados.filter(
            ig => ig.item.id !== id,
        );
    }
}
