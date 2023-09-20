import {Text, ScrollView} from 'react-native';
import React from 'react';
import {useContext} from 'react';
import {
    EstoqueContainer,
    MateriaPrimaRegistro,
} from '../Componentes/ComponentesEstoque';
import {useVisualizaEstoque} from '../Controlles/EstoqueController';
import {CasoUso} from '../../App';

function Estoque() {
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

export default Estoque;
