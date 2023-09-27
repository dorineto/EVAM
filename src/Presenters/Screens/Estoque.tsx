import {
    Text,
    ScrollView,
    Button,
    View,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import React from 'react';
import {useContext} from 'react';
import {
    ButtonAdicionaEstoque,
    ButtonWithStyle,
    EstoqueContainer,
    EstoqueModalOpcoesCompra,
    EstoqueModalOpcoesMateriaPrima,
    EstoqueModalOpcoesProduto,
    EstoqueModalOpcoesReceita,
    FormularioCompra,
    FormularioMateriaPrima,
    FormularioProduto,
    FormularioReceita,
    MateriaPrimaRegistro,
    eComponenteEstoqueTipo,
    styleUtil,
} from '../Componentes/ComponentesEstoque';
import {useVisualizaEstoque} from '../Controlles/EstoqueController';
import {CasoUso} from '../../App';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
    EstoqueGerenciamentoProps,
    EstoqueModalOpcoesProps,
    EstoqueModalInfoProps,
    EstoqueParamList,
    eModalTipo,
} from '../Navigation/types';
import {CommonActions} from '@react-navigation/native';

function EstoqueVisualizacao() {
    const casoUsoInit = useContext(CasoUso);

    const [estoqueRegistro] = useVisualizaEstoque(casoUsoInit);

    return (
        <ScrollView
            contentContainerStyle={[
                styleScreenUtil.alignTopCenter,
                styleScreenUtil.containerFillScreenHorizontal,
                styleEstoqueVisualizacao.containerEstoqueVisualizacao,
            ]}>
            <EstoqueContainer title="Matérias-primas">
                {estoqueRegistro.materiasPrimas.map(materiaPrima => {
                    return (
                        <MateriaPrimaRegistro
                            materiaPrima={materiaPrima}
                            key={materiaPrima.item.id}
                        />
                    );
                })}
            </EstoqueContainer>
            <ButtonAdicionaEstoque />
        </ScrollView>
    );
}

const styleEstoqueVisualizacao = StyleSheet.create({
    containerEstoqueVisualizacao: {
        gap: 20,
        padding: 20,
    },
});

export const styleScreenUtil = StyleSheet.create({
    containerFillScreen: {
        height: '100%',
        width: '100%',
    },
    containerFillScreenHorizontal: {
        width: '100%',
    },
    alignTopCenter: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    alignBottomCenter: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    alignCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundOpaque: {backgroundColor: 'rgba(0, 0, 0, 0.3)'},
});

function EstoqueGerenciamento({
    route: {
        params: {componenteEstoqueTipo: componenteEstoqueTipo, id, cancelado},
    },
}: EstoqueGerenciamentoProps) {
    let formulario: React.JSX.Element;

    switch (componenteEstoqueTipo) {
        case eComponenteEstoqueTipo.MateriaPrima:
            formulario = (
                <FormularioMateriaPrima id={id} cancelado={cancelado} />
            );
            break;
        case eComponenteEstoqueTipo.Produto:
            formulario = <FormularioProduto id={id} cancelado={cancelado} />;
            break;
        case eComponenteEstoqueTipo.Receita:
            formulario = <FormularioReceita id={id} cancelado={cancelado} />;
            break;
        case eComponenteEstoqueTipo.Compras:
            formulario = <FormularioCompra id={id} cancelado={cancelado} />;
            break;
        default:
            throw new Error(
                `Tipo componente não encontrado ${componenteEstoqueTipo}`,
            );
    }

    return (
        <ScrollView
            contentContainerStyle={[
                styleScreenUtil.alignTopCenter,
                styleScreenUtil.containerFillScreen,
                styleEstoqueGerenciamento.containerEstoqueGerenciamento,
            ]}>
            {formulario}
        </ScrollView>
    );
}

const styleEstoqueGerenciamento = StyleSheet.create({
    containerEstoqueGerenciamento: {
        gap: 20,
        padding: 20,
    },
});

function EstoqueModalInfo({
    navigation,
    route: {
        params: {tipo, mensagem, redirecionaConfirma, redirecionaCancela},
    },
}: EstoqueModalInfoProps) {
    let titulo: string;
    let tituloStyle: object;
    switch (tipo) {
        case eModalTipo.Sucesso:
            titulo = 'Sucesso';
            tituloStyle = styleEstoqueModalInfo.titleSucesso;
            break;
        case eModalTipo.Aviso:
            titulo = 'Atenção';
            tituloStyle = styleEstoqueModalInfo.titleAtencao;
            break;
        case eModalTipo.Info:
            titulo = 'Informativo';
            tituloStyle = styleEstoqueModalInfo.titleInformativo;
            break;
        case eModalTipo.Erro:
            titulo = 'Erro';
            tituloStyle = styleEstoqueModalInfo.titleErro;
            break;
        default:
            throw new Error('Tipo modal não identificado');
    }

    function handlePress(cancela: boolean) {
        let redirecionaAcao = cancela
            ? redirecionaCancela ?? 'volta'
            : redirecionaConfirma;

        switch (redirecionaAcao) {
            case 'volta':
                navigation.goBack();
                break;
            case 'EstoqueVisualizacao':
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'EstoqueVisualizacao',
                        params: {cancelado: cancela},
                        merge: true,
                    }),
                );
                break;
            case 'EstoqueGerenciamento':
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'EstoqueGerenciamento',
                        params: {cancelado: cancela},
                        merge: true,
                    }),
                );
                break;
            case 'EstoqueModalOpcoes':
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'EstoqueModalOpcoes',
                        params: {cancelado: cancela},
                        merge: true,
                    }),
                );
                break;
            default:
                throw new Error('Ação de redirecionamento não identificado');
        }
    }

    return (
        <View
            style={[
                styleScreenUtil.alignCenter,
                styleScreenUtil.containerFillScreen,
                styleScreenUtil.backgroundOpaque,
            ]}>
            <View
                style={[
                    styleScreenUtil.alignCenter,
                    styleEstoqueModalInfo.containerModal,
                ]}>
                <Text
                    style={[
                        styleUtil.titleText,
                        styleEstoqueModalInfo.titleModal,
                        tituloStyle,
                    ]}>
                    {titulo}
                </Text>
                <View
                    style={[
                        styleUtil.alignCenter,
                        styleEstoqueModalInfo.contentContainerModal,
                    ]}>
                    <Text
                        style={[
                            styleUtil.contentText,
                            styleEstoqueModalInfo.messageModal,
                        ]}>
                        {mensagem}
                    </Text>
                    <ButtonWithStyle
                        title="Confirmar"
                        onPress={() => handlePress(false)}
                        style={[styleUtil.button, styleUtil.actionButton]}
                    />
                    {tipo === eModalTipo.Aviso && (
                        <ButtonWithStyle
                            title="Cancelar"
                            onPress={() => handlePress(true)}
                            style={[styleUtil.button, styleUtil.cancelaButton]}
                        />
                    )}
                </View>
            </View>
        </View>
    );
}

const styleEstoqueModalInfo = StyleSheet.create({
    containerModal: {
        backgroundColor: '#E2E2E2',
        borderColor: '#D8D8D8',
        borderWidth: 2,
        borderRadius: 15,
        padding: 20,
        width: '80%',
        gap: 10,
    },
    contentContainerModal: {
        width: '90%',
        gap: 10,
    },
    titleModal: {
        width: '100%',
        padding: 10,
        borderRadius: 50,
        color: '#fff',
    },
    titleAtencao: {
        backgroundColor: '#E58298',
    },
    titleInformativo: {
        backgroundColor: '#8E49A9',
    },
    titleSucesso: {
        backgroundColor: '#BC8ECF',
    },
    titleErro: {
        backgroundColor: '#D84061',
    },
    messageModal: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});

function EstoqueModalOpcoes({
    navigation: navigation,
    route: {
        params: {tipo, id, cancelado},
    },
}: EstoqueModalOpcoesProps) {
    let opcoesElement: React.JSX.Element;
    switch (tipo) {
        case eComponenteEstoqueTipo.MateriaPrima:
            opcoesElement = (
                <EstoqueModalOpcoesMateriaPrima id={id} cancelado={cancelado} />
            );
            break;
        case eComponenteEstoqueTipo.Produto:
            opcoesElement = (
                <EstoqueModalOpcoesProduto id={id} cancelado={cancelado} />
            );
            break;
        case eComponenteEstoqueTipo.Receita:
            opcoesElement = (
                <EstoqueModalOpcoesReceita id={id} cancelado={cancelado} />
            );
            break;
        case eComponenteEstoqueTipo.Compras:
            opcoesElement = (
                <EstoqueModalOpcoesCompra id={id} cancelado={cancelado} />
            );
            break;
        default:
            throw new Error('Tipo de estoque não identificado');
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => navigation.navigate('EstoqueVisualizacao')}>
            <View
                style={[
                    styleScreenUtil.alignBottomCenter,
                    styleScreenUtil.containerFillScreen,
                    styleScreenUtil.backgroundOpaque,
                ]}>
                {opcoesElement}
            </View>
        </TouchableWithoutFeedback>
    );
}

const EstoqueStack = createNativeStackNavigator<EstoqueParamList>();
function Estoque() {
    return (
        <EstoqueStack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="EstoqueVisualizacao">
            <EstoqueStack.Group>
                <EstoqueStack.Screen
                    name="EstoqueVisualizacao"
                    component={EstoqueVisualizacao}
                />
                <EstoqueStack.Screen
                    name="EstoqueGerenciamento"
                    component={EstoqueGerenciamento}
                />
            </EstoqueStack.Group>
            <EstoqueStack.Group
                screenOptions={{
                    presentation: 'transparentModal',
                }}>
                <EstoqueStack.Screen
                    name="EstoqueModalInfo"
                    component={EstoqueModalInfo}
                />
                <EstoqueStack.Screen
                    name="EstoqueModalOpcoes"
                    component={EstoqueModalOpcoes}
                />
            </EstoqueStack.Group>
        </EstoqueStack.Navigator>
    );
}

export default Estoque;
