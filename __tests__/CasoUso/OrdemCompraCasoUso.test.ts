import {OrdemCompraCasoUso} from '../../src/CasosUsos/OrdemCompraCasoUso';
import {
    Item,
    ItemEstoque,
    ItemOrdem,
    eItemTipo,
} from '../../src/Entidades/Item';
import {Medida, eMedida, getMedida} from '../../src/Entidades/Medida';
import {OrdemCompra} from '../../src/Entidades/OrdemCompra';
import {ItemRepositorio} from '../../src/Repositorios/ItemRepositorio';
import {OrdemCompraRepositorio} from '../../src/Repositorios/OrdemCompraRepositorio';
import {
    ItemBuilder,
    ItemEstoqueBuilder,
    setupStubsItemRepositorio,
} from './ItemCasoUso.test';

export function setupStubsOrdemCompraRepositorio(): [OrdemCompraRepositorio] {
    return [
        {
            listaOrdemCompras: jest.fn(async () => []),
            buscaOrdemCompra: jest.fn(async (_: number) => null),
            gravaOrdemCompra: jest.fn(async (_: OrdemCompra) => 0),
            deletaOrdemCompra: jest.fn(async (_: number) => {}),
        },
    ];
}

function setupStubs(): [OrdemCompraRepositorio, ItemRepositorio] {
    return [
        ...setupStubsOrdemCompraRepositorio(),
        ...setupStubsItemRepositorio(),
    ];
}

describe('Quando listaOrdemCompras', () => {
    it.concurrent(
        'Caso retorne registros do repositorio então retorna os registros',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemCompraRepositorioStub.listaOrdemCompras = async () => [
                OrdemCompraBuilder.CriaCompraTeste(1),
                OrdemCompraBuilder.CriaCompraTeste(2),
            ];

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            let retorno = await ordemCompraCasoUsoTest.listaOrdemCompras();

            expect(retorno).not.toHaveLength(0);
            expect(retorno).toEqual([
                OrdemCompraBuilder.CriaCompraTeste(1),
                OrdemCompraBuilder.CriaCompraTeste(2),
            ]);
        },
    );

    it.concurrent(
        'Caso não retorna registros do repositorio então retorna vazio',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemCompraRepositorioStub.listaOrdemCompras = async () => [];

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            expect(
                await ordemCompraCasoUsoTest.listaOrdemCompras(),
            ).toHaveLength(0);
        },
    );

    it.concurrent(
        'Caso o repositório lance uma exceção então deixa lançar',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemCompraRepositorioStub.listaOrdemCompras = async function () {
                throw new Error('Error repositorio esperado');
            };

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(
                ordemCompraCasoUsoTest.listaOrdemCompras(),
            ).rejects.toThrow();
        },
    );
});

describe('Quando buscaOrdemCompra', () => {
    it.concurrent('Caso registro exista então retorna o registro', async () => {
        const [OrdemCompraRepositorioStub, ItemRepositorioStub] = setupStubs();

        const receitaTeste = OrdemCompraBuilder.CriaCompraTeste(1);

        OrdemCompraRepositorioStub.buscaOrdemCompra = async (_: number) =>
            receitaTeste;

        let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
            OrdemCompraRepositorioStub,
            ItemRepositorioStub,
        );

        let retorno = await ordemCompraCasoUsoTest.buscaOrdemCompra(1);

        let retornoEsperado = OrdemCompraBuilder.CriaCompraTeste(1);

        expect(retorno).not.toBeNull();
        expect(retorno).toEqual(retornoEsperado);
        expect(retorno).not.toBe(receitaTeste);
    });

    it.concurrent('Caso registro não exista então retorna null', async () => {
        const [OrdemCompraRepositorioStub, ItemRepositorioStub] = setupStubs();

        OrdemCompraRepositorioStub.buscaOrdemCompra = async (_: number) => null;

        let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
            OrdemCompraRepositorioStub,
            ItemRepositorioStub,
        );

        let retorno = await ordemCompraCasoUsoTest.buscaOrdemCompra(2);

        expect(retorno).toBeNull();
    });

    it.concurrent('Caso passado ids invalidos retorna null', async () => {
        const [OrdemCompraRepositorioStub, ItemRepositorioStub] = setupStubs();

        OrdemCompraRepositorioStub.buscaOrdemCompra = jest.fn(
            async (_: number) => null,
        );

        let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
            OrdemCompraRepositorioStub,
            ItemRepositorioStub,
        );

        // teste ids 0
        let retorno = await ordemCompraCasoUsoTest.buscaOrdemCompra(0);
        expect(retorno).toBeNull();
        expect(OrdemCompraRepositorioStub.buscaOrdemCompra).toBeCalledTimes(0);

        // teste ids negativos
        retorno = await ordemCompraCasoUsoTest.buscaOrdemCompra(-1);

        expect(retorno).toBeNull();
        expect(OrdemCompraRepositorioStub.buscaOrdemCompra).toBeCalledTimes(0);
    });

    it.concurrent(
        'Caso o repositório lance uma exceção então deixa lançar',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemCompraRepositorioStub.buscaOrdemCompra = async (_: number) => {
                throw new Error();
            };

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(() =>
                ordemCompraCasoUsoTest.buscaOrdemCompra(1),
            ).rejects.toThrow();
        },
    );
});

describe('Quando gravaOrdemCompra', () => {
    it.concurrent(
        'Caso infomações validas deve gravar a compra e incrementar a quantidade em estoque do item comprado',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemCompraRepositorioStub.gravaOrdemCompra = jest.fn(
                async (_: OrdemCompra) => {
                    return 1;
                },
            );

            ItemRepositorioStub.buscaMateriaPrima = jest.fn(
                async (_: number): Promise<ItemEstoque | null> => {
                    return ItemEstoqueBuilder.CriaItemTeste(
                        1,
                        new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                    );
                },
            );

            ItemRepositorioStub.buscaProduto = jest.fn(
                async (_: number): Promise<ItemEstoque | null> => {
                    return ItemEstoqueBuilder.CriaItemTeste(
                        2,
                        new ItemBuilder().setTipo(eItemTipo.Produto),
                    );
                },
            );

            ItemRepositorioStub.gravaMateriaPrima = jest.fn(
                async (_: ItemEstoque) => 1,
            );
            ItemRepositorioStub.gravaProduto = jest.fn(
                async (_: ItemEstoque) => 2,
            );

            const itensCompradosTest = [
                ItemOrdemBuilder.CriaItemTeste(
                    1,
                    new ItemOrdemBuilder().setQtd(2),
                    new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                ),
                ItemOrdemBuilder.CriaItemTeste(
                    2,
                    new ItemOrdemBuilder().setQtd(3),
                    new ItemBuilder().setTipo(eItemTipo.Produto),
                ),
            ];

            const ordemCompraGravar = new OrdemCompraBuilder()
                .setId(0)
                .setItensComprados(itensCompradosTest)
                .build();

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            const retorno = await ordemCompraCasoUsoTest.gravaOrdemCompra(
                ordemCompraGravar,
            );

            expect(retorno).toEqual(1);
            expect(OrdemCompraRepositorioStub.gravaOrdemCompra).toBeCalled();

            expect(ItemRepositorioStub.buscaMateriaPrima).toBeCalled();
            expect(ItemRepositorioStub.buscaProduto).toBeCalled();

            expect(ItemRepositorioStub.gravaMateriaPrima).toBeCalled();
            expect(
                (<jest.Mock>ItemRepositorioStub.gravaMateriaPrima).mock
                    .calls[0][0]?.qtd,
            ).toEqual(3);

            expect(ItemRepositorioStub.gravaProduto).toBeCalled();
            expect(
                (<jest.Mock>ItemRepositorioStub.gravaProduto).mock.calls[0][0]
                    ?.qtd,
            ).toEqual(4);
        },
    );

    it.concurrent(
        'Caso alterando a compra deve atualizar a compra alterar a quantidade em estoque proporcionamente a alteração',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            const itensCompradosGravadaTest = [
                ItemOrdemBuilder.CriaItemTeste(
                    1,
                    new ItemOrdemBuilder().setQtd(2),
                    new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                ),
                ItemOrdemBuilder.CriaItemTeste(
                    2,
                    new ItemOrdemBuilder().setQtd(4),
                    new ItemBuilder().setTipo(eItemTipo.Produto),
                ),
                ItemOrdemBuilder.CriaItemTeste(
                    3,
                    new ItemOrdemBuilder().setQtd(3),
                    new ItemBuilder().setTipo(eItemTipo.Produto),
                ),
            ];

            const ordemGravada = new OrdemCompraBuilder()
                .setId(1)
                .setItensComprados(itensCompradosGravadaTest)
                .build();

            OrdemCompraRepositorioStub.buscaOrdemCompra = jest.fn(
                async (_: number) => {
                    return ordemGravada;
                },
            );

            OrdemCompraRepositorioStub.gravaOrdemCompra = jest.fn(
                async (_: OrdemCompra) => {
                    return 1;
                },
            );

            ItemRepositorioStub.buscaMateriaPrima = jest.fn(
                async (_: number): Promise<ItemEstoque | null> => {
                    return ItemEstoqueBuilder.CriaItemTeste(
                        1,
                        new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                        null,
                        1,
                    );
                },
            );

            ItemRepositorioStub.buscaProduto = jest.fn(
                async (id: number): Promise<ItemEstoque | null> => {
                    return ItemEstoqueBuilder.CriaItemTeste(
                        id,
                        new ItemBuilder().setTipo(eItemTipo.Produto),
                        null,
                        3,
                    );
                },
            );

            ItemRepositorioStub.gravaMateriaPrima = jest.fn(
                async (_: ItemEstoque) => 1,
            );
            ItemRepositorioStub.gravaProduto = jest.fn(
                async (_: ItemEstoque) => 2,
            );

            const itensCompradosTest = [
                ItemOrdemBuilder.CriaItemTeste(
                    1,
                    new ItemOrdemBuilder().setQtd(4),
                    new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                ),
                ItemOrdemBuilder.CriaItemTeste(
                    2,
                    new ItemOrdemBuilder().setQtd(3),
                    new ItemBuilder().setTipo(eItemTipo.Produto),
                ),
            ];

            const ordemCompraGravar = new OrdemCompraBuilder()
                .setId(1)
                .setItensComprados(itensCompradosTest)
                .build();

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            const retorno = await ordemCompraCasoUsoTest.gravaOrdemCompra(
                ordemCompraGravar,
            );

            expect(retorno).toEqual(1);
            expect(OrdemCompraRepositorioStub.buscaOrdemCompra).toBeCalled();
            expect(OrdemCompraRepositorioStub.gravaOrdemCompra).toBeCalled();

            expect(ItemRepositorioStub.buscaMateriaPrima).toBeCalled();
            expect(ItemRepositorioStub.buscaProduto).toBeCalled();

            expect(ItemRepositorioStub.gravaMateriaPrima).toBeCalled();

            // Quando a quantidade alterada for maior que a quantidade gravada deve
            // incrementar a quantidade da diferença do estoque
            expect(
                (<jest.Mock>ItemRepositorioStub.gravaMateriaPrima).mock
                    .calls[0][0]?.qtd,
            ).toEqual(3);

            expect(ItemRepositorioStub.gravaProduto).toBeCalledTimes(2);

            // Quando a quantidade alterada for menor que a quantidade gravada deve
            // subitrair a quantidade da diferença do estoque
            let quantidadeGravada = (<jest.Mock>(
                ItemRepositorioStub.gravaProduto
            )).mock.calls.find((params: any) => params[0].item.id === 2)[0]
                ?.qtd;
            expect(quantidadeGravada).toEqual(2);

            // Quando o item for removido da lista subitrai a quantidade gravada alteriormente,
            // e a quantidade em estoque for menor que a quantidade que será removida grava como 0 em estoque
            quantidadeGravada = (<jest.Mock>(
                ItemRepositorioStub.gravaProduto
            )).mock.calls.find((params: any) => params[0].item.id === 3)[0]
                ?.qtd;
            expect(quantidadeGravada).toEqual(0);
        },
    );

    it.concurrent(
        'Caso passado valores invalidos então lança exceção',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemCompraRepositorioStub.buscaOrdemCompra = jest.fn(
                async (_: number) => null,
            );

            OrdemCompraRepositorioStub.gravaOrdemCompra = jest.fn(
                async (_: OrdemCompra) => 1,
            );

            ItemRepositorioStub.buscaMateriaPrima = jest.fn(
                async (_: number): Promise<ItemEstoque | null> => null,
            );

            ItemRepositorioStub.buscaProduto = jest.fn(
                async (_: number): Promise<ItemEstoque | null> => null,
            );

            ItemRepositorioStub.gravaMateriaPrima = jest.fn(
                async (_: ItemEstoque) => 1,
            );
            ItemRepositorioStub.gravaProduto = jest.fn(
                async (_: ItemEstoque) => 2,
            );

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            async function assertLancaExcessaoValorInvalido(
                compraGrava: OrdemCompra,
            ) {
                await expect(() =>
                    ordemCompraCasoUsoTest.gravaOrdemCompra(compraGrava),
                ).rejects.toThrow();

                expect(
                    OrdemCompraRepositorioStub.gravaOrdemCompra,
                ).not.toBeCalled();
                expect(
                    OrdemCompraRepositorioStub.buscaOrdemCompra,
                ).not.toBeCalled();
                expect(ItemRepositorioStub.buscaMateriaPrima).not.toBeCalled();
                expect(ItemRepositorioStub.buscaProduto).not.toBeCalled();
                expect(ItemRepositorioStub.gravaMateriaPrima).not.toBeCalled();
                expect(ItemRepositorioStub.gravaProduto).not.toBeCalled();
            }

            const ordemCompraBuilder = new OrdemCompraBuilder()
                .setId(1)
                .setItensComprados([
                    ItemOrdemBuilder.CriaItemTeste(
                        1,
                        new ItemOrdemBuilder().setQtd(4),
                        new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                    ),
                    ItemOrdemBuilder.CriaItemTeste(
                        2,
                        new ItemOrdemBuilder().setQtd(3),
                        new ItemBuilder().setTipo(eItemTipo.Produto),
                    ),
                ]);

            // Lista itens vazia
            let ordemCompraGrava = ordemCompraBuilder.build();

            ordemCompraGrava.itensComprados = [];
            await assertLancaExcessaoValorInvalido(ordemCompraGrava);

            // Lista itens qtds invalidas
            ordemCompraGrava = ordemCompraBuilder.build();

            ordemCompraGrava.itensComprados = ItemOrdemBuilder.CriaListaTestes(
                1,
                1,
                new ItemOrdemBuilder().setQtd(0),
            );

            await assertLancaExcessaoValorInvalido(ordemCompraGrava);

            // Lista itens ids invalidos
            ordemCompraGrava = ordemCompraBuilder.build();

            ordemCompraGrava.itensComprados = ItemOrdemBuilder.CriaListaTestes(
                0,
                1,
            );

            await assertLancaExcessaoValorInvalido(ordemCompraGrava);

            // Lista itens valores invalidos
            ordemCompraGrava = ordemCompraBuilder.build();

            ordemCompraGrava.itensComprados = ItemOrdemBuilder.CriaListaTestes(
                1,
                1,
                new ItemOrdemBuilder().setValorTotal(0),
            );

            await assertLancaExcessaoValorInvalido(ordemCompraGrava);
        },
    );

    it.concurrent(
        'Caso os repositórios lance uma exceção então deixa lançar',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            // Quando repositorio ordem compra lança exceção
            OrdemCompraRepositorioStub.gravaOrdemCompra = async (
                _: OrdemCompra,
            ) => {
                throw new Error();
            };

            ItemRepositorioStub.buscaMateriaPrima = async (
                _: number,
            ): Promise<ItemEstoque | null> => {
                return ItemEstoqueBuilder.CriaItemTeste(
                    1,
                    new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                );
            };

            ItemRepositorioStub.buscaProduto = async (
                _: number,
            ): Promise<ItemEstoque | null> => {
                return ItemEstoqueBuilder.CriaItemTeste(
                    2,
                    new ItemBuilder().setTipo(eItemTipo.Produto),
                );
            };

            ItemRepositorioStub.gravaMateriaPrima = async (_: ItemEstoque) => 1;
            ItemRepositorioStub.gravaProduto = async (_: ItemEstoque) => 2;

            const ordemCompraTeste = new OrdemCompraBuilder()
                .setId(1)
                .setItensComprados([
                    ItemOrdemBuilder.CriaItemTeste(
                        1,
                        new ItemOrdemBuilder().setQtd(4),
                        new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                    ),
                    ItemOrdemBuilder.CriaItemTeste(
                        2,
                        new ItemOrdemBuilder().setQtd(3),
                        new ItemBuilder().setTipo(eItemTipo.Produto),
                    ),
                ])
                .build();

            const ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(() =>
                ordemCompraCasoUsoTest.gravaOrdemCompra(ordemCompraTeste),
            ).rejects.toThrow();

            // Quando repositorio item lança exceção
            OrdemCompraRepositorioStub.gravaOrdemCompra = async (
                _: OrdemCompra,
            ) => 1;

            ItemRepositorioStub.gravaMateriaPrima = async (_: ItemEstoque) => {
                throw new Error();
            };
            ItemRepositorioStub.gravaProduto = async (_: ItemEstoque) => 2;

            await expect(() =>
                ordemCompraCasoUsoTest.gravaOrdemCompra(ordemCompraTeste),
            ).rejects.toThrow();

            OrdemCompraRepositorioStub.gravaOrdemCompra = async (
                _: OrdemCompra,
            ) => 1;

            ItemRepositorioStub.gravaMateriaPrima = async (_: ItemEstoque) => 1;

            ItemRepositorioStub.gravaProduto = async (_: ItemEstoque) => {
                throw new Error();
            };

            await expect(() =>
                ordemCompraCasoUsoTest.gravaOrdemCompra(ordemCompraTeste),
            ).rejects.toThrow();
        },
    );
});

describe('Quando deletaOrdemCompra', () => {
    it.concurrent(
        'Caso passado valores validos então deleta registro',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemCompraRepositorioStub.deletaOrdemCompra = jest.fn(
                async function (_: number) {},
            );

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            await ordemCompraCasoUsoTest.deletaOrdemCompra(1);

            expect(OrdemCompraRepositorioStub.deletaOrdemCompra).toBeCalled();
        },
    );

    it.concurrent(
        'Caso passe valores invalidos deve retornar sem chamar o repositorio',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemCompraRepositorioStub.deletaOrdemCompra = jest.fn(
                async function (_: number) {},
            );

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            // Id seja 0
            ordemCompraCasoUsoTest.deletaOrdemCompra(0);
            expect(
                OrdemCompraRepositorioStub.deletaOrdemCompra,
            ).not.toBeCalled();

            // Id seja negativo
            ordemCompraCasoUsoTest.deletaOrdemCompra(-1);
            expect(
                OrdemCompraRepositorioStub.deletaOrdemCompra,
            ).not.toBeCalled();
        },
    );

    it.concurrent(
        'Caso o repositório lance uma exceção então deixa lançar',
        async () => {
            const [OrdemCompraRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemCompraRepositorioStub.deletaOrdemCompra = jest.fn(
                async function (_: number) {
                    throw new Error();
                },
            );

            let ordemCompraCasoUsoTest = new OrdemCompraCasoUso(
                OrdemCompraRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(() =>
                ordemCompraCasoUsoTest.deletaOrdemCompra(1),
            ).rejects.toThrow();
        },
    );
});

export class ItemOrdemBuilder {
    private _item: Item = ItemBuilder.CriaItemTeste(1);
    private _medida: Medida = getMedida(eMedida.unidade);
    private _qtd: number = 0;
    private _valorTotal: number = 0;

    setItem(item: Item): ItemOrdemBuilder {
        this._item = item;
        return this;
    }

    setMedida(medida: Medida): ItemOrdemBuilder {
        this._medida = medida;
        return this;
    }

    setQtd(qtd: number): ItemOrdemBuilder {
        this._qtd = qtd;
        return this;
    }

    setValorTotal(valorTotal: number): ItemOrdemBuilder {
        this._valorTotal = valorTotal;
        return this;
    }

    build(): ItemOrdem {
        return {
            item: this._item,
            medida: this._medida,
            qtd: this._qtd,
            valorTotal: this._valorTotal,
        };
    }

    static CriaListaTestes(
        inicioId: number = 1,
        quantity: number = 1,
        itemOrdemBuilder: ItemOrdemBuilder | null = null,
        itemBuilder: ItemBuilder | null = null,
    ): ItemOrdem[] {
        const itemOrdemBuilderSelecionado =
            itemOrdemBuilder ?? new ItemOrdemBuilder().setQtd(8.6);

        const itemBuilderSelecionado = itemBuilder ?? new ItemBuilder();

        const itensGerados = ItemBuilder.CriaListaTeste(
            inicioId,
            quantity,
            itemBuilderSelecionado,
        );

        return itensGerados.map(ig => {
            return itemOrdemBuilderSelecionado
                .setItem(ig)
                .setValorTotal(55)
                .build();
        });
    }

    static CriaItemTeste(
        id: number = 1,
        itemOrdemBuilder: ItemOrdemBuilder | null = null,
        itemBuilder: ItemBuilder | null = null,
    ): ItemOrdem {
        return ItemOrdemBuilder.CriaListaTestes(
            id,
            1,
            itemOrdemBuilder,
            itemBuilder,
        )[0];
    }
}

export class OrdemCompraBuilder {
    private _id: number = 0;
    private _itensComprados: ItemOrdem[] = [ItemOrdemBuilder.CriaItemTeste(1)];
    private _inclusao: Date = new Date('2023-10-07 19:05:00');

    setId(id: number): OrdemCompraBuilder {
        this._id = id;
        return this;
    }

    setItensComprados(itensComprados: ItemOrdem[]): OrdemCompraBuilder {
        this._itensComprados = itensComprados;
        return this;
    }

    setInclusao(inclusao: Date): OrdemCompraBuilder {
        this._inclusao = inclusao;
        return this;
    }

    build(): OrdemCompra {
        return new OrdemCompra(this._id, this._itensComprados, this._inclusao);
    }

    static CriaCompraTeste(
        id: number = 1,
        ordemCompraBuilder: OrdemCompraBuilder | null = null,
        itemOrdemBuilder: ItemOrdemBuilder | null = null,
        qtdItensComprados: number = 1,
    ): OrdemCompra {
        const ordemCompraBuilderSelecionado =
            ordemCompraBuilder ?? new OrdemCompraBuilder();

        const itemOrdemBuilderSelecionado =
            itemOrdemBuilder ?? new ItemOrdemBuilder();

        return ordemCompraBuilderSelecionado
            .setId(id)
            .setItensComprados(
                ItemOrdemBuilder.CriaListaTestes(
                    1,
                    qtdItensComprados,
                    itemOrdemBuilderSelecionado,
                ),
            )
            .build();
    }
}
