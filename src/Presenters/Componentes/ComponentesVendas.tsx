import React, {useState, useMemo, useCallback, useContext} from 'react';
import {OrdemVenda} from '../../Entidades/OrdemVenda';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
    EstoqueGerenciamentoProps,
    VendaGerenciamentoProps,
} from '../Navigation/types';
import {
    ButtonForm,
    ButtonWithStyle,
    DropDownListWithAdd,
    KeyValueEntrie,
    MultipleItemQuantidade,
    RegistroItemListaItem,
    convertNumberToMaskedNumber,
    eModalTipo,
    formataDataDisplay,
    styleFormularioUtil,
    styleModalOpcoes,
    styleScreenUtil,
    styleUtil,
} from './Utils';
import {
    ButtonExpande,
    EstoqueModalOpcoesProp,
    eComponenteEstoqueTipo,
} from './ComponentesEstoque';
import {CasoUso} from '../../App';
import {useDeletaOrdemCompra} from '../Controlles/EstoqueController';
import {ItemQuantidade} from '../Controlles/Util';
import {
    OrdemVendaFormulario,
    useFormularioOrdemVenda,
} from '../Controlles/VendasController';
import {ItemEstoque} from '../../Entidades/Item';
import {Cliente} from '../../Entidades/Cliente';
import {Local} from '../../Entidades/Local';
import {listaClientes, listaLocais} from '../../Data/InitialDataStub';

export type VendasRegistroContainerProps = {
    vendas: OrdemVenda[];
};

export function VendasRegistroContainer({
    vendas,
}: VendasRegistroContainerProps): React.JSX.Element {
    function datasDiferentes(data1: Date, data2: Date) {
        return (
            data1.toISOString().substring(0, 10) !==
            data2.toISOString().substring(0, 10)
        );
    }

    const listaVendasRenderizadas = useMemo(() => {
        const listaRenderizada: React.JSX.Element[] = [];

        let ultimaData = new Date('1970-01-01 00:00:00');
        for (let venda of vendas) {
            if (datasDiferentes(ultimaData, venda.inclusao)) {
                const dataFormatada = formataDataDisplay(venda.inclusao);

                listaRenderizada.push(
                    <Text
                        style={[
                            styleUtil.contentText,
                            styleUtil.textAlignCenter,
                            styleVendasRegistroContainer.dateDivisor,
                        ]}
                        key={dataFormatada}>
                        {dataFormatada}
                    </Text>,
                );

                ultimaData = venda.inclusao;
            }

            listaRenderizada.push(
                <OrdemVendaRegistro venda={venda} key={venda.id} />,
            );
        }

        return listaRenderizada;
    }, [vendas]);

    return (
        <View
            style={[
                styleVendasRegistroContainer.container,
                styleUtil.alignCenter,
            ]}>
            {listaVendasRenderizadas}
        </View>
    );
}

const styleVendasRegistroContainer = StyleSheet.create({
    container: {width: '85%', marginBottom: 10},
    dateDivisor: {
        backgroundColor: '#B180C5',
        borderColor: '#A776BB',
        borderWidth: 2,
        borderRadius: 15,
        padding: 5,
        color: '#fff',
    },
});

export type OrdemVendaRegistroProp = {
    venda: OrdemVenda;
};

function OrdemVendaRegistro({
    venda,
}: OrdemVendaRegistroProp): React.JSX.Element {
    const {navigate} = useNavigation<VendaGerenciamentoProps['navigation']>();
    const [expandido, setExpandido] = useState(false);

    function opcoes() {
        navigate('VendaModalOpcoes', {
            id: venda.id,
        });
    }

    const descricaoOrdemVenda = `#${venda.id} - ${venda.local.descricao} - ${venda.cliente.nome}`;

    const totalVenda = `R$ ${convertNumberToMaskedNumber(venda.totalVenda)}`;

    return (
        <TouchableOpacity onLongPress={opcoes}>
            {!expandido ? (
                <View style={[styleOrdemVendaRegistro.container]}>
                    <View style={[styleOrdemVendaRegistro.containerBtnExpande]}>
                        <ButtonExpande
                            onPress={() => setExpandido(true)}
                            expandido={false}
                        />
                    </View>
                    <View
                        style={[
                            styleUtil.alignCenter,
                            styleOrdemVendaRegistro.infoContainer,
                        ]}>
                        <Text
                            style={[
                                styleUtil.contentText,
                                styleOrdemVendaRegistro.descricaoRegistro,
                            ]}>
                            {descricaoOrdemVenda}
                        </Text>
                        <View
                            style={[styleOrdemVendaRegistro.sideInfoContainer]}>
                            <Text
                                style={[
                                    styleUtil.contentText,
                                    styleOrdemVendaRegistro.badgeValor,
                                ]}>
                                {totalVenda}
                            </Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View
                    style={[
                        styleOrdemVendaRegistro.container,
                        styleOrdemVendaRegistro.expandidoContainer,
                    ]}>
                    <Text
                        style={[
                            styleOrdemVendaRegistro.infoContainer,
                            styleOrdemVendaRegistro.expandidoDescricaoRegistro,
                            styleUtil.subTitle,
                        ]}>
                        #{venda.id}
                        {'\n'}
                        Local: {venda.local.descricao} {'\n'}
                        Cliente: {venda.cliente.nome} {'\n'}
                    </Text>
                    <Text
                        style={[
                            styleUtil.contentText,
                            styleOrdemVendaRegistro.totalValor,
                        ]}>
                        Total: {totalVenda}
                    </Text>
                    <View
                        style={[
                            styleUtil.alignCenter,
                            styleOrdemVendaRegistro.itensContainer,
                        ]}>
                        <Text style={[styleUtil.nestedSubTitle]}>
                            Itens Comprados
                        </Text>
                        {venda.itensVendidos.map(i => (
                            <RegistroItemListaItem
                                item={i}
                                key={i.item.id}
                                mostraValor
                            />
                        ))}
                    </View>
                    <ButtonExpande
                        onPress={() => setExpandido(false)}
                        expandido={true}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}

const styleOrdemVendaRegistro = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#BFAEC6',
        gap: 5,
        width: '100%',
        borderRadius: 15,
    },
    expandidoContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 5,
        gap: 10,
    },
    infoContainer: {
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: undefined,
    },
    sideInfoContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        top: 0,
        right: 0,
        width: '34%',
    },
    descricaoRegistro: {
        paddingVertical: 5,
        width: '66%',
    },
    badgeValor: {
        alignSelf: 'flex-start',
        backgroundColor: '#E8D7EE',
        borderColor: '#DECDE4',
        borderWidth: 2,
        paddingHorizontal: 10,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        maxWidth: '100%',
    },
    totalValor: {
        backgroundColor: '#B180C5',
        padding: 10,
        color: '#fff',
        borderRadius: 15,
    },
    expandidoDescricaoRegistro: {
        flexGrow: undefined,
        width: '100%',
        backgroundColor: '#B180C5',
        padding: 10,
        color: '#fff',
        borderRadius: 15,
    },
    itensContainer: {
        backgroundColor: '#E8D7EE',
        borderRadius: 15,
        padding: 10,
    },
    containerBtnExpande: {
        paddingVertical: 5,
        paddingLeft: 5,
    },
});

export function ButtonAdicionaVenda(): React.JSX.Element {
    const {navigate} = useNavigation<VendaGerenciamentoProps['navigation']>();

    return (
        <View
            style={[styleButtonAdicionaVenda.container, styleUtil.alignCenter]}>
            <ButtonForm
                icon={['fas', 'plus']}
                onPress={() => navigate('VendaGerenciamento', {})}
            />
        </View>
    );
}

const styleButtonAdicionaVenda = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginVertical: 50,
        marginHorizontal: 78.5,
    },
});

export interface FormularioVendaProp {
    id?: number;
    cancelado?: boolean;
}

interface FormularioVendaLoadedProp extends FormularioVendaProp {
    ordemVendaFormulario: OrdemVendaFormulario | null;
    listaItens: ItemEstoque[];
    listaClientes: Cliente[];
    listaLocais: Local[];
    gravaOrdemVenda: (vendaVisualizacao: OrdemVendaFormulario) => Promise<void>;
    cancelar: () => void;
    confirmaGravar: () => void;
    displayMensagem: (mensagem: string, tipo: eModalTipo) => void;
}

function FormularioVendaLoaded({
    ordemVendaFormulario,
    listaItens,
    gravaOrdemVenda,
    cancelar,
    confirmaGravar,
    displayMensagem,
    cancelado,
}: FormularioVendaLoadedProp) {
    let novoRegistro = (ordemVendaFormulario?.id ?? 0) === 0;

    const [listaItensVendidos, setListaItensVendidos] = useState<
        ItemQuantidade[]
    >([]);

    const [clienteSelecionado, setClienteSelecionado] = useState(
        ordemVendaFormulario?.cliente,
    );

    const [localSelecionado, setLocalSelecionado] = useState(
        ordemVendaFormulario?.local,
    );

    const [valorTotal, setValorTotal] = useState(
        ordemVendaFormulario
            ? ordemVendaFormulario.itensVendidos.reduce(
                  (prevVal, currVal) => prevVal + (currVal.valor ?? 0),
                  0,
              )
            : 0,
    );

    const [aguardandoConfimacao, setAguardandoConfimacao] = useState(false);

    function validaValores() {
        if (
            clienteSelecionado === undefined ||
            (clienteSelecionado.id === 0 &&
                clienteSelecionado.nome.trim() === '')
        ) {
            return 'Informe o cliente que realizou a compra';
        }

        if (
            localSelecionado === undefined ||
            (localSelecionado.id === 0 &&
                localSelecionado.descricao.trim() === '')
        ) {
            return 'Informe o local a onde foi realizada a venda';
        }

        if (
            listaItensVendidos.length === 0 ||
            listaItensVendidos.every(li => li.id === 0)
        ) {
            return 'Selecione pelo menos um item vendido';
        }

        const itensSemQuantidade = listaItensVendidos
            .filter(li => li.qtd <= 0)
            .map(li => li.id);
        if (itensSemQuantidade.length > 0) {
            const descricoesItensSemQuantidade = listaItens
                .filter(lmp => itensSemQuantidade.includes(lmp.item.id))
                .map(lmp => lmp.item.descricao)
                .join(',');

            return `Informe a quantidade vendida do(s) item(ns): ${descricoesItensSemQuantidade}`;
        }

        const itensSemValor = listaItensVendidos
            .filter(li => (li.valor ?? 0) <= 0)
            .map(li => li.id);
        if (itensSemValor.length > 0) {
            const descricoesItensSemValor = listaItens
                .filter(lmp => itensSemValor.includes(lmp.item.id))
                .map(lmp => lmp.item.descricao)
                .join(',');

            return `Informe o valor total da venda do(s) item(ns): ${descricoesItensSemValor}`;
        }

        return '';
    }

    const trataGravar = useCallback(
        (
            id: number,
            cliente: Cliente,
            local: Local,
            itensComprados: ItemQuantidade[],
            inclusao: string,
        ) => {
            async function handleGravar() {
                setAguardandoConfimacao(false);

                try {
                    await gravaOrdemVenda({
                        id: id,
                        cliente: cliente,
                        local: local,
                        itensVendidos: itensComprados,
                        inclusao: inclusao,
                    });

                    displayMensagem(
                        'Foi gravado com sucesso',
                        eModalTipo.Sucesso,
                    );
                } catch (e) {
                    if (e instanceof Error) {
                        displayMensagem(e.message, eModalTipo.Erro);
                        console.log(e.stack);
                    }
                }
            }

            handleGravar();
        },
        [displayMensagem, gravaOrdemVenda],
    );

    if (aguardandoConfimacao && cancelado !== undefined && !cancelado) {
        if (clienteSelecionado && localSelecionado) {
            trataGravar(
                ordemVendaFormulario?.id ?? 0,
                clienteSelecionado,
                localSelecionado,
                listaItensVendidos,
                ordemVendaFormulario?.inclusao ?? new Date().toISOString(),
            );
        }
    }

    let descricaoFormulario = 'Adição Venda';

    if (!novoRegistro) {
        descricaoFormulario = `Edição Venda - #${ordemVendaFormulario?.id} - ${ordemVendaFormulario?.local.descricao} - ${ordemVendaFormulario?.cliente.nome}`;
    }

    function handleItensVendaChange(val: ItemQuantidade[]) {
        const totalCalculado = val.reduce(
            (prevVal, currVal) => prevVal + (currVal.valor ?? 0),
            0,
        );

        if (totalCalculado !== valorTotal) {
            setValorTotal(totalCalculado);
        }

        setListaItensVendidos(val);
    }

    function handleClienteChange(val: KeyValueEntrie) {
        let cliente: Cliente | undefined;

        if (val.key !== 0) {
            cliente = listaClientes.find(lc => lc.id === val.key);
        } else {
            cliente = {
                id: val.key,
                nome: val.value,
                inclusao: '',
            };
        }

        setClienteSelecionado(cliente);
    }

    function handleLocalChange(val: KeyValueEntrie) {
        let local: Local | undefined;

        if (val.key !== 0) {
            local = listaLocais.find(ll => ll.id === val.key);
        } else {
            local = {
                id: val.key,
                descricao: val.value,
                inclusao: '',
            };
        }

        setLocalSelecionado(local);
    }

    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleFormularioUtil.containerFormulario,
            ]}>
            <Text
                style={[
                    styleFormularioUtil.titleFormulario,
                    styleUtil.titleText,
                ]}>
                {descricaoFormulario}
            </Text>
            <DropDownListWithAdd
                itens={listaClientes.map(lc => {
                    return {key: lc.id, value: lc.nome};
                })}
                valorInicial={ordemVendaFormulario?.cliente.id}
                addText="Adicionar Cliente"
                onChange={handleClienteChange}
                placeholderDropDownList="Cliente"
                placeholderInputAdd="Nome do Cliente"
                widthDropDownList={'95%'}
            />
            <DropDownListWithAdd
                itens={listaLocais.map(lc => {
                    return {key: lc.id, value: lc.descricao};
                })}
                valorInicial={ordemVendaFormulario?.local.id}
                addText="Adicionar Local"
                onChange={handleLocalChange}
                placeholderDropDownList="Local Venda"
                placeholderInputAdd="Nome do local"
                widthDropDownList={'95%'}
            />
            <Text
                style={[styleUtil.contentText, styleFormularioUtil.totalValor]}>
                Total: R$ {convertNumberToMaskedNumber(valorTotal)}
            </Text>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.inputContainerFormulario,
                ]}>
                <MultipleItemQuantidade
                    title="Itens Venda"
                    listaItens={listaItens}
                    valoresIniciais={ordemVendaFormulario?.itensVendidos}
                    incluiValor
                    onChange={handleItensVendaChange}
                    placeholderQtdInput="Quantidade vendida"
                />
            </View>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.buttonContainerFormulario,
                ]}>
                <ButtonWithStyle
                    title={novoRegistro ? 'Adicionar' : 'Gravar'}
                    onPress={() => {
                        let mensagem = validaValores();
                        if (mensagem.trim() !== '') {
                            displayMensagem(mensagem, eModalTipo.Erro);
                            return;
                        }

                        confirmaGravar();
                        setAguardandoConfimacao(true);
                    }}
                    style={[styleUtil.button, styleUtil.actionButton]}
                />
                <ButtonWithStyle
                    title="Cancelar"
                    onPress={cancelar}
                    style={[styleUtil.button, styleUtil.cancelaButton]}
                />
            </View>
        </View>
    );
}

export function FormularioVenda({
    id,
    cancelado,
}: FormularioVendaProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [
        cancelar,
        confirmaGravar,
        displayMensagem,
        ordemVendaFormulario,
        listaItens,
        listaClientes,
        listaLocais,
        gravaOrdemVenda,
        isLoading,
    ] = useFormularioOrdemVenda(casoUsoInit, id);

    return (
        <View>
            {!isLoading ? (
                <FormularioVendaLoaded
                    ordemVendaFormulario={ordemVendaFormulario}
                    listaItens={listaItens}
                    listaClientes={listaClientes}
                    listaLocais={listaLocais}
                    gravaOrdemVenda={gravaOrdemVenda}
                    cancelar={cancelar}
                    confirmaGravar={confirmaGravar}
                    displayMensagem={displayMensagem}
                    cancelado={cancelado}
                />
            ) : (
                <Text>loading</Text>
            )}
        </View>
    );
}

type VendasModalOpcoesProp = {
    id: number;
    cancelado?: boolean;
};

export function VendaModalOpcoesVenda({
    id,
    cancelado,
}: VendasModalOpcoesProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    //const [deleta] = useDeletaOrdemCompra(casoUsoInit);
    const [deleta] = [
        async (ida: number) => {
            console.log(`Excluindo venda - ID:${ida}`);
        },
    ];
    const natigation = useNavigation<VendaGerenciamentoProps['navigation']>();

    function editar() {
        natigation.navigate('VendaGerenciamento', {
            id: id,
        });
    }

    function confimaExclusao() {
        natigation.navigate('VendaModalInfo', {
            tipo: eModalTipo.Aviso,
            mensagem: 'Deseja excluir o registro selecionado?',
            redirecionaConfirma: 'VendaModalOpcoes',
            redirecionaCancela: 'VendaVisualizacao',
        });
    }

    const trataExclui = useCallback(
        (idExclui: number) => {
            async function handleExclui() {
                try {
                    await deleta(idExclui);
                    natigation.navigate('VendaVisualizacao');
                } catch (e) {
                    if (e instanceof Error) {
                        natigation.navigate('VendaModalInfo', {
                            tipo: eModalTipo.Erro,
                            mensagem: e.message,
                            redirecionaConfirma: 'VendaVisualizacao',
                        });
                    }
                }
            }

            handleExclui();
        },
        [deleta, natigation],
    );

    if (cancelado !== undefined) {
        trataExclui(id);
    }

    return (
        <View
            style={[
                styleScreenUtil.alignCenter,
                styleModalOpcoes.containerModalOption,
            ]}>
            <ButtonWithStyle
                title="Editar"
                onPress={editar}
                style={[styleUtil.button, styleUtil.actionButton]}
            />
            <ButtonWithStyle
                title="Excluir"
                onPress={confimaExclusao}
                style={[styleUtil.button, styleUtil.cancelaButton]}
            />
        </View>
    );
}
