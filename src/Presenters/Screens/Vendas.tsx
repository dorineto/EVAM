import {
    ScrollView,
    View,
    TouchableWithoutFeedback,
    Text,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import React from 'react';
import {useContext} from 'react';
import {CasoUso} from '../../App';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
    VendaGerenciamentoProps,
    VendaModalOpcoesProps,
    VendaParamList,
} from '../Navigation/types';
import {
    ModalInfo,
    styleScreenUtil,
    styleUtil,
    useScreenScrollViewHeight,
} from '../Componentes/Utils';
import {useVisualizaVendas} from '../Controlles/VendasController';
import {
    ButtonAdicionaVenda,
    FormularioVenda,
    VendaModalOpcoesVenda,
    VendasRegistroContainer,
} from '../Componentes/ComponentesVendas';

function VendaVisualizacao() {
    const casoUsoInit = useContext(CasoUso);

    const [vendasRegistro] = useVisualizaVendas(casoUsoInit);

    const scrowViewHeight = useScreenScrollViewHeight();

    return (
        <View>
            <ScrollView
                style={{height: scrowViewHeight}}
                contentContainerStyle={[
                    styleScreenUtil.alignCenter,
                    styleScreenUtil.screenContent,
                ]}>
                <Text
                    style={[
                        styleUtil.titleText,
                        styleUtil.textAlignCenter,
                        styleVendaVisualizacao.title,
                    ]}>
                    Vendas
                </Text>
                <VendasRegistroContainer vendas={vendasRegistro.vendas} />
            </ScrollView>
            <ButtonAdicionaVenda />
        </View>
    );
}

const styleVendaVisualizacao = StyleSheet.create({
    title: {
        width: '100%',
        padding: 10,
        color: '#fff',
        backgroundColor: '#8E49A9',
        borderColor: '#8944A4',
        borderWidth: 2,
        borderRadius: 30,
    },
});

function VendaGerenciamento({
    route: {
        params: {id, cancelado},
    },
}: VendaGerenciamentoProps) {
    const scrowViewHeight = useScreenScrollViewHeight();
    const {width} = useWindowDimensions();

    return (
        <ScrollView
            style={{height: scrowViewHeight, width: width}}
            contentContainerStyle={[
                styleScreenUtil.alignCenter,
                styleScreenUtil.screenContent,
            ]}>
            <FormularioVenda id={id} cancelado={cancelado} />
        </ScrollView>
    );
}

function VendaModalOpcoes({
    navigation: navigation,
    route: {
        params: {id, cancelado},
    },
}: VendaModalOpcoesProps) {
    return (
        <TouchableWithoutFeedback
            onPress={() => navigation.navigate('VendaVisualizacao')}>
            <View
                style={[
                    styleScreenUtil.alignBottomCenter,
                    styleScreenUtil.containerFillScreen,
                    styleScreenUtil.backgroundOpaque,
                ]}>
                <VendaModalOpcoesVenda id={id} cancelado={cancelado} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const VendasStack = createNativeStackNavigator<VendaParamList>();
function Vendas() {
    return (
        <VendasStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="VendaVisualizacao">
            <VendasStack.Group>
                <VendasStack.Screen
                    name="VendaVisualizacao"
                    component={VendaVisualizacao}
                />
                <VendasStack.Screen
                    name="VendaGerenciamento"
                    component={VendaGerenciamento}
                />
            </VendasStack.Group>
            <VendasStack.Group
                screenOptions={{
                    presentation: 'transparentModal',
                }}>
                <VendasStack.Screen
                    name="VendaModalInfo"
                    component={ModalInfo}
                />
                <VendasStack.Screen
                    name="VendaModalOpcoes"
                    component={VendaModalOpcoes}
                />
            </VendasStack.Group>
        </VendasStack.Navigator>
    );
}

export default Vendas;
