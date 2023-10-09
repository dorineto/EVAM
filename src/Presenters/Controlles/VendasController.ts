import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {CasoUsoInit} from '../../App';
import {OrdemVenda} from '../../Entidades/OrdemVenda';
import {useCallback, useEffect, useState} from 'react';
import {eModalTipo} from '../Componentes/Utils';
import {VendaGerenciamentoProps} from '../Navigation/types';
import {useAppDispatch} from '../Slicers/Store';
import {useSelector} from 'react-redux';
import {ItemQuantidade} from './Util';
import {ItemEstoque, ItemOrdem} from '../../Entidades/Item';
import {Cliente} from '../../Entidades/Cliente';
import {Local} from '../../Entidades/Local';
import {
    FormularioOrdemVenda,
    selectFormularioOrdemVenda,
    setFormularioOrdemVenda,
} from '../Slicers/EstoqueSlice';

export interface VendasRegistro {
    vendas: OrdemVenda[];
}

export function useVisualizaVendas({
    ordemVendaCasoUso,
}: CasoUsoInit): [VendasRegistro] {
    const [vendasRegistro, setVendasRegistro] = useState<VendasRegistro>({
        vendas: [],
    });

    useFocusEffect(
        useCallback(() => {
            async function buscaInfoVendas() {
                const vendas = await ordemVendaCasoUso.listaOrdemVendas();

                setVendasRegistro({
                    vendas: vendas.sort((c1, c2) => c1.id - c2.id).reverse(),
                });
            }

            buscaInfoVendas();
        }, [ordemVendaCasoUso]),
    );

    return [vendasRegistro];
}

type useFormularioVendaRet = [
    () => void,
    () => void,
    (mensagem: string, tipo: eModalTipo) => void,
];

function useFormularioVenda(novoRegistro: boolean): useFormularioVendaRet {
    const navigation = useNavigation<VendaGerenciamentoProps['navigation']>();

    function cancelar() {
        navigation.navigate('VendaModalInfo', {
            mensagem: `Deseja cancelar a ${
                novoRegistro ? 'adição' : 'edição'
            } do novo registro?`,
            tipo: eModalTipo.Aviso,
            redirecionaConfirma: 'VendaVisualizacao',
            redirecionaCancela: 'volta',
        });
    }

    function confirmaGravar() {
        navigation.navigate('VendaModalInfo', {
            mensagem: `Deseja ${
                novoRegistro ? 'adicionar novo' : 'alterar'
            } registro?`,
            tipo: eModalTipo.Aviso,
            redirecionaConfirma: 'VendaGerenciamento',
            redirecionaCancela: 'VendaGerenciamento',
        });
    }

    function displayMensagem(mensagem: string, tipo: eModalTipo) {
        navigation.navigate('VendaModalInfo', {
            mensagem: mensagem,
            tipo: tipo,
            redirecionaConfirma: 'volta',
        });
    }

    return [cancelar, confirmaGravar, displayMensagem];
}

export type OrdemVendaSerializada = {
    id: number;
    itensVendidos: ItemOrdem[];
    cliente: Cliente;
    local: Local;
    inclusao: string;
};

function convertToOrdemVendaSerializada(
    venda: OrdemVenda,
): OrdemVendaSerializada {
    return {
        id: venda.id,
        itensVendidos: venda.itensVendidos,
        cliente: venda.cliente,
        local: venda.local,
        inclusao: venda.inclusao.toISOString(),
    };
}

function convertToOrdemVenda(
    vendaSerializada: OrdemVendaSerializada,
): OrdemVenda {
    return new OrdemVenda(
        vendaSerializada.id,
        vendaSerializada.cliente,
        vendaSerializada.local,
        vendaSerializada.itensVendidos,
        new Date(vendaSerializada.inclusao),
    );
}

export type OrdemVendaFormulario = {
    id: number;
    itensVendidos: ItemQuantidade[];
    cliente: Cliente;
    local: Local;
    inclusao: string;
};

function traduzOrdemVendaFormulario(venda: OrdemVenda): OrdemVendaFormulario {
    return {
        id: venda.id,
        cliente: venda.cliente,
        local: venda.local,
        itensVendidos: venda.itensVendidos.map(i => {
            return {id: i.item.id, qtd: i.qtd, valor: i.valorTotal};
        }),
        inclusao: venda.inclusao.toISOString(),
    };
}

export type useFormularioOrdemVendaRet = [
    ...useFormularioVendaRet,
    OrdemVendaFormulario | null,
    ItemEstoque[],
    Cliente[],
    Local[],
    (receitaVisualizacao: OrdemVendaFormulario) => Promise<void>,
    boolean,
];

export function useFormularioOrdemVenda(
    {itemCasoUso, ordemVendaCasoUso}: CasoUsoInit,
    id?: number,
): useFormularioOrdemVendaRet {
    const novoRegistro = (id ?? 0) <= 0;

    const [cancelar, confirmaGravar, displayMensagem] =
        useFormularioVenda(novoRegistro);

    const dispatch = useAppDispatch();

    const {ordemVendaSerializada, ordemVendaFormulario, isLoading} =
        useSelector(selectFormularioOrdemVenda);

    const [listaItens, setListaItens] = useState<ItemEstoque[]>([]);
    const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
    const [listaLocais, setListaLocais] = useState<Local[]>([]);

    useEffect(() => {
        async function buscaVenda(): Promise<FormularioOrdemVenda> {
            if (novoRegistro) {
                return {
                    ordemVendaSerializada: null,
                    ordemVendaFormulario: null,
                    isLoading: false,
                };
            }

            const venda = await ordemVendaCasoUso.buscaOrdemVenda(id ?? 0);
            //const venda: OrdemVenda | null = null;

            if (!venda) {
                return {
                    ordemVendaSerializada: null,
                    ordemVendaFormulario: null,
                    isLoading: false,
                };
            }

            return {
                ordemVendaSerializada: convertToOrdemVendaSerializada(venda),
                ordemVendaFormulario: traduzOrdemVendaFormulario(venda),
                isLoading: false,
            };
        }

        async function buscaInfo() {
            dispatch(
                setFormularioOrdemVenda({
                    ordemCompraSerializada: null,
                    ordemCompraFormulario: null,
                    isLoading: true,
                }),
            );

            const [
                receitaDispatch,
                listaClientesBuscada,
                listaLocaisBuscada,
                listaMateriaPrimaBuscada,
                listaProdutosBuscada,
            ] = await Promise.all([
                buscaVenda(),
                ordemVendaCasoUso.listaClientes(),
                ordemVendaCasoUso.listaLocais(),
                itemCasoUso.listaMateriasPrimas(),
                itemCasoUso.listaProdutos(),
            ]);

            setListaItens([
                ...listaMateriaPrimaBuscada,
                ...listaProdutosBuscada,
            ]);
            setListaClientes(listaClientesBuscada);
            setListaLocais(listaLocaisBuscada);
            dispatch(setFormularioOrdemVenda(receitaDispatch));
        }

        buscaInfo();
    }, [id, novoRegistro, dispatch, itemCasoUso, ordemVendaCasoUso]);

    async function gravaOrdemVenda(vendaVisualizacao: OrdemVendaFormulario) {
        if (
            vendaVisualizacao.cliente.id === 0 &&
            vendaVisualizacao.cliente.nome.trim() === ''
        ) {
            return 'Informe o cliente que realizou a compra';
        }

        if (
            vendaVisualizacao.local.id === 0 &&
            vendaVisualizacao.local.descricao.trim() === ''
        ) {
            return 'Informe o local a onde foi realizada a venda';
        }

        if (
            vendaVisualizacao.itensVendidos.length === 0 ||
            vendaVisualizacao.itensVendidos.every(lc => lc.id === 0)
        ) {
            throw new Error('Selecione pelo menos um item vendido');
        }

        if (
            vendaVisualizacao.itensVendidos
                .filter(lc => lc.id <= 0)
                .some(lc => lc.qtd <= 0)
        ) {
            throw new Error('Informe a quantidade comprada do(s) item(ns)');
        }

        if (
            vendaVisualizacao.itensVendidos
                .filter(lc => lc.id <= 0)
                .some(lc => (lc.valor ?? 0) <= 0)
        ) {
            throw new Error(
                'Informe o valor total gasto na compra do(s) item(ns)',
            );
        }

        const itensVendidosInfo = vendaVisualizacao.itensVendidos.reduce(
            (valAnterior: {[id: number]: ItemQuantidade}, val) => {
                valAnterior[val.id] = val;

                return valAnterior;
            },
            {},
        );

        const itensEstoqueVendido = listaItens.filter(
            li => itensVendidosInfo[li.item.id],
        );

        if (
            vendaVisualizacao.itensVendidos.length !==
            itensEstoqueVendido.length
        ) {
            throw new Error(
                'Não foi possivel encontrar o(s) item(ns) comprados',
            );
        }

        const itensVendidos: ItemOrdem[] = itensEstoqueVendido.map(iic => {
            let itemVendido = itensVendidosInfo[iic.item.id];

            return {
                item: iic.item,
                medida: iic.medida,
                qtd: itemVendido.qtd,
                valorTotal: itemVendido.valor ?? 0,
            };
        });

        const cliente =
            vendaVisualizacao.cliente.id !== 0
                ? vendaVisualizacao.cliente
                : {
                      ...vendaVisualizacao.cliente,
                      inclusao: new Date().toISOString(),
                  };

        const local =
            vendaVisualizacao.local.id !== 0
                ? vendaVisualizacao.local
                : {
                      ...vendaVisualizacao.local,
                      inclusao: new Date().toISOString(),
                  };

        let vendaGravar: OrdemVenda;

        if (!ordemVendaSerializada) {
            vendaGravar = new OrdemVenda(
                0,
                cliente,
                local,
                itensVendidos,
                new Date(),
            );
        } else {
            vendaGravar = convertToOrdemVenda(ordemVendaSerializada);

            vendaGravar.cliente = cliente;
            vendaGravar.local = local;
            vendaGravar.itensVendidos = itensVendidos;
        }

        const retorno = await ordemVendaCasoUso.gravaOrdemVenda(vendaGravar);

        if (!vendaGravar.id) {
            vendaGravar.id = retorno;
        }

        let compraDispatch: FormularioOrdemVenda = {
            ordemVendaSerializada: convertToOrdemVendaSerializada(vendaGravar),
            ordemVendaFormulario: traduzOrdemVendaFormulario(vendaGravar),
            isLoading: false,
        };

        dispatch(setFormularioOrdemVenda(compraDispatch));
    }

    return [
        cancelar,
        confirmaGravar,
        displayMensagem,
        ordemVendaFormulario,
        listaItens,
        listaClientes,
        listaLocais,
        gravaOrdemVenda,
        isLoading,
    ];
}
