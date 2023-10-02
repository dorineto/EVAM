import {useCallback, useEffect, useState} from 'react';
import {
    ItemEstoque,
    ItemMensurado,
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
import {EstoqueGerenciamentoProps, eModalTipo} from '../Navigation/types';
import {useAppDispatch} from '../Slicers/Store';
import {
    FormularioItemEstoque,
    FormularioReceita,
    selectFormularioMateriaPrima,
    selectFormularioProduto,
    selectFormularioReceita,
    setFormularioMateriaPrima,
    setFormularioProduto,
    setFormularioReceita,
} from '../Slicers/EstoqueSlice';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import {Receita} from '../../Entidades/Receita';

export interface EstoqueRegistro {
    materiasPrimas: ItemEstoque[];
    produtos: ItemEstoque[];
    receitas: Receita[];
}

export function useVisualizaEstoque({
    itemCasoUso,
    receitaCasoUso,
}: CasoUsoInit): [EstoqueRegistro] {
    const [estoqueRegistro, setEstoqueRegistro] = useState<EstoqueRegistro>({
        materiasPrimas: [],
        produtos: [],
        receitas: [],
    });

    useFocusEffect(
        useCallback(() => {
            async function buscaInfoEstoque() {
                const [materiasPrimas, produtos, receitas] = await Promise.all([
                    itemCasoUso.listaMateriasPrimas(),
                    itemCasoUso.listaProdutos(),
                    receitaCasoUso.listaReceitas(),
                ]);

                setEstoqueRegistro({
                    materiasPrimas: materiasPrimas,
                    produtos: produtos,
                    receitas: receitas,
                });
            }

            buscaInfoEstoque();
        }, [itemCasoUso, receitaCasoUso]),
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

    const {itemEstoque, itemEstoqueFormulario} = useSelector(
        selectFormularioMateriaPrima,
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function buscaMateriaPrima() {
            if (novoRegistro) {
                setLoading(false);
                dispatch(
                    setFormularioMateriaPrima({
                        itemEstoque: null,
                        itemEstoqueFormulario: null,
                    }),
                );
                return;
            }

            const itemEstoqueBuscado = await itemCasoUso.buscaMateriaPrima(
                id ?? 0,
            );

            if (!itemEstoqueBuscado) {
                setLoading(false);
                dispatch(
                    setFormularioMateriaPrima({
                        itemEstoque: null,
                        itemEstoqueFormulario: null,
                    }),
                );
                return;
            }

            let itemDispatch: FormularioItemEstoque = {
                itemEstoque: itemEstoqueBuscado,
                itemEstoqueFormulario:
                    traduzItemEstoqueFormulario(itemEstoqueBuscado),
            };

            dispatch(setFormularioMateriaPrima(itemDispatch));
            setLoading(false);
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
        loading,
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

    const {itemEstoque, itemEstoqueFormulario} = useSelector(
        selectFormularioProduto,
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function buscaProduto() {
            if (novoRegistro) {
                setLoading(false);
                dispatch(
                    setFormularioProduto({
                        itemEstoque: null,
                        itemEstoqueFormulario: null,
                    }),
                );
                return;
            }

            const itemEstoqueBuscado = await itemCasoUso.buscaProduto(id ?? 0);

            if (!itemEstoqueBuscado) {
                setLoading(false);
                dispatch(
                    setFormularioProduto({
                        itemEstoque: null,
                        itemEstoqueFormulario: null,
                    }),
                );
                return;
            }

            let itemDispatch: FormularioItemEstoque = {
                itemEstoque: itemEstoqueBuscado,
                itemEstoqueFormulario:
                    traduzItemEstoqueFormulario(itemEstoqueBuscado),
            };

            dispatch(setFormularioProduto(itemDispatch));
            setLoading(false);
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
        loading,
    ];
}

export function useDeletaProduto({itemCasoUso}: CasoUsoInit): useDeletaEstoque {
    async function deleta(id: number) {
        itemCasoUso.deletaProduto(id);
    }

    return [deleta];
}

export type ItemQuantidade = {
    id: number;
    qtd: number;
};

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

    const {receitaSerializada, receitaFormulario} = useSelector(
        selectFormularioReceita,
    );

    const [loading, setLoading] = useState(true);

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
                };
            }

            const receita = await receitaCasoUso.buscaReceita(id ?? 0);

            if (!receita) {
                return {
                    receitaSerializada: null,
                    receitaFormulario: null,
                };
            }

            return {
                receitaSerializada: convertToReceitaSerializada(receita),
                receitaFormulario: traduzReceitaFormulario(receita),
            };
        }

        async function buscaInfo() {
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

            setLoading(false);
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

        receitaGravar.id = await receitaCasoUso.gravaReceita(receitaGravar);

        let receitaDispatch: FormularioReceita = {
            receitaSerializada: convertToReceitaSerializada(receitaGravar),
            receitaFormulario: traduzReceitaFormulario(receitaGravar),
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
        loading,
    ];
}
