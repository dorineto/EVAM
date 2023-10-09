import {ScrollView, View, TouchableWithoutFeedback} from 'react-native';
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
    OrdemCompraRegistro,
    ProdutoRegistro,
    ReceitaRegistro,
    eComponenteEstoqueTipo,
} from '../Componentes/ComponentesEstoque';
import {useVisualizaEstoque} from '../Controlles/EstoqueController';
import {CasoUso} from '../../App';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
    EstoqueGerenciamentoProps,
    EstoqueModalOpcoesProps,
    EstoqueParamList,
} from '../Navigation/types';
import {
    ModalInfo,
    styleScreenUtil,
    useScreenScrollViewHeight,
} from '../Componentes/Utils';

function EstoqueVisualizacao() {
    const casoUsoInit = useContext(CasoUso);

    const [estoqueRegistro] = useVisualizaEstoque(casoUsoInit);

    const scrowViewHeight = useScreenScrollViewHeight();

    return (
        <View>
            <ScrollView
                style={{maxHeight: scrowViewHeight}}
                contentContainerStyle={[
                    styleScreenUtil.alignCenter,
                    styleScreenUtil.screenContent,
                ]}>
                <EstoqueContainer title="Produtos">
                    {estoqueRegistro.produtos.map(produto => {
                        return (
                            <ProdutoRegistro
                                produto={produto}
                                key={produto.item.id}
                            />
                        );
                    })}
                </EstoqueContainer>
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
                <EstoqueContainer title="Receitas">
                    {estoqueRegistro.receitas.map(receita => {
                        return (
                            <ReceitaRegistro
                                receita={receita}
                                key={receita.id ?? 0}
                            />
                        );
                    })}
                </EstoqueContainer>
                <EstoqueContainer title="Compras">
                    {estoqueRegistro.compras.map(compra => {
                        return (
                            <OrdemCompraRegistro
                                compra={compra}
                                key={compra.id ?? 0}
                            />
                        );
                    })}
                </EstoqueContainer>
            </ScrollView>
            <ButtonAdicionaEstoque />
        </View>
    );
}

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
        case eComponenteEstoqueTipo.Receitas:
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

    const scrowViewHeight = useScreenScrollViewHeight();

    return (
        <ScrollView
            style={{maxHeight: scrowViewHeight}}
            contentContainerStyle={[
                styleScreenUtil.alignCenter,
                styleScreenUtil.screenContent,
            ]}>
            {formulario}
        </ScrollView>
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
        case eComponenteEstoqueTipo.Receitas:
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
            screenOptions={{
                headerShown: false,
            }}
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
                    component={ModalInfo}
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
