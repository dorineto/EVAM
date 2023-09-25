import {ItemCasoUso} from '../src/CasosUsos/ItemCasoUso';
import {Item, ItemEstoque, eItemTipo} from '../src/Entidades/Item';
import {Medida, eMedida, getMedida} from '../src/Entidades/Medida';
import {ItemRepositorio} from '../src/Repositorios/ItemRepositorio';

function setupStubs(): [ItemRepositorio] {
    return [
        {
            listaMateriasPrimas: jest.fn(async () => []),
            buscaMateriaPrima: jest.fn(async (_: number) => null),
            gravaMateriaPrima: jest.fn(async (_: ItemEstoque) => 0),
            deletaMateriaPrima: jest.fn(async function (_: number) {}),
        },
    ];
}

// Reseta o itemRepositorioStub a cada teste
describe('Quando listaMateriasPrimas', () => {
    it.concurrent(
        'Caso retorne registros do repositorio então retorna os registros',
        async () => {
            const [itemRepositorioStub] = setupStubs();

            itemRepositorioStub.listaMateriasPrimas = async () =>
                ItemEstoqueBuilder.CriaListaTeste(1, 5);

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            let retorno = await itemCasoUsoTest.listaMateriasPrimas();

            expect(retorno).not.toHaveLength(0);
            expect(retorno).toEqual(ItemEstoqueBuilder.CriaListaTeste(1, 5));
        },
    );

    it.concurrent(
        'Caso não retorna registros do repositorio então retorna vazio',
        async () => {
            const [itemRepositorioStub] = setupStubs();

            itemRepositorioStub.listaMateriasPrimas = async () => [];

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);
            expect(await itemCasoUsoTest.listaMateriasPrimas()).toHaveLength(0);
        },
    );

    it.concurrent(
        'Caso o repositório lance uma excessão então deixa lançar',
        async () => {
            const [itemRepositorioStub] = setupStubs();

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

describe('Quando buscaMateriaPrima', () => {
    it.concurrent('Caso registro exista então retorna o registro', async () => {
        const [itemRepositorioStub] = setupStubs();

        const itemEstoqueTeste = ItemEstoqueBuilder.CriaItemTeste(1);

        itemRepositorioStub.buscaMateriaPrima = async (_: number) =>
            itemEstoqueTeste;

        let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

        let retorno = await itemCasoUsoTest.buscaMateriaPrima(1);

        let retornoEsperado = ItemEstoqueBuilder.CriaItemTeste(1);

        expect(retorno).not.toBeNull();
        expect(retorno).toEqual(retornoEsperado);
        expect(retorno).not.toBe(itemEstoqueTeste);
    });

    it.concurrent('Caso registro não exista então retorna null', async () => {
        const [itemRepositorioStub] = setupStubs();

        itemRepositorioStub.buscaMateriaPrima = async (_: number) => null;

        let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

        let retorno = await itemCasoUsoTest.buscaMateriaPrima(2);

        expect(retorno).toBeNull();
    });

    it.concurrent('Caso passado ids invalidos retorna null', async () => {
        const [itemRepositorioStub] = setupStubs();

        itemRepositorioStub.buscaMateriaPrima = jest.fn(
            async (_: number) => null,
        );

        let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

        // teste ids 0
        let retorno = await itemCasoUsoTest.buscaMateriaPrima(0);
        expect(retorno).toBeNull();
        expect(itemRepositorioStub.buscaMateriaPrima).toBeCalledTimes(0);

        // teste ids negativos
        retorno = await itemCasoUsoTest.buscaMateriaPrima(-1);

        expect(retorno).toBeNull();
        expect(itemRepositorioStub.buscaMateriaPrima).toBeCalledTimes(0);
    });

    it.concurrent(
        'Caso o repositório lance uma excessão então deixa lançar',
        async () => {
            const [itemRepositorioStub] = setupStubs();

            itemRepositorioStub.buscaMateriaPrima = async (_: number) => {
                throw new Error();
            };

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            await expect(() =>
                itemCasoUsoTest.buscaMateriaPrima(1),
            ).rejects.toThrow();
        },
    );
});

describe('Quando gravaMateriaPrima', () => {
    it.concurrent(
        'Caso passado valores validos então grava e retorna o id',
        async () => {
            const [itemRepositorioStub] = setupStubs();

            itemRepositorioStub.gravaMateriaPrima = jest.fn(
                async (_: ItemEstoque) => 1,
            );

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            const itemEstoqueGrava = ItemEstoqueBuilder.CriaItemTeste(0);

            let retorno = await itemCasoUsoTest.gravaMateriaPrima(
                itemEstoqueGrava,
            );

            const itemEstoqueEsperado = ItemEstoqueBuilder.CriaItemTeste(0);

            expect(itemEstoqueGrava).toEqual(itemEstoqueEsperado);
            expect(retorno).toEqual(1);
            expect(itemRepositorioStub.gravaMateriaPrima).toBeCalled();
        },
    );

    it.concurrent(
        'Caso passado valores invalidos então lança excessão',
        async () => {
            const [itemRepositorioStub] = setupStubs();

            itemRepositorioStub.gravaMateriaPrima = jest.fn(
                async (_: ItemEstoque) => 1,
            );

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            async function assertLancaExcessaoValorInvalido(
                itemGrava: ItemEstoque,
            ) {
                await expect(() =>
                    itemCasoUsoTest.gravaMateriaPrima(itemGrava),
                ).rejects.toThrow();

                expect(itemRepositorioStub.gravaMateriaPrima).not.toBeCalled();
            }

            // Descricao item vazia
            let itemEstoqueGrava = ItemEstoqueBuilder.CriaItemTeste(0);

            itemEstoqueGrava.item.descricao = '';
            await assertLancaExcessaoValorInvalido(itemEstoqueGrava);

            // Qtd negativa
            itemEstoqueGrava = ItemEstoqueBuilder.CriaItemTeste(0);

            itemEstoqueGrava.qtd = -1;
            await assertLancaExcessaoValorInvalido(itemEstoqueGrava);

            // ValorMediaUnidade negativa
            itemEstoqueGrava = ItemEstoqueBuilder.CriaItemTeste(0);

            itemEstoqueGrava.valorMediaUnidade = -1;
            await assertLancaExcessaoValorInvalido(itemEstoqueGrava);
        },
    );

    it.concurrent(
        'Caso o repositório lance uma excessão então deixa lançar',
        async () => {
            const [itemRepositorioStub] = setupStubs();

            itemRepositorioStub.gravaMateriaPrima = async (_: ItemEstoque) => {
                throw new Error();
            };

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            const itemEstoqueGrava = ItemEstoqueBuilder.CriaItemTeste(0);

            await expect(() =>
                itemCasoUsoTest.gravaMateriaPrima(itemEstoqueGrava),
            ).rejects.toThrow();
        },
    );
});

describe('Quando deletaMateriaPrima', () => {
    it.concurrent(
        'Caso passado valores validos então deleta registro',
        async () => {
            const [itemRepositorioStub] = setupStubs();

            itemRepositorioStub.deletaMateriaPrima = jest.fn(async function (
                _: number,
            ) {});

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            await itemCasoUsoTest.deletaMateriaPrima(1);

            expect(itemRepositorioStub.deletaMateriaPrima).toBeCalled();
        },
    );

    it.concurrent(
        'Caso passe valores invalidos deve retornar sem chamar o repositorio',
        async () => {
            const [itemRepositorioStub] = setupStubs();

            itemRepositorioStub.deletaMateriaPrima = jest.fn(
                async (_: number) => {},
            );

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            // Id seja 0
            itemCasoUsoTest.deletaMateriaPrima(0);
            expect(itemRepositorioStub.deletaMateriaPrima).not.toBeCalled();

            // Id seja negativo
            itemCasoUsoTest.deletaMateriaPrima(-1);
            expect(itemRepositorioStub.deletaMateriaPrima).not.toBeCalled();
        },
    );

    it.concurrent(
        'Caso o repositório lance uma excessão então deixa lançar',
        async () => {
            const [itemRepositorioStub] = setupStubs();

            itemRepositorioStub.deletaMateriaPrima = async (_: number) => {
                throw new Error();
            };

            let itemCasoUsoTest = new ItemCasoUso(itemRepositorioStub);

            await expect(() =>
                itemCasoUsoTest.deletaMateriaPrima(1),
            ).rejects.toThrow();
        },
    );
});

class ItemBuilder {
    private _id: number = 0;
    private _tipo: eItemTipo = eItemTipo.MateriaPrima;
    private _descricao: string = '';
    private _inclusao: string = new Date('2023-09-20 14:00:00').toISOString();

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
        this._inclusao = inclusao.toISOString();
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
                    .setDescricao(`Teste Item ${id}`)
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
