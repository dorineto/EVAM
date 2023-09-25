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
            contentContainerStyle={[styleEstoqueVisualizacao.alignTopCenter, styleEstoqueVisualizacao.containerFillScreen]}>
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
    containerFillScreen: {
        height: '100%',
        width: '100%',
    },
    alignTopCenter: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
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
            contentContainerStyle={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100%',
                minWidth: '100%',
            }}>
            {formulario}
        </ScrollView>
    );
}

function EstoqueModalInfo({
    navigation,
    route: {
        params: {tipo, mensagem, redirecionaConfirma, redirecionaCancela},
    },
}: EstoqueModalInfoProps) {
    let titulo: string;
    switch (tipo) {
        case eModalTipo.Sucesso:
            titulo = 'Sucesso';
            break;
        case eModalTipo.Aviso:
            titulo = 'Atenção';
            break;
        case eModalTipo.Info:
            titulo = 'Informativo';
            break;
        case eModalTipo.Erro:
            titulo = 'Erro';
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
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100%',
                minWidth: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                }}>
                <Text style={{fontSize: 16}}>{titulo}</Text>
                <Text>{mensagem}</Text>
                <Button title="Confirmar" onPress={() => handlePress(false)} />
                {tipo === eModalTipo.Aviso && (
                    <Button
                        title="Cancelar"
                        onPress={() => handlePress(true)}
                    />
                )}
            </View>
        </View>
    );
}

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
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    minHeight: '100%',
                    minWidth: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}>
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
