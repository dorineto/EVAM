import {ItemCasoUso} from '../src/CasosUsos/ItemCasoUso';
import {Item, eItemTipo} from '../src/Entidades/Item';
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

    it('Caso retorne registros do repositorio então retorna os registros', () => {
        itemRepositorioStub.listaMateriasPrimas = jest.fn(async () => {});

        let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);
        expect(itemCasoUsoTest.listaMateriasPrimas()).not.toHaveLength(0);
    });

    it('Caso não retorna registros do repositorio então retorna vazio', () => {
        let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);
        expect(itemCasoUsoTest.listaMateriasPrimas()).toHaveLength(0);
    });
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

class ItemEstoqueBuilder {}

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
