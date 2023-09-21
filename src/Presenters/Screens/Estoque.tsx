import {Text, ScrollView, View} from 'react-native';
import React from 'react';
import {useContext} from 'react';
import {
    EstoqueContainer,
    MateriaPrimaRegistro,
} from '../Componentes/ComponentesEstoque';
import {useVisualizaEstoque} from '../Controlles/EstoqueController';
import {CasoUso} from '../../App';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

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
        </ScrollView>
    );
}

function EstoqueEdicao() {
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
        </ScrollView>
    );
}

const EstoqueStack = createNativeStackNavigator();

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
                name="EstoqueEdicao"
                component={EstoqueEdicao}
            />
        </EstoqueStack.Navigator>
    );
}

export default Estoque;
