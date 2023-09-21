import React, {useState} from 'react';
import {PropsWithChildren} from 'react';
import {View, Text, Button} from 'react-native';
import {ItemEstoque} from '../../Entidades/Item';
import {useNavigation} from '@react-navigation/native';
import type {EstoqueStackProps} from '../Screens/Estoque';

export type EstoqueContainerProps = {
    title: string;
};

export function EstoqueContainer({
    title,
    children,
}: PropsWithChildren<EstoqueContainerProps>): React.JSX.Element {
    return (
        <View>
            <Text>{title}</Text>
            <View>{children}</View>
            <View>
                <Text>BTN</Text>
            </View>
        </View>
    );
}

export type MateriaPrimaRegistroProps = {
    materiaPrima: ItemEstoque;
};

export function MateriaPrimaRegistro({
    materiaPrima,
}: MateriaPrimaRegistroProps): React.JSX.Element {
    return (
        <View>
            <Text>{materiaPrima.item.descricao}</Text>
            <View>
                <Text>R$ {materiaPrima.valorMediaUnidade.toFixed(2)}</Text>
                <Text>
                    {materiaPrima.qtd} {materiaPrima.medida.abreviacao}
                </Text>
            </View>
            <Text>{'\n\n'}</Text>
        </View>
    );
}

export function ButtonAdicionaEstoque(): React.JSX.Element {
    const [expandido, setExpandido] = useState(false);

    const {navigate} = useNavigation<EstoqueStackProps['navigation']>();

    return (
        <View>
            {expandido && (
                <View>
                    <Button
                        title="R"
                        onPress={() => navigate('EstoqueGerenciamento')}
                    />
                    <Button
                        title="P"
                        onPress={() => navigate('EstoqueGerenciamento')}
                    />
                    <Button
                        title="M"
                        onPress={() => navigate('EstoqueGerenciamento')}
                    />
                    <Button
                        title="C"
                        onPress={() => navigate('EstoqueGerenciamento')}
                    />
                </View>
            )}
            <Button
                title={expandido ? '-' : '+'}
                onPress={() => setExpandido(estadoAtual => !estadoAtual)}
            />
        </View>
    );
}
