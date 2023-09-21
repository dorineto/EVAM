import {ItemCasoUso} from '../src/CasosUsos/ItemCasoUso';
import {Item, ItemEstoque, eItemTipo} from '../src/Entidades/Item';
import {Medida, eMedida, getMedida} from '../src/Entidades/Medida';
import {ItemRepositorio} from '../src/Repositorios/ItemRepositorio';

let itemRepositorioStub: ItemRepositorio = {
    listaMateriasPrimas: jest.fn(async () => []),
};

// Reseta o itemRepositorioStub a cada teste
describe('Quando listaMateriasPrimas', () => {
    beforeEach(() => {
        itemRepositorioStub = {
            listaMateriasPrimas: jest.fn(async () => []),
        };
    });

    it.concurrent(
        'Caso retorne registros do repositorio então retorna os registros',
        async () => {
            itemRepositorioStub.listaMateriasPrimas = jest.fn(async () =>
                ItemEstoqueBuilder.CriaListaTeste(1, 5),
            );

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            let retorno = await itemCasoUsoTest.listaMateriasPrimas();

            expect(retorno).not.toHaveLength(0);
            expect(retorno).toEqual(ItemEstoqueBuilder.CriaListaTeste(1, 5));
        },
    );

    it.concurrent(
        'Caso não retorna registros do repositorio então retorna vazio',
        async () => {
            itemRepositorioStub.listaMateriasPrimas = async () => [];

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);
            expect(await itemCasoUsoTest.listaMateriasPrimas()).toHaveLength(0);
        },
    );

    it.concurrent(
        'Caso o repositório lance uma excessão então deixa lançar',
        async () => {
            itemRepositorioStub.listaMateriasPrimas = async function () {
                throw new Error('Error repositorio esperado');
            };

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            await expect(
                itemCasoUsoTest.listaMateriasPrimas(),
            ).rejects.toThrow();
        },
    );
});

class ItemBuilder {
    private _id: number = 0;
    private _tipo: eItemTipo = eItemTipo.MateriaPrima;
    private _descricao: string = '';
    private _inclusao: Date = new Date('2023-09-20 14:00:00');

    setId(id: number): ItemBuilder {
        this._id = id;
        return this;
    }

    setTipo(tipo: eItemTipo): ItemBuilder {
        this._tipo = tipo;
        return this;
    }

    setDescricao(descricao: string): ItemBuilder {
        this._descricao = descricao;
        return this;
    }

    setInclusao(inclusao: Date): ItemBuilder {
        this._inclusao = inclusao;
        return this;
    }

    build(): Item {
        return {
            id: this._id,
            tipo: this._tipo,
            descricao: this._descricao,
            inclusao: this._inclusao,
        };
    }

    static CriaItemTeste(
        id: number = 1,
        itemBuilder: ItemBuilder | null = null,
    ): Item {
        return this.CriaListaTeste(id, 1, itemBuilder)[0];
    }

    static CriaListaTeste(
        inicioId: number = 1,
        quantity: number = 1,
        itemBuilder: ItemBuilder | null = null,
    ): Item[] {
        let itemBuilderUtilizado = itemBuilder ?? new ItemBuilder();

        let retorno: Item[] = [];
        for (let i = 0; i < quantity; i++) {
            let id = inicioId + i;

            retorno.push(
                itemBuilderUtilizado
                    .setDescricao(`Teste Item {id}`)
                    .setId(id)
                    .build(),
            );
        }

        return retorno;
    }
}

class ItemEstoqueBuilder {
    private _item: Item = ItemBuilder.CriaItemTeste();
    private _medida: Medida = getMedida(eMedida.unidade);
    private _qtd: number = 0;
    private _valorMediaUnidade: number = 0;

    setItemInfo(item: Item): ItemEstoqueBuilder {
        this._item = item;
        return this;
    }

    setMedida(medida: Medida): ItemEstoqueBuilder {
        this._medida = medida;
        return this;
    }

    setQtd(qtd: number): ItemEstoqueBuilder {
        this._qtd = qtd;
        return this;
    }

    setValorMediaUnidade(valorMediaUnidade: number): ItemEstoqueBuilder {
        this._valorMediaUnidade = valorMediaUnidade;
        return this;
    }

    build(): ItemEstoque {
        return {
            item: this._item,
            medida: this._medida,
            qtd: this._qtd,
            valorMediaUnidade: this._valorMediaUnidade,
        };
    }

    static CriaItemTeste(
        id: number = 1,
        itemBuilder: ItemBuilder | null = null,
        itemEstoqueBuilder: ItemEstoqueBuilder | null = null,
    ): ItemEstoque {
        return this.CriaListaTeste(id, 1, itemBuilder, itemEstoqueBuilder)[0];
    }

    static CriaListaTeste(
        inicioId: number = 1,
        quantity: number = 1,
        itemBuilder: ItemBuilder | null = null,
        itemEstoqueBuilder: ItemEstoqueBuilder | null = null,
    ): ItemEstoque[] {
        const itemBuilderUtilizado = itemBuilder ?? new ItemBuilder();
        const itemEstoqueBuilderUtilizado =
            itemEstoqueBuilder ?? new ItemEstoqueBuilder();

        let retorno: ItemEstoque[] = [];
        for (let i = 0; i < quantity; i++) {
            let id = inicioId + i;

            let item = ItemBuilder.CriaItemTeste(id, itemBuilderUtilizado);

            retorno.push(
                itemEstoqueBuilderUtilizado
                    .setItemInfo(item)
                    .setQtd(1)
                    .setValorMediaUnidade(5.5)
                    .build(),
            );
        }

        return retorno;
    }
}

/*
export enum eItemTipo {
    MateriaPrima = 1,
    Produto = 2,
}

export interface Item {
    id: number;
    tipo: eItemTipo;
    descricao: string;
    inclusao: Date;
}

export interface ItemMensurado {
    item: Item;
    medida: Medida;
    qtd: number;
}

export interface ItemEstoque extends ItemMensurado {
    valorMediaUnidade: number;
}

export interface ItemOrdem extends ItemMensurado {
    valorTotal: number;
}
*/
