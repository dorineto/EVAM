import {OrdemVendaCasoUso} from '../../src/CasosUsos/OrdemVendaCasoUso';
import {Cliente} from '../../src/Entidades/Cliente';
import {ItemOrdem} from '../../src/Entidades/Item';
import {Local} from '../../src/Entidades/Local';
import {OrdemVenda} from '../../src/Entidades/OrdemVenda';
import {ItemRepositorio} from '../../src/Repositorios/ItemRepositorio';
import {OrdemVendaRepositorio} from '../../src/Repositorios/OrdemVendaRepostorio';
import {setupStubsItemRepositorio} from './ItemCasoUso.test';
import {ItemOrdemBuilder} from './OrdemCompraCasoUso.test';

export function setupStubsOrdemVendaRepositorio(): [OrdemVendaRepositorio] {
    return [
        {
            listaOrdemVendas: jest.fn(async () => []),
            listaClientes: jest.fn(async () => []),
            listaLocais: jest.fn(async () => []),
            buscaOrdemVenda: jest.fn(async (_: number) => null),
            gravaOrdemVenda: jest.fn(async (_: OrdemVenda) => 0),
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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            let retorno = await ordemCompraCasoUsoTest.listaOrdemVendas();

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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            expect(
                await ordemCompraCasoUsoTest.listaOrdemVendas(),
            ).toHaveLength(0);
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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(
                ordemCompraCasoUsoTest.listaOrdemVendas(),
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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            let retorno = await ordemCompraCasoUsoTest.listaClientes();

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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            expect(await ordemCompraCasoUsoTest.listaClientes()).toHaveLength(
                0,
            );
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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(
                ordemCompraCasoUsoTest.listaClientes(),
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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            let retorno = await ordemCompraCasoUsoTest.listaLocais();

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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            expect(await ordemCompraCasoUsoTest.listaLocais()).toHaveLength(0);
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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(
                ordemCompraCasoUsoTest.listaLocais(),
            ).rejects.toThrow();
        },
    );
});

describe('Quando buscaOrdemVenda', () => {
    it.concurrent('Caso registro exista então retorna o registro', async () => {
        const [OrdemVendaRepositorioStub, ItemRepositorioStub] = setupStubs();

        const receitaTeste = OrdemVendaBuilder.CriaVendaTeste(1);

        OrdemVendaRepositorioStub.buscaOrdemVenda = async (_: number) =>
            receitaTeste;

        let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
            OrdemVendaRepositorioStub,
            ItemRepositorioStub,
        );

        let retorno = await ordemCompraCasoUsoTest.buscaOrdemVenda(1);

        let retornoEsperado = OrdemVendaBuilder.CriaVendaTeste(1);

        expect(retorno).not.toBeNull();
        expect(retorno).toEqual(retornoEsperado);
        expect(retorno).not.toBe(receitaTeste);
    });

    it.concurrent('Caso registro não exista então retorna null', async () => {
        const [OrdemVendaRepositorioStub, ItemRepositorioStub] = setupStubs();

        OrdemVendaRepositorioStub.buscaOrdemVenda = async (_: number) => null;

        let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
            OrdemVendaRepositorioStub,
            ItemRepositorioStub,
        );

        let retorno = await ordemCompraCasoUsoTest.buscaOrdemVenda(2);

        expect(retorno).toBeNull();
    });

    it.concurrent('Caso passado ids invalidos retorna null', async () => {
        const [OrdemVendaRepositorioStub, ItemRepositorioStub] = setupStubs();

        OrdemVendaRepositorioStub.buscaOrdemVenda = jest.fn(
            async (_: number) => null,
        );

        let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
            OrdemVendaRepositorioStub,
            ItemRepositorioStub,
        );

        // teste ids 0
        let retorno = await ordemCompraCasoUsoTest.buscaOrdemVenda(0);
        expect(retorno).toBeNull();
        expect(OrdemVendaRepositorioStub.buscaOrdemVenda).toBeCalledTimes(0);

        // teste ids negativos
        retorno = await ordemCompraCasoUsoTest.buscaOrdemVenda(-1);

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

            let ordemCompraCasoUsoTest = new OrdemVendaCasoUso(
                OrdemVendaRepositorioStub,
                ItemRepositorioStub,
            );

            await expect(() =>
                ordemCompraCasoUsoTest.buscaOrdemVenda(1),
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
