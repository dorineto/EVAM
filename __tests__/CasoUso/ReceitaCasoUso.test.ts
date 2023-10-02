import {ReceitaCasoUso} from '../../src/CasosUsos/ReceitaCasoUso';
import {
    Item,
    ItemEstoque,
    ItemMensurado,
    ItemReceita,
    eItemTipo,
} from '../../src/Entidades/Item';
import {Medida, getMedida, eMedida} from '../../src/Entidades/Medida';
import {Receita} from '../../src/Entidades/Receita';
import {ItemRepositorio} from '../../src/Repositorios/ItemRepositorio';
import {ReceitaRepositorio} from '../../src/Repositorios/ReceitaRepositorio';
import {
    ItemBuilder,
    ItemEstoqueBuilder,
    setupStubsItemRepositorio,
} from './ItemCasoUso.test';

export function setupStubsReceitaRepositorio(): [ReceitaRepositorio] {
    return [
        {
            listaReceitas: jest.fn(async () => []),
            buscaReceita: jest.fn(async (_: number) => null),
            gravaReceita: jest.fn(async (_: Receita) => 0),
        },
    ];
}

function setupStubs(): [ReceitaRepositorio, ItemRepositorio] {
    return [...setupStubsReceitaRepositorio(), ...setupStubsItemRepositorio()];
}

//setupStubsItemRepositorio

describe('Quando listaReceitas', () => {
    it.concurrent(
        'Caso retorne registros do repositorio então retorna os registros',
        async () => {
            const [ReceitaRepositorioStub, ItemRepositorioStub] = setupStubs();

            ReceitaRepositorioStub.listaReceitas = async () => [
                ReceitaBuilder.CriaItemTeste(1),
                ReceitaBuilder.CriaItemTeste(2),
            ];

            let receitaCasoUsoTest = new ReceitaCasoUso(
                ReceitaRepositorioStub,
                ItemRepositorioStub,
            );

            let retorno = await receitaCasoUsoTest.listaReceitas();

            expect(retorno).not.toHaveLength(0);
            expect(retorno).toEqual([
                ReceitaBuilder.CriaItemTeste(1),
                ReceitaBuilder.CriaItemTeste(2),
            ]);
        },
    );

    it.concurrent(
        'Caso não retorna registros do repositorio então retorna vazio',
        async () => {
            const [ReceitaRepositorioStub, ItemRepositorioStub] = setupStubs();

            ReceitaRepositorioStub.listaReceitas = async () => [];

            let receitaCasoUsoTest = new ReceitaCasoUso(
                ReceitaRepositorioStub,
                ItemRepositorioStub,
            );
            expect(await receitaCasoUsoTest.listaReceitas()).toHaveLength(0);
        },
    );

    it.concurrent(
        'Caso o repositório lance uma excessão então deixa lançar',
        async () => {
            const [ReceitaRepositorioStub, ItemRepositorioStub] = setupStubs();

            ReceitaRepositorioStub.listaReceitas = async function () {
                throw new Error('Error repositorio esperado');
            };

            let receitaCasoUsoTest = new ReceitaCasoUso(
                ReceitaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(receitaCasoUsoTest.listaReceitas()).rejects.toThrow();
        },
    );
});

describe('Quando buscaReceita', () => {
    it.concurrent('Caso registro exista então retorna o registro', async () => {
        const [ReceitaRepositorioStub, ItemRepositorioStub] = setupStubs();

        const receitaTeste = ReceitaBuilder.CriaItemTeste(1);

        ReceitaRepositorioStub.buscaReceita = async (_: number) => receitaTeste;

        let ReceitaCasoUsoTest = new ReceitaCasoUso(
            ReceitaRepositorioStub,
            ItemRepositorioStub,
        );

        let retorno = await ReceitaCasoUsoTest.buscaReceita(1);

        let retornoEsperado = ReceitaBuilder.CriaItemTeste(1);

        expect(retorno).not.toBeNull();
        expect(retorno).toEqual(retornoEsperado);
        expect(retorno).not.toBe(receitaTeste);
    });

    it.concurrent('Caso registro não exista então retorna null', async () => {
        const [ReceitaRepositorioStub, ItemRepositorioStub] = setupStubs();

        ReceitaRepositorioStub.buscaReceita = async (_: number) => null;

        let ReceitaCasoUsoTest = new ReceitaCasoUso(
            ReceitaRepositorioStub,
            ItemRepositorioStub,
        );

        let retorno = await ReceitaCasoUsoTest.buscaReceita(2);

        expect(retorno).toBeNull();
    });

    it.concurrent('Caso passado ids invalidos retorna null', async () => {
        const [ReceitaRepositorioStub, ItemRepositorioStub] = setupStubs();

        ReceitaRepositorioStub.buscaReceita = jest.fn(
            async (_: number) => null,
        );

        let ReceitaCasoUsoTest = new ReceitaCasoUso(
            ReceitaRepositorioStub,
            ItemRepositorioStub,
        );

        // teste ids 0
        let retorno = await ReceitaCasoUsoTest.buscaReceita(0);
        expect(retorno).toBeNull();
        expect(ReceitaRepositorioStub.buscaReceita).toBeCalledTimes(0);

        // teste ids negativos
        retorno = await ReceitaCasoUsoTest.buscaReceita(-1);

        expect(retorno).toBeNull();
        expect(ReceitaRepositorioStub.buscaReceita).toBeCalledTimes(0);
    });

    it.concurrent(
        'Caso o repositório lance uma excessão então deixa lançar',
        async () => {
            const [ReceitaRepositorioStub, ItemRepositorioStub] = setupStubs();

            ReceitaRepositorioStub.buscaReceita = async (_: number) => {
                throw new Error();
            };

            let ReceitaCasoUsoTest = new ReceitaCasoUso(
                ReceitaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(() =>
                ReceitaCasoUsoTest.buscaReceita(1),
            ).rejects.toThrow();
        },
    );
});

describe('Quando gravaReceita', () => {
    it.concurrent(
        'Caso valore validos deve gravar receita e atualiza valor médio quando não tem outra receita',
        async () => {
            const [ReceitaRepositorioStub, ItemRepositorioStub] = setupStubs();

            ReceitaRepositorioStub.gravaReceita = jest.fn(
                async (_: Receita) => 1,
            );

            ItemRepositorioStub.buscaProduto = async (_: number) => {
                return new ItemEstoqueBuilder()
                    .setItemInfo(
                        ItemBuilder.CriaItemTeste(
                            7,
                            new ItemBuilder().setTipo(eItemTipo.Produto),
                        ),
                    )
                    .setValorMediaUnidade(76)
                    .build();
            };

            ItemRepositorioStub.gravaProduto = jest.fn(
                async (_: ItemEstoque) => 1,
            );

            let ReceitaCasoUsoTest = new ReceitaCasoUso(
                ReceitaRepositorioStub,
                ItemRepositorioStub,
            );

            const receitaTeste = ReceitaBuilder.CriaItemTeste(
                1,
                new ReceitaBuilder()
                    .setIngredientes([
                        ItemReceitaBuilder.CriaListaTestes(
                            1,
                            1,
                            new ItemReceitaBuilder()
                                .setQtd(2)
                                .setValorMediaUnidade(5),
                        )[0],
                        ItemReceitaBuilder.CriaListaTestes(
                            2,
                            1,
                            new ItemReceitaBuilder()
                                .setQtd(0.5)
                                .setValorMediaUnidade(8),
                        )[0],
                    ])
                    .setProduz(new ItemMensuradoBuilder().setQtd(2).build()),
            );

            let retorno = await ReceitaCasoUsoTest.gravaReceita(receitaTeste);

            expect(retorno).toEqual(1);
            expect(ReceitaRepositorioStub.gravaReceita).toBeCalled();
            expect(
                (<jest.Mock>ItemRepositorioStub.gravaProduto).mock.calls[0][0]
                    ?.valorMediaUnidade ?? 0,
            ).toEqual(7);
        },
    );
});

export class ItemMensuradoBuilder {
    private _item: Item = ItemBuilder.CriaItemTeste(1);
    private _medida: Medida = getMedida(eMedida.unidade);
    private _qtd: number = 0;

    setItem(item: Item): ItemMensuradoBuilder {
        this._item = item;
        return this;
    }

    setMedida(medida: Medida): ItemMensuradoBuilder {
        this._medida = medida;
        return this;
    }

    setQtd(qtd: number): ItemMensuradoBuilder {
        this._qtd = qtd;
        return this;
    }

    build(): ItemMensurado {
        return {
            item: this._item,
            medida: this._medida,
            qtd: this._qtd,
        };
    }

    static CriaItemTeste(
        itemMesuradoBuilder: ItemMensuradoBuilder | null = null,
    ): ItemMensurado {
        const itemMensauradoBuilderSelecionado =
            itemMesuradoBuilder ?? new ItemMensuradoBuilder();

        return itemMensauradoBuilderSelecionado.setQtd(12).build();
    }
}

export class ItemReceitaBuilder {
    private _item: Item = ItemBuilder.CriaItemTeste();
    private _medida: Medida = getMedida(eMedida.unidade);
    private _qtd: number = 0;
    private _valorMediaUnidade: number = 0;

    setItem(item: Item): ItemReceitaBuilder {
        this._item = item;
        return this;
    }
    setMedida(medida: Medida): ItemReceitaBuilder {
        this._medida = medida;
        return this;
    }
    setQtd(qtd: number): ItemReceitaBuilder {
        this._qtd = qtd;
        return this;
    }
    setValorMediaUnidade(valorMediaUnidade: number): ItemReceitaBuilder {
        this._valorMediaUnidade = valorMediaUnidade;
        return this;
    }

    build(): ItemReceita {
        return {
            item: this._item,
            medida: this._medida,
            qtd: this._qtd,
            valorMediaUnidade: this._valorMediaUnidade,
        };
    }

    static CriaItemTeste(itemReceitaBuilder: ItemReceitaBuilder | null = null) {
        const itemReceitaBuilderSelecionado =
            itemReceitaBuilder ?? new ItemReceitaBuilder();

        return itemReceitaBuilderSelecionado.setQtd(55).build();
    }

    static CriaListaTestes(
        inicioId: number = 1,
        quantity: number = 1,
        itemReceitaBuilder: ItemReceitaBuilder | null = null,
        itemBuilder: ItemBuilder | null = null,
    ): ItemReceita[] {
        const itemReceitaBuilderSelecionado =
            itemReceitaBuilder ?? new ItemReceitaBuilder().setQtd(7.6);
        const itemBuilderSelecionado = itemBuilder ?? new ItemBuilder();

        const itensGerados = ItemBuilder.CriaListaTeste(
            inicioId,
            quantity,
            itemBuilderSelecionado,
        );

        return itensGerados.map(ig => {
            return itemReceitaBuilderSelecionado.setItem(ig).build();
        });
    }
}

export class ReceitaBuilder {
    private _id: number = 0;
    private _descricao: string = '';
    private _produz: ItemMensurado = ItemMensuradoBuilder.CriaItemTeste();
    private _ingredientes: ItemReceita[] = [];
    private _inclusao: string = new Date('2023-10-01 18:44:00').toISOString();

    setId(id: number): ReceitaBuilder {
        this._id = id;
        return this;
    }
    setDescricao(descricao: string): ReceitaBuilder {
        this._descricao = descricao;
        return this;
    }
    setProduz(produz: ItemMensurado): ReceitaBuilder {
        this._produz = produz;
        return this;
    }
    setIngredientes(ingredientes: ItemReceita[]): ReceitaBuilder {
        this._ingredientes = ingredientes;
        return this;
    }
    setInclusao(inclusao: Date): ReceitaBuilder {
        this._inclusao = inclusao.toISOString();
        return this;
    }

    build(): Receita {
        return new Receita(
            this._id,
            this._descricao,
            this._produz,
            this._ingredientes,
            new Date(this._inclusao),
        );
    }

    static CriaItemTeste(
        id: number = 1,
        receitaBuilder: ReceitaBuilder | null = null,
    ) {
        const receitaBuilderSelecionado =
            receitaBuilder ?? new ReceitaBuilder();

        return receitaBuilderSelecionado
            .setId(id)
            .setDescricao(`Teste ${id}`)
            .build();
    }
}
