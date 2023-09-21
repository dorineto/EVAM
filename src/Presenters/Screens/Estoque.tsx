import {Text, ScrollView, Button} from 'react-native';
import React from 'react';
import {useContext} from 'react';
import {
    ButtonAdicionaEstoque,
    EstoqueContainer,
    MateriaPrimaRegistro,
} from '../Componentes/ComponentesEstoque';
import {useVisualizaEstoque} from '../Controlles/EstoqueController';
import {CasoUso} from '../../App';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {EstoqueParamList, EstoqueStackProps} from '../Navigation/types';

function EstoqueVisualizacao() {
    const casoUsoInit = useContext(CasoUso);

    const [estoqueRegistro] = useVisualizaEstoque(casoUsoInit);

    return (
        <ScrollView
            contentContainerStyle={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100%',
                minWidth: '100%',
            }}>
            <Text style={{fontSize: 32}}>Estoque</Text>
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

function EstoqueGerenciamento() {
    const navigation = useNavigation<EstoqueStackProps['navigation']>();

    return (
        <ScrollView
            contentContainerStyle={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100%',
                minWidth: '100%',
            }}>
            <Text style={{fontSize: 32}}>Estoque Edit</Text>
            <Button title="Voltar" onPress={() => navigation.goBack()} />
        </ScrollView>
    );
}

const EstoqueStack = createNativeStackNavigator<EstoqueParamList>();
function Estoque() {
    return (
        <EstoqueStack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="EstoqueVisualizacao">
            <EstoqueStack.Screen
                name="EstoqueVisualizacao"
                component={EstoqueVisualizacao}
            />
            <EstoqueStack.Screen
                name="EstoqueGerenciamento"
                component={EstoqueGerenciamento}
            />
        </EstoqueStack.Navigator>
    );
}

export default Estoque;
