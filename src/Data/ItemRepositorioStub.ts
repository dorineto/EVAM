import _ from 'lodash';
import {ItemEstoque, eItemTipo} from '../Entidades/Item';
import {eMedida, getMedida} from '../Entidades/Medida';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';

const listaInicial = [
    {
        item: {
            id: 1,
            descricao: 'Essencia',
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
];

export default class ItemRepositorioStub implements ItemRepositorio {
    private _itensGravados: ItemEstoque[];

    constructor() {
        this._itensGravados = listaInicial;
    }

    async listaMateriasPrimas(): Promise<ItemEstoque[]> {
        return this._itensGravados.filter(
            ig => ig.item.tipo === eItemTipo.MateriaPrima,
        );
    }

    async buscaMateriaPrima(id: number): Promise<ItemEstoque | null> {
        return (
            this._itensGravados.find(
                ig =>
                    ig.item.tipo === eItemTipo.MateriaPrima &&
                    ig.item.id === id,
            ) ?? null
        );
    }

    async gravaMateriaPrima(item: ItemEstoque): Promise<number> {
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
        this._itensGravados = this._itensGravados.filter(
            ig => ig.item.id !== id,
        );
    }
}
