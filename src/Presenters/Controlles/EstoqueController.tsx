import {useEffect, useState} from 'react';
import {ItemEstoque, eItemTipo} from '../../Entidades/Item';
import {CasoUsoInit} from '../../App';
import {
    Medida,
    MedidaInfo,
    eMedida,
    getMedida,
    listMedidas,
} from '../../Entidades/Medida';
import {useNavigation} from '@react-navigation/native';
import {EstoqueGerenciamentoProps, eModalTipo} from '../Navigation/types';
import {useAppDispatch} from '../Slicers/Store';
import {
    FormularioMateriaPrima,
    selectFormularioMateriaPrima,
    setFormularioMateriaPrima,
} from '../Slicers/EstoqueSlice';
import {useSelector} from 'react-redux';
import _ from 'lodash';

export interface EstoqueRegistro {
    materiasPrimas: ItemEstoque[];
}

export function useVisualizaEstoque({
    itemCasoUso,
}: CasoUsoInit): [EstoqueRegistro] {
    const [estoqueRegistro, setEstoqueRegistro] = useState<EstoqueRegistro>({
        materiasPrimas: [],
    });

    useEffect(() => {
        async function buscaInfoEstoque() {
            const materiasPrimas = await itemCasoUso.listaMateriasPrimas();

            setEstoqueRegistro({
                materiasPrimas: materiasPrimas,
            });
        }

        buscaInfoEstoque();
    }, [itemCasoUso]);

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
    MedidaInfo[],
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

    const listaMedidasInfo = listMedidas();

    return [cancelar, confirmaGravar, displayMensagem, listaMedidasInfo];
}

export type UseFormularioMateriaPrimaRet = [
    ...useFormularioEstoqueRet,
    ItemEstoqueFormulario | null,
    (itemVisualizacao: ItemEstoqueFormulario) => Promise<void>,
    boolean,
];

export function useFormularioMateriaPrima(
    {itemCasoUso}: CasoUsoInit,
    id?: number,
): UseFormularioMateriaPrimaRet {
    const novoRegistro = (id ?? 0) <= 0;

    const [cancelar, confirmaGravar, displayMensagem, listaMedidasInfo] =
        useFormularioEstoque(novoRegistro);

    const dispatch = useAppDispatch();

    const {itemEstoque, itemEstoqueFormulario} = useSelector(
        selectFormularioMateriaPrima,
    );

    const [loading, setLoading] = useState(true);

    function traduzItemEstoqueFormulario(
        item: ItemEstoque,
    ): ItemEstoqueFormulario {
        return {
            id: item.item.id,
            descricao: item.item.descricao,
            medida: item.medida,
            qtd: item.qtd,
            valorMediaUnidade: item.valorMediaUnidade,
        };
    }

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

            let itemDispatch: FormularioMateriaPrima = {
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

        let itemDispatch: FormularioMateriaPrima = {
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
