import React, {useContext, useState, useCallback} from 'react';
import {PropsWithChildren} from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import {ItemEstoque} from '../../Entidades/Item';
import {useNavigation} from '@react-navigation/native';
import {EstoqueGerenciamentoProps, eModalTipo} from '../Navigation/types';
import {Medida, MedidaInfo, eMedida, getMedida} from '../../Entidades/Medida';
import {SelectList} from 'react-native-dropdown-select-list';
import MaskInput, {Masks} from 'react-native-mask-input';
import {QtdMask} from './Utils';
import {
    ItemEstoqueFormulario,
    useDeletaMateriaPrima,
    useFormularioMateriaPrima,
} from '../Controlles/EstoqueController';
import {CasoUso} from '../../App';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

export type EstoqueContainerProps = {
    title: string;
};

const styleUtil = StyleSheet.create({
    alignCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 26.4,
        letterSpacing: -0.7,
    },
    contentText: {
        fontSize: 16,
        letterSpacing: -1,
        lineHeight: 20.8,
    },
});

export function EstoqueContainer({
    title,
    children,
}: PropsWithChildren<EstoqueContainerProps>): React.JSX.Element {
    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleEstoqueContainer.containerEstoque,
            ]}>
            <Text
                style={[
                    styleUtil.titleText,
                    styleEstoqueContainer.titleContainerEstoque,
                ]}>
                {title}
            </Text>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleEstoqueContainer.contentContainerEstoque,
                ]}>
                {children}
            </View>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleEstoqueContainer.expandButtonContainer,
                ]}>
                <TouchableOpacity style={styleEstoqueContainer.expandButton}>
                    <FontAwesomeIcon
                        color={styleEstoqueContainer.expandButton.color}
                        size={styleEstoqueContainer.expandButton.fontSize}
                        icon={['fas', 'caret-down']}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styleEstoqueContainer = StyleSheet.create({
    containerEstoque: {
        backgroundColor: '#E2E2E2',
        borderRadius: 15,
        padding: 10,
        gap: 20,
        width: '80%',
        borderColor: '#CFCFCF',
        borderWidth: 2,
    },
    titleContainerEstoque: {
        backgroundColor: '#8E49A9',
        color: '#fff',
        padding: 10,
        borderRadius: 50,
        width: '100%',
        textAlign: 'center',
    },
    contentContainerEstoque: {
        padding: 10,
        gap: 10,
        width: '100%',
    },
    expandButtonContainer: {
        width: '100%',
    },
    expandButton: {
        color: '#fff',
        fontSize: 25,
        backgroundColor: '#A972BE',
        borderRadius: 100,
        padding: 5,
    },
});

export type MateriaPrimaRegistroProps = {
    materiaPrima: ItemEstoque;
};

export function MateriaPrimaRegistro({
    materiaPrima,
}: MateriaPrimaRegistroProps): React.JSX.Element {
    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function opcoes() {
        navigate('EstoqueModalOpcoes', {
            tipo: eComponenteEstoqueTipo.MateriaPrima,
            id: materiaPrima.item.id,
        });
    }

    return (
        <TouchableOpacity
            onLongPress={opcoes}
            style={styleItemRegistro.containerRegistro}>
            <Text
                style={[
                    styleItemRegistro.descricaoRegistro,
                    styleUtil.contentText,
                ]}>
                {materiaPrima.item.descricao}
            </Text>
            <View style={styleItemRegistro.sideInfoContainerRegistro}>
                <Text
                    style={[
                        styleItemRegistro.badgeValorRegistro,
                        styleUtil.contentText,
                    ]}>
                    R${' '}
                    {materiaPrima.valorMediaUnidade
                        .toFixed(2)
                        .replace('.', ',')}
                </Text>
                <Text
                    style={[
                        styleItemRegistro.quantidadeRegistro,
                        styleUtil.contentText,
                    ]}>
                    {materiaPrima.qtd.toString().replace('.', ',')}{' '}
                    {materiaPrima.medida.abreviacao}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styleItemRegistro = StyleSheet.create({
    containerRegistro: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#BFAEC6',
        gap: 15,
        width: '100%',
        borderRadius: 15,
    },
    descricaoRegistro: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexGrow: 0.7,
    },
    sideInfoContainerRegistro: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexGrow: 0.3,
    },
    badgeValorRegistro: {
        backgroundColor: '#E8D7EE',
        borderColor: '#DECDE4',
        borderWidth: 2,
        paddingHorizontal: 10,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    quantidadeRegistro: {
        paddingHorizontal: 10,
    },
});

type ButtonEstoqueFormProp = {
    icon: IconProp;
    title?: string;
    onPress: () => void;
};

function ButtonEstoqueForm({
    icon,
    title,
    onPress,
}: ButtonEstoqueFormProp): React.JSX.Element {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styleButtonEstoqueForm.containerButtonEstoqueForm]}>
                {title && (
                    <View
                        style={[styleButtonEstoqueForm.titleButtonEstoqueForm]}>
                        <Text
                            style={[
                                styleButtonEstoqueForm.titleButtonEstoqueForm,
                                styleUtil.contentText,
                            ]}>
                            {title}
                        </Text>
                    </View>
                )}
                <View style={[styleButtonEstoqueForm.iconButtonEstoqueForm]}>
                    <FontAwesomeIcon
                        style={[styleButtonEstoqueForm.iconButtonEstoqueForm]}
                        size={
                            styleButtonEstoqueForm.iconButtonEstoqueForm
                                .fontSize
                        }
                        icon={icon}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styleButtonEstoqueForm = StyleSheet.create({
    containerButtonEstoqueForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    titleButtonEstoqueForm: {
        backgroundColor: '#A972BE',
        borderColor: '#9F68B4',
        color: '#fff',
        padding: 5,
        borderRadius: 50,
    },
    iconButtonEstoqueForm: {
        fontSize: 25,
        padding: 10,
        color: '#fff',
        backgroundColor: '#A972BE',
        borderColor: '#9F68B4',
        borderWidth: 2,
        borderRadius: 50,
        fontWeight: 'bold',
    },
});

export function ButtonAdicionaEstoque(): React.JSX.Element {
    const [expandido, setExpandido] = useState(false);

    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    return (
        <View style={[styleUtil.alignCenter]}>
            {expandido && (
                <View style={[styleUtil.alignCenter]}>
                    <ButtonEstoqueForm
                        icon={['fas', 'book']}
                        title="Receitas"
                        onPress={() =>
                            navigate('EstoqueGerenciamento', {
                                componenteEstoqueTipo:
                                    eComponenteEstoqueTipo.Receita,
                            })
                        }
                    />
                    <ButtonEstoqueForm
                        icon={['fas', 'tags']}
                        title="Produtos"
                        onPress={() =>
                            navigate('EstoqueGerenciamento', {
                                componenteEstoqueTipo:
                                    eComponenteEstoqueTipo.Produto,
                            })
                        }
                    />
                    <ButtonEstoqueForm
                        icon={['fas', 'box']}
                        title="Materias-primas"
                        onPress={() =>
                            navigate('EstoqueGerenciamento', {
                                componenteEstoqueTipo:
                                    eComponenteEstoqueTipo.MateriaPrima,
                            })
                        }
                    />
                    <ButtonEstoqueForm
                        icon={['fas', 'cart-shopping']}
                        title="Compras"
                        onPress={() =>
                            navigate('EstoqueGerenciamento', {
                                componenteEstoqueTipo:
                                    eComponenteEstoqueTipo.Compras,
                            })
                        }
                    />
                </View>
            )}
            <ButtonEstoqueForm
                icon={expandido ? ['fas', 'minus'] : ['fas', 'plus']}
                onPress={() => setExpandido(estadoAtual => !estadoAtual)}
            />
        </View>
    );
}

export enum eComponenteEstoqueTipo {
    MateriaPrima = 'materia-prima',
    Produto = 'produto',
    Receita = 'receita',
    Compras = 'compras',
}

export interface FormularioEstoqueProp {
    id?: number;
    cancelado?: boolean;
}

interface FormularioMateriaPrimaLoadedProp extends FormularioEstoqueProp {
    itemEstoque: ItemEstoqueFormulario | null;
    gravaItemEstoque: (
        itemVisualizacao: ItemEstoqueFormulario,
    ) => Promise<void>;
    cancelar: () => void;
    confirmaGravar: () => void;
    displayMensagem: (mensagem: string, tipo: eModalTipo) => void;
    listaMedidasInfo: MedidaInfo[];
    cancelado?: boolean;
}

function FormularioMateriaPrimaLoaded({
    itemEstoque,
    gravaItemEstoque,
    cancelar,
    confirmaGravar,
    displayMensagem,
    listaMedidasInfo,
    cancelado,
}: FormularioMateriaPrimaLoadedProp) {
    let novoRegistro = (itemEstoque?.id ?? 0) === 0;

    const [medidaInp, setMedida] = useState(
        itemEstoque?.medida ?? getMedida(eMedida.unidade),
    );
    const [medValorInp, setMedValor] = useState(
        itemEstoque?.valorMediaUnidade.toFixed(2).replace('.', ',') ?? '',
    );
    const [qtdEstoqueInp, setQtdEstoque] = useState(
        itemEstoque?.qtd.toFixed(2).replace('.', ',') ?? '',
    );
    const [descricaoInp, setDescricao] = useState(itemEstoque?.descricao ?? '');

    const [aguardandoConfimacao, setAguardandoConfimacao] = useState(false);

    function validaValores() {
        if (descricaoInp.trim() === '') {
            return 'Informe valor para a nome da matéria-prima';
        }

        if (qtdEstoqueInp.trim() === '') {
            return 'Informe valor para a quantidade em estoque';
        }

        if (medValorInp.trim() === '') {
            return 'Informe valor para a média de preço';
        }

        let qtd = Number(
            qtdEstoqueInp.replaceAll('.', '').replace(',', '.').trim(),
        );

        if (Number.isNaN(qtd)) {
            return 'O valor informado para a quantidade em estoque é invalido';
        }

        if (Number.isNaN(qtd)) {
            return 'O valor informado para a quantidade em estoque é invalido';
        }

        let valorMediaUnidade = Number(
            medValorInp
                .replaceAll(/\.|R\$/g, '')
                .replaceAll(',', '.')
                .trim(),
        );

        if (Number.isNaN(valorMediaUnidade)) {
            return 'O valor informado para a média de preço é invalido';
        }

        return '';
    }

    const trataGravar = useCallback(
        (
            id: number,
            descricao: string,
            medida: Medida,
            qtdStr: string,
            valorMediaUnidadeStr: string,
        ) => {
            async function handleGravar() {
                let qtd = Number(
                    qtdStr.replaceAll('.', '').replace(',', '.').trim(),
                );

                let valorMediaUnidade = Number(
                    valorMediaUnidadeStr
                        .replaceAll(/\.|R\$/g, '')
                        .replaceAll(',', '.')
                        .trim(),
                );

                try {
                    await gravaItemEstoque({
                        id: id,
                        descricao: descricao,
                        medida: medida,
                        qtd: qtd,
                        valorMediaUnidade: valorMediaUnidade,
                    });

                    setAguardandoConfimacao(false);
                    displayMensagem(
                        'Foi gravado com sucesso',
                        eModalTipo.Sucesso,
                    );
                } catch (e) {
                    if (e instanceof Error) {
                        displayMensagem(e.message, eModalTipo.Erro);
                    }
                }
            }

            handleGravar();
        },
        [displayMensagem, gravaItemEstoque],
    );

    if (aguardandoConfimacao && cancelado !== undefined && !cancelado) {
        trataGravar(
            itemEstoque?.id ?? 0,
            descricaoInp,
            medidaInp,
            qtdEstoqueInp,
            medValorInp,
        );
    }

    return (
        <View>
            <Text>{novoRegistro ? 'Adição' : 'Edição'} Matéria-prima</Text>
            <View>
                <TextInput
                    placeholder="Nome matéria-prima"
                    value={descricaoInp}
                    onChangeText={setDescricao}
                    maxLength={50}
                />
                <View>
                    <MaskInput
                        mask={QtdMask}
                        placeholder="Quantidade estoque"
                        value={qtdEstoqueInp}
                        onChangeText={setQtdEstoque}
                        keyboardType="numeric"
                    />
                    <SelectList
                        setSelected={(val: number) => {
                            setMedida(getMedida(val));
                        }}
                        data={listaMedidasInfo}
                        defaultOption={listaMedidasInfo.find(
                            lmi => lmi.key === (medidaInp?.id ?? 1),
                        )}
                        save="key"
                        search={false}
                    />
                </View>
                <MaskInput
                    mask={Masks.BRL_CURRENCY}
                    placeholder={`Média preço por ${medidaInp.descricao}`}
                    value={medValorInp}
                    onChangeText={maskedValue =>
                        setMedValor(
                            maskedValue.trim() !== 'R$' ? maskedValue : '',
                        )
                    }
                    keyboardType="numeric"
                />
            </View>
            <Button
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
            />
            <Button title="Cancelar" onPress={cancelar} />
        </View>
    );
}

export function FormularioMateriaPrima({
    id,
    cancelado,
}: FormularioEstoqueProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [
        cancelar,
        confirmaGravar,
        displayMensagem,
        listaMedidasInfo,
        itemEstoque,
        gravaItemEstoque,
        loading,
    ] = useFormularioMateriaPrima(casoUsoInit, id);

    return (
        <View>
            {!loading ? (
                <FormularioMateriaPrimaLoaded
                    itemEstoque={itemEstoque}
                    gravaItemEstoque={gravaItemEstoque}
                    cancelar={cancelar}
                    confirmaGravar={confirmaGravar}
                    displayMensagem={displayMensagem}
                    listaMedidasInfo={listaMedidasInfo}
                    cancelado={cancelado}
                />
            ) : (
                <Text>loading</Text>
            )}
        </View>
    );
}

export function FormularioProduto({
    id,
}: FormularioEstoqueProp): React.JSX.Element {
    const navigation = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function handleCancelar() {
        navigation.goBack();
    }

    return (
        <View>
            <Text>{id ? 'Edição' : 'Adição'} Produto</Text>
            <View />
            <Button title="Cancelar" onPress={handleCancelar} />
        </View>
    );
}

export function FormularioReceita({
    id,
}: FormularioEstoqueProp): React.JSX.Element {
    const navigation = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function handleCancelar() {
        navigation.goBack();
    }
    return (
        <View>
            <Text>{id ? 'Edição' : 'Adição'} Receita</Text>
            <View />
            <Button title="Cancelar" onPress={handleCancelar} />
        </View>
    );
}

export function FormularioCompra({
    id,
}: FormularioEstoqueProp): React.JSX.Element {
    const navigation = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function handleCancelar() {
        navigation.goBack();
    }

    return (
        <View>
            <Text>{id ? 'Edição' : 'Adição'} Compra</Text>
            <View />
            <Button title="Cancelar" onPress={handleCancelar} />
        </View>
    );
}

export interface EstoqueModalOpcoesProp {
    id: number;
    cancelado?: boolean;
}

export function EstoqueModalOpcoesMateriaPrima({
    id,
    cancelado,
}: EstoqueModalOpcoesProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [deleta] = useDeletaMateriaPrima(casoUsoInit);
    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function editar() {
        navigate('EstoqueGerenciamento', {
            componenteEstoqueTipo: eComponenteEstoqueTipo.MateriaPrima,
            id: id,
        });
    }

    function confimaExclusao() {
        navigate('EstoqueModalInfo', {
            tipo: eModalTipo.Aviso,
            mensagem: 'Deseja cancelar a adição do novo registro?',
            redirecionaConfirma: 'EstoqueModalOpcoes',
            redirecionaCancela: 'EstoqueModalOpcoes',
        });
    }

    const trataExclui = useCallback(
        (idExclui: number, deletar: boolean) => {
            async function handleExclui() {
                if (!deletar) {
                    navigate('EstoqueVisualizacao');
                    return;
                }

                try {
                    await deleta(idExclui);
                    navigate('EstoqueVisualizacao');
                } catch (e) {
                    if (e instanceof Error) {
                        navigate('EstoqueModalInfo', {
                            tipo: eModalTipo.Erro,
                            mensagem: e.message,
                            redirecionaConfirma: 'EstoqueVisualizacao',
                        });
                    }
                }
            }

            handleExclui();
        },
        [deleta, navigate],
    );

    if (cancelado !== undefined) {
        trataExclui(id, !cancelado);
    }

    return (
        <View
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}>
            <Button title="Editar" onPress={editar} />
            <Button title="Excluir" onPress={confimaExclusao} />
        </View>
    );
}

export function EstoqueModalOpcoesProduto({
    id,
    cancelado,
}: EstoqueModalOpcoesProp): React.JSX.Element {
    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function editar() {
        navigate('EstoqueGerenciamento', {
            componenteEstoqueTipo: eComponenteEstoqueTipo.Produto,
            id: id,
        });
    }

    function excluir() {}

    return (
        <View
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}>
            <Button title="Editar" onPress={editar} />
            <Button title="Excluir" onPress={excluir} />
        </View>
    );
}

export function EstoqueModalOpcoesReceita({
    id,
    cancelado,
}: EstoqueModalOpcoesProp): React.JSX.Element {
    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function editar() {
        navigate('EstoqueGerenciamento', {
            componenteEstoqueTipo: eComponenteEstoqueTipo.Receita,
            id: id,
        });
    }

    function excluir() {}

    return (
        <View
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}>
            <Button title="Editar" onPress={editar} />
            <Button title="Excluir" onPress={excluir} />
        </View>
    );
}

export function EstoqueModalOpcoesCompra({
    id,
    cancelado,
}: EstoqueModalOpcoesProp): React.JSX.Element {
    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function editar() {
        navigate('EstoqueGerenciamento', {
            componenteEstoqueTipo: eComponenteEstoqueTipo.Compras,
            id: id,
        });
    }

    function excluir() {}

    return (
        <View
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}>
            <Button title="Editar" onPress={editar} />
            <Button title="Excluir" onPress={excluir} />
        </View>
    );
}
