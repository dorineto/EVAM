import {OrdemVendaCasoUso} from '../../src/CasosUsos/OrdemVendaCasoUso';
import {Cliente} from '../../src/Entidades/Cliente';
import {ItemEstoque, ItemOrdem, eItemTipo} from '../../src/Entidades/Item';
import {Local} from '../../src/Entidades/Local';
import {OrdemVenda} from '../../src/Entidades/OrdemVenda';
import {ItemRepositorio} from '../../src/Repositorios/ItemRepositorio';
import {OrdemVendaRepositorio} from '../../src/Repositorios/OrdemVendaRepostorio';
import {
    ItemBuilder,
    ItemEstoqueBuilder,
    setupStubsItemRepositorio,
} from './ItemCasoUso.test';
import {ItemOrdemBuilder} from './OrdemCompraCasoUso.test';

export function setupStubsOrdemVendaRepositorio(): [OrdemVendaRepositorio] {
    return [
        {
            listaOrdemVendas: jest.fn(async () => []),
            listaClientes: jest.fn(async () => []),
            listaLocais: jest.fn(async () => []),
            buscaOrdemVenda: jest.fn(async (_: number) => null),
            gravaOrdemVenda: jest.fn(async (_: OrdemVenda) => 0),
            gravaCliente: jest.fn(async (_: Cliente) => 0),
            gravaLocal: jest.fn(async (_: Local) => 0),
            deletaOrdemVenda: jest.fn(async (_: number) => {}),
        },
    ];
}

function setupStubs(): [OrdemVendaRepositorio, ItemRepositorio] {
    return [
        ...setupStubsOrdemVendaRepositorio(),
        ...setupStubsItemRepositorio(),
    ];
}

describe('Quando listaOrdemVendas', () => {
    it.concurrent(
        'Caso retorne registros do repositorio então retorna os registros',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.listaOrdemVendas = async () => [
                OrdemVendaBuilder.CriaVendaTeste(1),
                OrdemVendaBuilder.CriaVendaTeste(2),
            ];

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            let retorno = await ordemVendaCasoUsoTest.listaOrdemVendas();

            expect(retorno).not.toHaveLength(0);
            expect(retorno).toEqual([
                OrdemVendaBuilder.CriaVendaTeste(1),
                OrdemVendaBuilder.CriaVendaTeste(2),
            ]);
        },
    );

    it.concurrent(
        'Caso não retorna registros do repositorio então retorna vazio',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.listaOrdemVendas = async () => [];

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            expect(await ordemVendaCasoUsoTest.listaOrdemVendas()).toHaveLength(
                0,
            );
        },
    );

    it.concurrent(
        'Caso o repositório lance uma exceção então deixa lançar',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.listaOrdemVendas = async function () {
                throw new Error('Error repositorio esperado');
            };

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(
                ordemVendaCasoUsoTest.listaOrdemVendas(),
            ).rejects.toThrow();
        },
    );
});

describe('Quando listaClientes', () => {
    it.concurrent(
        'Caso retorne registros do repositorio então retorna os registros',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.listaClientes = async () => [
                ClienteBuilder.CriaClienteTeste(1),
                ClienteBuilder.CriaClienteTeste(2),
            ];

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            let retorno = await ordemVendaCasoUsoTest.listaClientes();

            expect(retorno).not.toHaveLength(0);
            expect(retorno).toEqual([
                ClienteBuilder.CriaClienteTeste(1),
                ClienteBuilder.CriaClienteTeste(2),
            ]);
        },
    );

    it.concurrent(
        'Caso não retorna registros do repositorio então retorna vazio',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.listaClientes = async () => [];

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            expect(await ordemVendaCasoUsoTest.listaClientes()).toHaveLength(0);
        },
    );

    it.concurrent(
        'Caso o repositório lance uma exceção então deixa lançar',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.listaClientes = async function () {
                throw new Error('Error repositorio esperado');
            };

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(
                ordemVendaCasoUsoTest.listaClientes(),
            ).rejects.toThrow();
        },
    );
});

describe('Quando listaLocais', () => {
    it.concurrent(
        'Caso retorne registros do repositorio então retorna os registros',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.listaLocais = async () => [
                LocalBuilder.CriaLocalTeste(1),
                LocalBuilder.CriaLocalTeste(2),
            ];

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            let retorno = await ordemVendaCasoUsoTest.listaLocais();

            expect(retorno).not.toHaveLength(0);
            expect(retorno).toEqual([
                LocalBuilder.CriaLocalTeste(1),
                LocalBuilder.CriaLocalTeste(2),
            ]);
        },
    );

    it.concurrent(
        'Caso não retorna registros do repositorio então retorna vazio',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.listaLocais = async () => [];

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            expect(await ordemVendaCasoUsoTest.listaLocais()).toHaveLength(0);
        },
    );

    it.concurrent(
        'Caso o repositório lance uma exceção então deixa lançar',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.listaLocais = async function () {
                throw new Error('Error repositorio esperado');
            };

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(ordemVendaCasoUsoTest.listaLocais()).rejects.toThrow();
        },
    );
});

describe('Quando buscaOrdemVenda', () => {
    it.concurrent('Caso registro exista então retorna o registro', async () => {
        const [OrdemVendaRepositorioStub, ItemRepositorioStub] = setupStubs();

        const receitaTeste = OrdemVendaBuilder.CriaVendaTeste(1);

        OrdemVendaRepositorioStub.buscaOrdemVenda = async (_: number) =>
            receitaTeste;

        let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
            OrdemVendaRepositorioStub,
            ItemRepositorioStub,
        );

        let retorno = await ordemVendaCasoUsoTest.buscaOrdemVenda(1);

        let retornoEsperado = OrdemVendaBuilder.CriaVendaTeste(1);

        expect(retorno).not.toBeNull();
        expect(retorno).toEqual(retornoEsperado);
        expect(retorno).not.toBe(receitaTeste);
    });

    it.concurrent('Caso registro não exista então retorna null', async () => {
        const [OrdemVendaRepositorioStub, ItemRepositorioStub] = setupStubs();

        OrdemVendaRepositorioStub.buscaOrdemVenda = async (_: number) => null;

        let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
            OrdemVendaRepositorioStub,
            ItemRepositorioStub,
        );

        let retorno = await ordemVendaCasoUsoTest.buscaOrdemVenda(2);

        expect(retorno).toBeNull();
    });

    it.concurrent('Caso passado ids invalidos retorna null', async () => {
        const [OrdemVendaRepositorioStub, ItemRepositorioStub] = setupStubs();

        OrdemVendaRepositorioStub.buscaOrdemVenda = jest.fn(
            async (_: number) => null,
        );

        let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
            OrdemVendaRepositorioStub,
            ItemRepositorioStub,
        );

        // teste ids 0
        let retorno = await ordemVendaCasoUsoTest.buscaOrdemVenda(0);
        expect(retorno).toBeNull();
        expect(OrdemVendaRepositorioStub.buscaOrdemVenda).toBeCalledTimes(0);

        // teste ids negativos
        retorno = await ordemVendaCasoUsoTest.buscaOrdemVenda(-1);

        expect(retorno).toBeNull();
        expect(OrdemVendaRepositorioStub.buscaOrdemVenda).toBeCalledTimes(0);
    });

    it.concurrent(
        'Caso o repositório lance uma exceção então deixa lançar',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.buscaOrdemVenda = async (_: number) => {
                throw new Error();
            };

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(() =>
                ordemVendaCasoUsoTest.buscaOrdemVenda(1),
            ).rejects.toThrow();
        },
    );
});

describe('Quando gravaOrdemVenda', () => {
    it.concurrent(
        'Caso infomações validas deve gravar a venda e descontar a quantidade em estoque do item vendido',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.gravaOrdemVenda = jest.fn(
                async (_: OrdemVenda) => {
                    return 1;
                },
            );

            OrdemVendaRepositorioStub.gravaCliente = jest.fn(
                async (_: Cliente) => {
                    return 1;
                },
            );

            OrdemVendaRepositorioStub.gravaLocal = jest.fn(async (_: Local) => {
                return 1;
            });

            ItemRepositorioStub.buscaMateriaPrima = jest.fn(
                async (_: number): Promise<ItemEstoque | null> => {
                    return ItemEstoqueBuilder.CriaItemTeste(
                        1,
                        new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                        null,
                        5,
                    );
                },
            );

            ItemRepositorioStub.buscaProduto = jest.fn(
                async (_: number): Promise<ItemEstoque | null> => {
                    return ItemEstoqueBuilder.CriaItemTeste(
                        2,
                        new ItemBuilder().setTipo(eItemTipo.Produto),
                        null,
                        7,
                    );
                },
            );

            ItemRepositorioStub.gravaMateriaPrima = jest.fn(
                async (_: ItemEstoque) => 1,
            );
            ItemRepositorioStub.gravaProduto = jest.fn(
                async (_: ItemEstoque) => 2,
            );

            const itensVendidosTest = [
                ItemOrdemBuilder.CriaItemTeste(
                    1,
                    new ItemOrdemBuilder().setQtd(1),
                    new ItemBuilder().setTipo(eItemTipo.MateriaPrima),
                ),
                ItemOrdemBuilder.CriaItemTeste(
                    2,
                    new ItemOrdemBuilder().setQtd(4),
                    new ItemBuilder().setTipo(eItemTipo.Produto),
                ),
            ];

            const ordemVendaGravar = new OrdemVendaBuilder()
                .setId(0)
                .setItensVendidos(itensVendidosTest)
                .build();

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            const retorno = await ordemVendaCasoUsoTest.gravaOrdemVenda(
                ordemVendaGravar,
            );

            expect(retorno).toEqual({vendaId: 1, clienteId: 1, localId: 1});
            expect(OrdemVendaRepositorioStub.gravaOrdemVenda).toBeCalled();
            expect(OrdemVendaRepositorioStub.gravaCliente).not.toBeCalled();
            expect(OrdemVendaRepositorioStub.gravaLocal).not.toBeCalled();

            expect(ItemRepositorioStub.buscaMateriaPrima).toBeCalled();
            expect(ItemRepositorioStub.buscaProduto).toBeCalled();

            expect(ItemRepositorioStub.gravaMateriaPrima).toBeCalled();
            expect(
                (<jest.Mock>ItemRepositorioStub.gravaMateriaPrima).mock
                    .calls[0][0]?.qtd,
            ).toEqual(4);

            expect(ItemRepositorioStub.gravaProduto).toBeCalled();
            expect(
                (<jest.Mock>ItemRepositorioStub.gravaProduto).mock.calls[0][0]
                    ?.qtd,
            ).toEqual(3);
        },
    );

    it.concurrent(
        'Caso alterando a venda deve atualizar a venda alterar a quantidade em estoque proporcionamente a alteração',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            const itensVendidosGravadaTest = [
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

            const ordemGravada = new OrdemVendaBuilder()
                .setId(1)
                .setItensVendidos(itensVendidosGravadaTest)
                .build();

            OrdemVendaRepositorioStub.buscaOrdemVenda = jest.fn(
                async (_: number) => {
                    return ordemGravada;
                },
            );

            OrdemVendaRepositorioStub.gravaOrdemVenda = jest.fn(
                async (_: OrdemVenda) => {
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

            const ordemVendaGravar = new OrdemVendaBuilder()
                .setId(1)
                .setItensVendidos(itensCompradosTest)
                .build();

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            const retorno = await ordemVendaCasoUsoTest.gravaOrdemVenda(
                ordemVendaGravar,
            );

            expect(retorno).toEqual({vendaId: 1, clienteId: 1, localId: 1});
            expect(OrdemVendaRepositorioStub.buscaOrdemVenda).toBeCalled();
            expect(OrdemVendaRepositorioStub.gravaOrdemVenda).toBeCalled();
            expect(OrdemVendaRepositorioStub.gravaCliente).not.toBeCalled();
            expect(OrdemVendaRepositorioStub.gravaLocal).not.toBeCalled();

            expect(ItemRepositorioStub.buscaMateriaPrima).toBeCalled();
            expect(ItemRepositorioStub.buscaProduto).toBeCalled();

            expect(ItemRepositorioStub.gravaMateriaPrima).toBeCalled();

            // Quando a quantidade alterada for maior que a quantidade gravada e tiver menos em estoque deve
            // subtrair a quantidade da diferença do estoque e zerar a quantidade
            expect(
                (<jest.Mock>ItemRepositorioStub.gravaMateriaPrima).mock
                    .calls[0][0]?.qtd,
            ).toEqual(0);

            expect(ItemRepositorioStub.gravaProduto).toBeCalledTimes(2);

            // Quando a quantidade alterada for menor que a quantidade gravada deve
            // incrementar a quantidade da diferença do estoque
            let quantidadeGravada = (<jest.Mock>(
                ItemRepositorioStub.gravaProduto
            )).mock.calls.find((params: any) => params[0].item.id === 2)[0]
                ?.qtd;
            expect(quantidadeGravada).toEqual(4);

            // Quando o item for removido da lista incrementa a quantidade gravada alteriormente no estoque
            quantidadeGravada = (<jest.Mock>(
                ItemRepositorioStub.gravaProduto
            )).mock.calls.find((params: any) => params[0].item.id === 3)[0]
                ?.qtd;
            expect(quantidadeGravada).toEqual(6);
        },
    );

    it.concurrent(
        'Caso infomações validas e cliente e local são novos deve gravar a o local e cliente, e grava a venda',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.gravaOrdemVenda = jest.fn(
                async (_: OrdemVenda) => {
                    return 1;
                },
            );

            OrdemVendaRepositorioStub.gravaCliente = jest.fn(
                async (_: Cliente) => {
                    return 1;
                },
            );

            OrdemVendaRepositorioStub.gravaLocal = jest.fn(async (_: Local) => {
                return 1;
            });

            ItemRepositorioStub.buscaProduto = jest.fn(
                async (_: number): Promise<ItemEstoque | null> => {
                    return ItemEstoqueBuilder.CriaItemTeste(
                        2,
                        new ItemBuilder().setTipo(eItemTipo.Produto),
                        null,
                        1,
                    );
                },
            );

            ItemRepositorioStub.gravaProduto = jest.fn(
                async (_: ItemEstoque) => 2,
            );

            const itensVendidosTest = [
                ItemOrdemBuilder.CriaItemTeste(
                    2,
                    new ItemOrdemBuilder().setQtd(1),
                    new ItemBuilder().setTipo(eItemTipo.Produto),
                ),
            ];

            const ordemVendaGravar = new OrdemVendaBuilder()
                .setId(0)
                .setItensVendidos(itensVendidosTest)
                .setCliente(ClienteBuilder.CriaClienteTeste(0))
                .setLocal(LocalBuilder.CriaLocalTeste(0))
                .build();

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            const retorno = await ordemVendaCasoUsoTest.gravaOrdemVenda(
                ordemVendaGravar,
            );

            expect(retorno).toEqual({vendaId: 1, clienteId: 1, localId: 1});
            expect(OrdemVendaRepositorioStub.gravaOrdemVenda).toBeCalled();
            expect(OrdemVendaRepositorioStub.gravaCliente).toBeCalled();
            expect(OrdemVendaRepositorioStub.gravaLocal).toBeCalled();

            expect(ItemRepositorioStub.buscaProduto).toBeCalled();

            expect(ItemRepositorioStub.gravaProduto).toBeCalled();
            expect(
                (<jest.Mock>ItemRepositorioStub.gravaProduto).mock.calls[0][0]
                    ?.qtd,
            ).toEqual(0);
        },
    );

    it.concurrent(
        'Caso passado valores invalidos então lança exceção',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.buscaOrdemVenda = jest.fn(
                async (_: number) => null,
            );

            OrdemVendaRepositorioStub.gravaOrdemVenda = jest.fn(
                async (_: OrdemVenda) => 1,
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

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            async function assertLancaExcessaoValorInvalido(
                compraGrava: OrdemVenda,
            ) {
                await expect(() =>
                    ordemVendaCasoUsoTest.gravaOrdemVenda(compraGrava),
                ).rejects.toThrow();

                expect(
                    OrdemVendaRepositorioStub.gravaOrdemVenda,
                ).not.toBeCalled();
                expect(OrdemVendaRepositorioStub.gravaCliente).not.toBeCalled();
                expect(OrdemVendaRepositorioStub.gravaLocal).not.toBeCalled();
                expect(
                    OrdemVendaRepositorioStub.buscaOrdemVenda,
                ).not.toBeCalled();
                expect(ItemRepositorioStub.buscaMateriaPrima).not.toBeCalled();
                expect(ItemRepositorioStub.buscaProduto).not.toBeCalled();
                expect(ItemRepositorioStub.gravaMateriaPrima).not.toBeCalled();
                expect(ItemRepositorioStub.gravaProduto).not.toBeCalled();
            }

            const ordemCompraBuilder = new OrdemVendaBuilder()
                .setId(1)
                .setItensVendidos([
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

            ordemCompraGrava.itensVendidos = [];
            await assertLancaExcessaoValorInvalido(ordemCompraGrava);

            // Lista itens qtds invalidas
            ordemCompraGrava = ordemCompraBuilder.build();

            ordemCompraGrava.itensVendidos = ItemOrdemBuilder.CriaListaTestes(
                1,
                1,
                new ItemOrdemBuilder().setQtd(0),
            );

            await assertLancaExcessaoValorInvalido(ordemCompraGrava);

            // Lista itens ids invalidos
            ordemCompraGrava = ordemCompraBuilder.build();

            ordemCompraGrava.itensVendidos = ItemOrdemBuilder.CriaListaTestes(
                0,
                1,
            );

            await assertLancaExcessaoValorInvalido(ordemCompraGrava);

            // Lista itens valores invalidos
            ordemCompraGrava = ordemCompraBuilder.build();

            ordemCompraGrava.itensVendidos = ItemOrdemBuilder.CriaListaTestes(
                1,
                1,
                new ItemOrdemBuilder().setValorTotal(0),
            );

            await assertLancaExcessaoValorInvalido(ordemCompraGrava);

            // Cliente a ser cadastrado com nome vazio
            ordemCompraGrava = ordemCompraBuilder.build();

            ordemCompraGrava.cliente = new ClienteBuilder()
                .setId(0)
                .setNome('')
                .build();

            await assertLancaExcessaoValorInvalido(ordemCompraGrava);

            // Local a ser cadastrado com descrição vazia
            ordemCompraGrava = ordemCompraBuilder.build();

            ordemCompraGrava.local = new LocalBuilder()
                .setId(0)
                .setDescricao('')
                .build();

            await assertLancaExcessaoValorInvalido(ordemCompraGrava);
        },
    );

    it.concurrent(
        'Caso os repositórios lance uma exceção então deixa lançar',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            function defaultCalls() {
                OrdemVendaRepositorioStub.gravaOrdemVenda = async (
                    _: OrdemVenda,
                ) => {
                    return 1;
                };

                OrdemVendaRepositorioStub.gravaCliente = async (_: Cliente) => {
                    return 1;
                };

                OrdemVendaRepositorioStub.gravaLocal = async (_: Local) => {
                    return 1;
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

                ItemRepositorioStub.gravaMateriaPrima = async (
                    _: ItemEstoque,
                ) => 1;
                ItemRepositorioStub.gravaProduto = async (_: ItemEstoque) => 2;
            }

            // Quando repositorio ordem venda lança exceção
            defaultCalls();

            OrdemVendaRepositorioStub.gravaOrdemVenda = async (
                _: OrdemVenda,
            ) => {
                throw new Error();
            };

            const ordemCompraTeste = new OrdemVendaBuilder()
                .setId(1)
                .setItensVendidos([
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
                .setCliente(ClienteBuilder.CriaClienteTeste(0))
                .setLocal(LocalBuilder.CriaLocalTeste(0))
                .build();

            const ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(() =>
                ordemVendaCasoUsoTest.gravaOrdemVenda(ordemCompraTeste),
            ).rejects.toThrow();

            defaultCalls();

            OrdemVendaRepositorioStub.gravaCliente = async (_: Cliente) => {
                throw new Error();
            };

            await expect(() =>
                ordemVendaCasoUsoTest.gravaOrdemVenda(ordemCompraTeste),
            ).rejects.toThrow();

            defaultCalls();

            OrdemVendaRepositorioStub.gravaLocal = async (_: Local) => {
                throw new Error();
            };

            await expect(() =>
                ordemVendaCasoUsoTest.gravaOrdemVenda(ordemCompraTeste),
            ).rejects.toThrow();

            // Quando repositorio item lança exceção
            defaultCalls();

            ItemRepositorioStub.gravaMateriaPrima = async (_: ItemEstoque) => {
                throw new Error();
            };

            await expect(() =>
                ordemVendaCasoUsoTest.gravaOrdemVenda(ordemCompraTeste),
            ).rejects.toThrow();

            defaultCalls();

            ItemRepositorioStub.gravaProduto = async (_: ItemEstoque) => {
                throw new Error();
            };

            await expect(() =>
                ordemVendaCasoUsoTest.gravaOrdemVenda(ordemCompraTeste),
            ).rejects.toThrow();
        },
    );
});

describe('Quando deletaOrdemVenda', () => {
    it.concurrent(
        'Caso passado valores validos então deleta registro',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.deletaOrdemVenda = jest.fn(
                async function (_: number) {},
            );

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await ordemVendaCasoUsoTest.deletaOrdemVenda(1);

            expect(OrdemVendaRepositorioStub.deletaOrdemVenda).toBeCalled();
        },
    );

    it.concurrent(
        'Caso passe valores invalidos deve retornar sem chamar o repositorio',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.deletaOrdemVenda = jest.fn(
                async function (_: number) {},
            );

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            // Id seja 0
            ordemVendaCasoUsoTest.deletaOrdemVenda(0);
            expect(OrdemVendaRepositorioStub.deletaOrdemVenda).not.toBeCalled();

            // Id seja negativo
            ordemVendaCasoUsoTest.deletaOrdemVenda(-1);
            expect(OrdemVendaRepositorioStub.deletaOrdemVenda).not.toBeCalled();
        },
    );

    it.concurrent(
        'Caso o repositório lance uma exceção então deixa lançar',
        async () => {
            const [OrdemVendaRepositorioStub, ItemRepositorioStub] =
                setupStubs();

            OrdemVendaRepositorioStub.deletaOrdemVenda = jest.fn(
                async function (_: number) {
                    throw new Error();
                },
            );

            let ordemVendaCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(() =>
                ordemVendaCasoUsoTest.deletaOrdemVenda(1),
            ).rejects.toThrow();
        },
    );
});

export class ClienteBuilder {
    private _id: number = 0;
    private _nome: string = '';
    private _inclusao: string = new Date('2023-10-09 13:30:00').toISOString();

    setId(id: number): ClienteBuilder {
        this._id = id;
        return this;
    }
    setNome(nome: string): ClienteBuilder {
        this._nome = nome;
        return this;
    }
    setInclusao(inclusao: string): ClienteBuilder {
        this._inclusao = inclusao;
        return this;
    }

    build(): Cliente {
        return {
            id: this._id,
            nome: this._nome,
            inclusao: this._inclusao,
        };
    }

    static CriaClienteTeste(
        id: number = 1,
        clienteBuilder: ClienteBuilder | null = null,
    ): Cliente {
        const clienteBuilderSelecionado =
            clienteBuilder ?? new ClienteBuilder();

        return clienteBuilderSelecionado
            .setId(id)
            .setNome(`Cliente Teste ${id}`)
            .build();
    }
}

export class LocalBuilder {
    private _id: number = 0;
    private _descricao: string = '';
    private _inclusao: string = new Date('2023-10-09 13:39:00').toISOString();

    setId(id: number): LocalBuilder {
        this._id = id;
        return this;
    }
    setDescricao(descricao: string): LocalBuilder {
        this._descricao = descricao;
        return this;
    }
    setInclusao(inclusao: string): LocalBuilder {
        this._inclusao = inclusao;
        return this;
    }

    build(): Local {
        return {
            id: this._id,
            descricao: this._descricao,
            inclusao: this._inclusao,
        };
    }

    static CriaLocalTeste(
        id: number = 1,
        localBuilder: LocalBuilder | null = null,
    ): Local {
        const localBuilderSelecionado = localBuilder ?? new LocalBuilder();

        return localBuilderSelecionado
            .setId(id)
            .setDescricao(`Local Teste ${id}`)
            .build();
    }
}

export class OrdemVendaBuilder {
    private _id: number = 0;
    private _itensVendidos: ItemOrdem[] = ItemOrdemBuilder.CriaListaTestes(
        1,
        1,
    );
    private _cliente: Cliente = ClienteBuilder.CriaClienteTeste(1);
    private _local: Local = LocalBuilder.CriaLocalTeste(1);
    private _inclusao: Date = new Date('2023-10-09 13:27:00');

    setId(id: number): OrdemVendaBuilder {
        this._id = id;
        return this;
    }

    setItensVendidos(itensVendidos: ItemOrdem[]): OrdemVendaBuilder {
        this._itensVendidos = itensVendidos;
        return this;
    }

    setCliente(cliente: Cliente): OrdemVendaBuilder {
        this._cliente = cliente;
        return this;
    }

    setLocal(local: Local): OrdemVendaBuilder {
        this._local = local;
        return this;
    }

    setInclusao(inclusao: Date): OrdemVendaBuilder {
        this._inclusao = inclusao;
        return this;
    }

    build(): OrdemVenda {
        return new OrdemVenda(
            this._id,
            this._cliente,
            this._local,
            this._itensVendidos,
            this._inclusao,
        );
    }

    static CriaVendaTeste(
        id: number = 1,
        ordemVendaBuilder: OrdemVendaBuilder | null = null,
        itemOrdemBuilder: ItemOrdemBuilder | null = null,
        qtdItensOrdem: number = 1,
    ): OrdemVenda {
        const ordemVendaBuilderSelecionado =
            ordemVendaBuilder ?? new OrdemVendaBuilder();
        const itemOrdemBuilderSelecionado =
            itemOrdemBuilder ?? new ItemOrdemBuilder();

        return ordemVendaBuilderSelecionado
            .setId(id)
            .setItensVendidos(
                ItemOrdemBuilder.CriaListaTestes(
                    id,
                    qtdItensOrdem,
                    itemOrdemBuilderSelecionado,
                ),
            )
            .build();
    }
}
