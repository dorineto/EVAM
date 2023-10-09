import {useCallback, useEffect, useState} from 'react';
import {
    ItemEstoque,
    ItemMensurado,
    ItemOrdem,
    ItemReceita,
    eItemTipo,
} from '../../Entidades/Item';
import {CasoUsoInit} from '../../App';
import {
    Medida,
    MedidaInfo,
    eMedida,
    getMedida,
    listMedidas,
} from '../../Entidades/Medida';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {EstoqueGerenciamentoProps} from '../Navigation/types';
import {useAppDispatch} from '../Slicers/Store';
import {
    FormularioItemEstoque,
    FormularioOrdemCompra,
    FormularioReceita,
    selectFormularioMateriaPrima,
    selectFormularioOrdemCompra,
    selectFormularioProduto,
    selectFormularioReceita,
    setFormularioMateriaPrima,
    setFormularioOrdemCompra,
    setFormularioProduto,
    setFormularioReceita,
} from '../Slicers/EstoqueSlice';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import {Receita} from '../../Entidades/Receita';
import {OrdemCompra} from '../../Entidades/OrdemCompra';
import {eModalTipo} from '../Componentes/Utils';
import {ItemQuantidade} from './Util';

export interface EstoqueRegistro {
    materiasPrimas: ItemEstoque[];
    produtos: ItemEstoque[];
    receitas: Receita[];
    compras: OrdemCompra[];
}

export function useVisualizaEstoque({
    itemCasoUso,
    receitaCasoUso,
    ordemCompraCasoUso,
}: CasoUsoInit): [EstoqueRegistro] {
    const [estoqueRegistro, setEstoqueRegistro] = useState<EstoqueRegistro>({
        materiasPrimas: [],
        produtos: [],
        receitas: [],
        compras: [],
    });

    useFocusEffect(
        useCallback(() => {
            async function buscaInfoEstoque() {
                const [materiasPrimas, produtos, receitas, compras] =
                    await Promise.all([
                        itemCasoUso.listaMateriasPrimas(),
                        itemCasoUso.listaProdutos(),
                        receitaCasoUso.listaReceitas(),
                        ordemCompraCasoUso.listaOrdemCompras(),
                    ]);

                setEstoqueRegistro({
                    materiasPrimas: materiasPrimas,
                    produtos: produtos,
                    receitas: receitas,
                    compras: compras.sort((c1, c2) => c1.id - c2.id).reverse(),
                });
            }

            buscaInfoEstoque();
        }, [itemCasoUso, ordemCompraCasoUso, receitaCasoUso]),
    );

    return [estoqueRegistro];
}

export type ItemEstoqueFormulario = {
    id: number;
    descricao: string;
    medida: Medida;
    qtd: number;
    valorMediaUnidade: number;
};

type useFormularioEstoqueRet = [
    () => void,
    () => void,
    (mensagem: string, tipo: eModalTipo) => void,
];

export function useFormularioEstoque(
    novoRegistro: boolean,
): useFormularioEstoqueRet {
    const navigation = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function cancelar() {
        navigation.navigate('EstoqueModalInfo', {
            mensagem: `Deseja cancelar a ${
                novoRegistro ? 'adição' : 'edição'
            } do novo registro?`,
            tipo: eModalTipo.Aviso,
            redirecionaConfirma: 'EstoqueVisualizacao',
            redirecionaCancela: 'volta',
        });
    }

    function confirmaGravar() {
        navigation.navigate('EstoqueModalInfo', {
            mensagem: `Deseja ${
                novoRegistro ? 'adicionar novo' : 'alterar'
            } registro?`,
            tipo: eModalTipo.Aviso,
            redirecionaConfirma: 'EstoqueGerenciamento',
            redirecionaCancela: 'EstoqueGerenciamento',
        });
    }

    function displayMensagem(mensagem: string, tipo: eModalTipo) {
        navigation.navigate('EstoqueModalInfo', {
            mensagem: mensagem,
            tipo: tipo,
            redirecionaConfirma: 'volta',
        });
    }

    return [cancelar, confirmaGravar, displayMensagem];
}

function traduzItemEstoqueFormulario(item: ItemEstoque): ItemEstoqueFormulario {
    return {
        id: item.item.id,
        descricao: item.item.descricao,
        medida: item.medida,
        qtd: item.qtd,
        valorMediaUnidade: item.valorMediaUnidade,
    };
}

export type UseFormularioItemEstoqueRet = [
    ...useFormularioEstoqueRet,
    MedidaInfo[],
    ItemEstoqueFormulario | null,
    (itemVisualizacao: ItemEstoqueFormulario) => Promise<void>,
    boolean,
];

export function useFormularioMateriaPrima(
    {itemCasoUso}: CasoUsoInit,
    id?: number,
): UseFormularioItemEstoqueRet {
    const novoRegistro = (id ?? 0) <= 0;

    const [cancelar, confirmaGravar, displayMensagem] =
        useFormularioEstoque(novoRegistro);

    const listaMedidasInfo = listMedidas();

    const dispatch = useAppDispatch();

    const {itemEstoque, itemEstoqueFormulario, isLoading} = useSelector(
        selectFormularioMateriaPrima,
    );

    useEffect(() => {
        async function buscaMateriaPrima() {
            if (novoRegistro) {
                dispatch(
                    setFormularioMateriaPrima({
                        itemEstoque: null,
                        itemEstoqueFormulario: null,
                        isLoading: false,
                    }),
                );
                return;
            }

            dispatch(
                setFormularioMateriaPrima({
                    itemEstoque: null,
                    itemEstoqueFormulario: null,
                    isLoading: true,
                }),
            );

            const itemEstoqueBuscado = await itemCasoUso.buscaMateriaPrima(
                id ?? 0,
            );

            if (!itemEstoqueBuscado) {
                dispatch(
                    setFormularioMateriaPrima({
                        itemEstoque: null,
                        itemEstoqueFormulario: null,
                        isLoading: false,
                    }),
                );
                return;
            }

            let itemDispatch: FormularioItemEstoque = {
                itemEstoque: itemEstoqueBuscado,
                itemEstoqueFormulario:
                    traduzItemEstoqueFormulario(itemEstoqueBuscado),
                isLoading: false,
            };

            dispatch(setFormularioMateriaPrima(itemDispatch));
        }

        buscaMateriaPrima();
    }, [id, itemCasoUso, novoRegistro, dispatch]);

    async function gravaItemEstoque(itemVisualizacao: ItemEstoqueFormulario) {
        if (itemVisualizacao.descricao.trim() === '') {
            throw new Error('Informe valor para a nome da matéria-prima');
        }

        if (itemVisualizacao.qtd < 0) {
            throw new Error(
                'O valor informado para a quantidade em estoque não pode ser negativa',
            );
        }

        if (itemVisualizacao.valorMediaUnidade < 0) {
            throw new Error(
                'O valor informado para a média de preço não pode ser negativa',
            );
        }

        let itemEstoqueGrava: ItemEstoque = _.cloneDeep(itemEstoque) ?? {
            item: {
                id: 0,
                descricao: '',
                inclusao: new Date().toISOString(),
                tipo: eItemTipo.MateriaPrima,
            },
            medida: getMedida(eMedida.unidade),
            qtd: 0,
            valorMediaUnidade: 0,
        };

        itemEstoqueGrava.item.descricao = itemVisualizacao.descricao;
        itemEstoqueGrava.medida = itemVisualizacao.medida;
        itemEstoqueGrava.qtd = itemVisualizacao.qtd;
        itemEstoqueGrava.valorMediaUnidade = itemVisualizacao.valorMediaUnidade;

        itemEstoqueGrava.item.id = await itemCasoUso.gravaMateriaPrima(
            itemEstoqueGrava,
        );

        let itemDispatch: FormularioItemEstoque = {
            itemEstoque: itemEstoqueGrava,
            itemEstoqueFormulario:
                traduzItemEstoqueFormulario(itemEstoqueGrava),
            isLoading: false,
        };

        dispatch(setFormularioMateriaPrima(itemDispatch));
    }

    return [
        cancelar,
        confirmaGravar,
        displayMensagem,
        listaMedidasInfo,
        itemEstoqueFormulario,
        gravaItemEstoque,
        isLoading,
    ];
}

export type useDeletaEstoque = [(id: number) => Promise<void>];

export function useDeletaMateriaPrima({
    itemCasoUso,
}: CasoUsoInit): useDeletaEstoque {
    async function deleta(id: number) {
        itemCasoUso.deletaMateriaPrima(id);
    }

    return [deleta];
}

export function useFormularioProduto(
    {itemCasoUso}: CasoUsoInit,
    id?: number,
): UseFormularioItemEstoqueRet {
    const novoRegistro = (id ?? 0) <= 0;

    const [cancelar, confirmaGravar, displayMensagem] =
        useFormularioEstoque(novoRegistro);

    const listaMedidasInfo = listMedidas();

    const dispatch = useAppDispatch();

    const {itemEstoque, itemEstoqueFormulario, isLoading} = useSelector(
        selectFormularioProduto,
    );

    useEffect(() => {
        async function buscaProduto() {
            if (novoRegistro) {
                dispatch(
                    setFormularioProduto({
                        itemEstoque: null,
                        itemEstoqueFormulario: null,
                        isLoading: false,
                    }),
                );
                return;
            }

            dispatch(
                setFormularioProduto({
                    itemEstoque: null,
                    itemEstoqueFormulario: null,
                    isLoading: true,
                }),
            );

            const itemEstoqueBuscado = await itemCasoUso.buscaProduto(id ?? 0);

            if (!itemEstoqueBuscado) {
                dispatch(
                    setFormularioProduto({
                        itemEstoque: null,
                        itemEstoqueFormulario: null,
                        isLoading: false,
                    }),
                );
                return;
            }

            let itemDispatch: FormularioItemEstoque = {
                itemEstoque: itemEstoqueBuscado,
                itemEstoqueFormulario:
                    traduzItemEstoqueFormulario(itemEstoqueBuscado),
                isLoading: false,
            };

            dispatch(setFormularioProduto(itemDispatch));
        }

        buscaProduto();
    }, [id, itemCasoUso, novoRegistro, dispatch]);

    async function gravaItemEstoque(itemVisualizacao: ItemEstoqueFormulario) {
        if (itemVisualizacao.descricao.trim() === '') {
            throw new Error('Informe valor para a nome da produto');
        }

        if (itemVisualizacao.qtd < 0) {
            throw new Error(
                'O valor informado para a quantidade em estoque não pode ser negativa',
            );
        }

        if (itemVisualizacao.valorMediaUnidade < 0) {
            throw new Error(
                'O valor informado para a média de preço não pode ser negativa',
            );
        }

        let itemEstoqueGrava: ItemEstoque = _.cloneDeep(itemEstoque) ?? {
            item: {
                id: 0,
                descricao: '',
                inclusao: new Date().toISOString(),
                tipo: eItemTipo.Produto,
            },
            medida: getMedida(eMedida.unidade),
            qtd: 0,
            valorMediaUnidade: 0,
        };

        itemEstoqueGrava.item.descricao = itemVisualizacao.descricao;
        itemEstoqueGrava.medida = itemVisualizacao.medida;
        itemEstoqueGrava.qtd = itemVisualizacao.qtd;
        itemEstoqueGrava.valorMediaUnidade = itemVisualizacao.valorMediaUnidade;

        itemEstoqueGrava.item.id = await itemCasoUso.gravaProduto(
            itemEstoqueGrava,
        );

        let itemDispatch: FormularioItemEstoque = {
            itemEstoque: itemEstoqueGrava,
            itemEstoqueFormulario:
                traduzItemEstoqueFormulario(itemEstoqueGrava),
            isLoading: false,
        };

        dispatch(setFormularioProduto(itemDispatch));
    }

    return [
        cancelar,
        confirmaGravar,
        displayMensagem,
        listaMedidasInfo,
        itemEstoqueFormulario,
        gravaItemEstoque,
        isLoading,
    ];
}

export function useDeletaProduto({itemCasoUso}: CasoUsoInit): useDeletaEstoque {
    async function deleta(id: number) {
        itemCasoUso.deletaProduto(id);
    }

    return [deleta];
}

export type ReceitaSerializada = {
    id: number;
    descricao: string;
    ingredientes: ItemReceita[];
    produz: ItemMensurado;
    inclusao: string;
};

function convertToReceitaSerializada(receita: Receita): ReceitaSerializada {
    return {
        id: receita.id,
        descricao: receita.descricao,
        ingredientes: receita.ingredientes,
        produz: receita.produz,
        inclusao: receita.inclusao.toISOString(),
    };
}

function convertToReceita(receitaSerializada: ReceitaSerializada): Receita {
    return new Receita(
        receitaSerializada.id,
        receitaSerializada.descricao,
        receitaSerializada.produz,
        receitaSerializada.ingredientes,
        new Date(receitaSerializada.inclusao),
    );
}

export type ReceitaFormulario = {
    id: number;
    descricao: string;
    ingredientes: ItemQuantidade[];
    produz: ItemQuantidade;
};

function traduzReceitaFormulario(receita: Receita): ReceitaFormulario {
    const itemProduzido = receita.produz;

    return {
        id: receita.id,
        descricao: receita.descricao,
        ingredientes: receita.ingredientes.map(i => {
            return {id: i.item.id, qtd: i.qtd};
        }),
        produz: {
            id: itemProduzido.item.id,
            qtd: itemProduzido.qtd,
        },
    };
}

export type useFormularioReceitaRet = [
    ...useFormularioEstoqueRet,
    ReceitaFormulario | null,
    ItemEstoque[],
    ItemEstoque[],
    (receitaVisualizacao: ReceitaFormulario) => Promise<void>,
    boolean,
];

export function useFormularioReceita(
    {itemCasoUso, receitaCasoUso}: CasoUsoInit,
    id?: number,
): useFormularioReceitaRet {
    const novoRegistro = (id ?? 0) <= 0;

    const [cancelar, confirmaGravar, displayMensagem] =
        useFormularioEstoque(novoRegistro);

    const dispatch = useAppDispatch();

    const {receitaSerializada, receitaFormulario, isLoading} = useSelector(
        selectFormularioReceita,
    );

    const [listaProdutos, setListaProduto] = useState<ItemEstoque[]>([]);
    const [listaMateriaPrima, setListaMateriaPrima] = useState<ItemEstoque[]>(
        [],
    );

    useEffect(() => {
        async function buscaProduto(): Promise<FormularioReceita> {
            if (novoRegistro) {
                return {
                    receitaSerializada: null,
                    receitaFormulario: null,
                    isLoading: false,
                };
            }

            const receita = await receitaCasoUso.buscaReceita(id ?? 0);

            if (!receita) {
                return {
                    receitaSerializada: null,
                    receitaFormulario: null,
                    isLoading: false,
                };
            }

            return {
                receitaSerializada: convertToReceitaSerializada(receita),
                receitaFormulario: traduzReceitaFormulario(receita),
                isLoading: false,
            };
        }

        async function buscaInfo() {
            dispatch(
                setFormularioReceita({
                    receitaSerializada: null,
                    receitaFormulario: null,
                    isLoading: true,
                }),
            );
            const [
                receitaDispatch,
                listaMateriaPrimaBuscada,
                listaProdutosBuscada,
            ] = await Promise.all([
                buscaProduto(),
                itemCasoUso.listaMateriasPrimas(),
                itemCasoUso.listaProdutos(),
            ]);

            setListaMateriaPrima(listaMateriaPrimaBuscada);
            setListaProduto(listaProdutosBuscada);
            dispatch(setFormularioReceita(receitaDispatch));
        }

        buscaInfo();
    }, [id, receitaCasoUso, novoRegistro, dispatch, itemCasoUso]);

    async function gravaReceita(receitaVisualizacao: ReceitaFormulario) {
        if (receitaVisualizacao.descricao.trim() === '') {
            throw new Error('Informe valor para a nome da receita');
        }

        if (receitaVisualizacao.produz.id <= 0) {
            throw new Error(
                'Selecione um produto que será produzido pela receita',
            );
        }

        if (receitaVisualizacao.produz.qtd <= 0) {
            throw new Error(
                'Informe a quantidade que será produzida do produto pela receita',
            );
        }

        if (
            receitaVisualizacao.ingredientes.length === 0 ||
            receitaVisualizacao.ingredientes.every(i => i.id === 0)
        ) {
            throw new Error(
                'Selecione pelo menos um ingrediente para a receita',
            );
        }

        if (receitaVisualizacao.ingredientes.some(i => i.qtd <= 0)) {
            throw new Error(
                'Informe a quantidade que será utilizada do(s) ingrediente(s)',
            );
        }

        const itemEstoqueProduzido = listaProdutos.find(
            lp => lp.item.id === receitaVisualizacao.produz.id,
        );

        if (!itemEstoqueProduzido) {
            throw new Error(
                'Não foi possivel encontrar o produto que será produzido pela receita',
            );
        }

        const ingredientesInfo = receitaVisualizacao.ingredientes.reduce(
            (valAnterior: {[id: number]: ItemQuantidade}, val) => {
                valAnterior[val.id] = val;

                return valAnterior;
            },
            {},
        );

        const itensIngredientesEstoque = listaMateriaPrima.filter(
            lmp => ingredientesInfo[lmp.item.id],
        );

        if (
            itensIngredientesEstoque.length !==
            receitaVisualizacao.ingredientes.length
        ) {
            throw new Error(
                'Não foi possivel encontrar o(s) ingrediente(s) que utilizado para produzir a receita',
            );
        }

        const itemProduzido: ItemMensurado = {
            item: itemEstoqueProduzido.item,
            medida: itemEstoqueProduzido.medida,
            qtd: receitaVisualizacao.produz.qtd,
        };

        const itensIngredientes: ItemReceita[] = itensIngredientesEstoque.map(
            iie => {
                let ingredienteQuantidade = ingredientesInfo[iie.item.id];

                return {
                    item: iie.item,
                    medida: iie.medida,
                    qtd: ingredienteQuantidade.qtd,
                    valorMediaUnidade: iie.valorMediaUnidade,
                };
            },
        );

        let receitaGravar: Receita;

        if (!receitaSerializada) {
            receitaGravar = new Receita(
                0,
                receitaVisualizacao.descricao,
                itemProduzido,
                itensIngredientes,
                new Date(),
            );
        } else {
            receitaGravar = convertToReceita(receitaSerializada);

            receitaGravar.descricao = receitaVisualizacao.descricao;
            receitaGravar.produz = itemProduzido;
            receitaGravar.ingredientes = itensIngredientes;
        }

        const retorno = await receitaCasoUso.gravaReceita(receitaGravar);

        if (!receitaGravar.id) {
            receitaGravar.id = retorno;
        }

        let receitaDispatch: FormularioReceita = {
            receitaSerializada: convertToReceitaSerializada(receitaGravar),
            receitaFormulario: traduzReceitaFormulario(receitaGravar),
            isLoading: false,
        };

        dispatch(setFormularioReceita(receitaDispatch));
    }

    return [
        cancelar,
        confirmaGravar,
        displayMensagem,
        receitaFormulario,
        listaMateriaPrima,
        listaProdutos,
        gravaReceita,
        isLoading,
    ];
}

export function useDeletaReceita({
    receitaCasoUso,
}: CasoUsoInit): useDeletaEstoque {
    async function deleta(id: number) {
        receitaCasoUso.deletaReceita(id);
    }

    return [deleta];
}

export type OrdemCompraSerializada = {
    id: number;
    itensComprados: ItemOrdem[];
    inclusao: string;
};

function convertToOrdemCompraSerializada(
    compra: OrdemCompra,
): OrdemCompraSerializada {
    return {
        id: compra.id,
        itensComprados: compra.itensComprados,
        inclusao: compra.inclusao.toISOString(),
    };
}

function convertToOrdemCompra(
    compraSerializada: OrdemCompraSerializada,
): OrdemCompra {
    return new OrdemCompra(
        compraSerializada.id,
        compraSerializada.itensComprados,
        new Date(compraSerializada.inclusao),
    );
}

export type OrdemCompraFormulario = {
    id: number;
    itensComprados: ItemQuantidade[];
    inclusao: string;
};

function traduzOrdemCompraFormulario(
    compra: OrdemCompra,
): OrdemCompraFormulario {
    return {
        id: compra.id,
        itensComprados: compra.itensComprados.map(i => {
            return {id: i.item.id, qtd: i.qtd, valor: i.valorTotal};
        }),
        inclusao: compra.inclusao.toISOString(),
    };
}

export type useFormularioOrdemCompraRet = [
    ...useFormularioEstoqueRet,
    OrdemCompraFormulario | null,
    ItemEstoque[],
    (receitaVisualizacao: OrdemCompraFormulario) => Promise<void>,
    boolean,
];

export function useFormularioOrdemCompra(
    {itemCasoUso, ordemCompraCasoUso}: CasoUsoInit,
    id?: number,
): useFormularioOrdemCompraRet {
    const novoRegistro = (id ?? 0) <= 0;

    const [cancelar, confirmaGravar, displayMensagem] =
        useFormularioEstoque(novoRegistro);

    const dispatch = useAppDispatch();

    const {ordemCompraSerializada, ordemCompraFormulario, isLoading} =
        useSelector(selectFormularioOrdemCompra);

    const [listaItens, setListaItens] = useState<ItemEstoque[]>([]);
    useEffect(() => {
        async function buscaProduto(): Promise<FormularioOrdemCompra> {
            if (novoRegistro) {
                return {
                    ordemCompraSerializada: null,
                    ordemCompraFormulario: null,
                    isLoading: false,
                };
            }

            const compra = await ordemCompraCasoUso.buscaOrdemCompra(id ?? 0);

            if (!compra) {
                return {
                    ordemCompraSerializada: null,
                    ordemCompraFormulario: null,
                    isLoading: false,
                };
            }

            return {
                ordemCompraSerializada: convertToOrdemCompraSerializada(compra),
                ordemCompraFormulario: traduzOrdemCompraFormulario(compra),
                isLoading: false,
            };
        }

        async function buscaInfo() {
            dispatch(
                setFormularioOrdemCompra({
                    ordemCompraSerializada: null,
                    ordemCompraFormulario: null,
                    isLoading: true,
                }),
            );

            const [
                receitaDispatch,
                listaMateriaPrimaBuscada,
                listaProdutosBuscada,
            ] = await Promise.all([
                buscaProduto(),
                itemCasoUso.listaMateriasPrimas(),
                itemCasoUso.listaProdutos(),
            ]);

            setListaItens([
                ...listaMateriaPrimaBuscada,
                ...listaProdutosBuscada,
            ]);
            dispatch(setFormularioOrdemCompra(receitaDispatch));
        }

        buscaInfo();
    }, [id, novoRegistro, dispatch, itemCasoUso, ordemCompraCasoUso]);

    async function gravaOrdemCompra(compraVisualizacao: OrdemCompraFormulario) {
        if (
            compraVisualizacao.itensComprados.length === 0 ||
            compraVisualizacao.itensComprados.every(lc => lc.id === 0)
        ) {
            throw new Error('Selecione pelo menos um item na compra');
        }

        if (
            compraVisualizacao.itensComprados
                .filter(lc => lc.id <= 0)
                .some(lc => lc.qtd <= 0)
        ) {
            throw new Error('Informe a quantidade comprada do(s) item(ns)');
        }

        if (
            compraVisualizacao.itensComprados
                .filter(lc => lc.id <= 0)
                .some(lc => (lc.valor ?? 0) <= 0)
        ) {
            throw new Error(
                'Informe o valor total gasto na compra do(s) item(ns)',
            );
        }

        const itensCompradoInfo = compraVisualizacao.itensComprados.reduce(
            (valAnterior: {[id: number]: ItemQuantidade}, val) => {
                valAnterior[val.id] = val;

                return valAnterior;
            },
            {},
        );

        const itensEstoqueComprado = listaItens.filter(
            li => itensCompradoInfo[li.item.id],
        );

        if (
            compraVisualizacao.itensComprados.length !==
            itensEstoqueComprado.length
        ) {
            throw new Error(
                'Não foi possivel encontrar o(s) item(ns) comprados',
            );
        }

        const itensComprados: ItemOrdem[] = itensEstoqueComprado.map(iic => {
            let itemComprado = itensCompradoInfo[iic.item.id];

            return {
                item: iic.item,
                medida: iic.medida,
                qtd: itemComprado.qtd,
                valorTotal: itemComprado.valor ?? 0,
            };
        });

        let compraGravar: OrdemCompra;

        if (!ordemCompraSerializada) {
            compraGravar = new OrdemCompra(0, itensComprados, new Date());
        } else {
            compraGravar = convertToOrdemCompra(ordemCompraSerializada);

            compraGravar.itensComprados = itensComprados;
        }

        const retorno = await ordemCompraCasoUso.gravaOrdemCompra(compraGravar);

        if (!compraGravar.id) {
            compraGravar.id = retorno;
        }

        let compraDispatch: FormularioOrdemCompra = {
            ordemCompraSerializada:
                convertToOrdemCompraSerializada(compraGravar),
            ordemCompraFormulario: traduzOrdemCompraFormulario(compraGravar),
            isLoading: false,
        };

        dispatch(setFormularioOrdemCompra(compraDispatch));
    }

    return [
        cancelar,
        confirmaGravar,
        displayMensagem,
        ordemCompraFormulario,
        listaItens,
        gravaOrdemCompra,
        isLoading,
    ];
}

export function useDeletaOrdemCompra({
    ordemCompraCasoUso,
}: CasoUsoInit): useDeletaEstoque {
    async function deleta(id: number) {
        ordemCompraCasoUso.deletaOrdemCompra(id);
    }

    return [deleta];
}
