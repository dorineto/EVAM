import React from 'react';
import {PropsWithChildren} from 'react';
import {View, Text} from 'react-native';
import {ItemEstoque} from '../../Entidades/Item';

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

// const style = StyleSheet.create({
//     estoqueContainer: {
//         display: 'flex',
//         flexDirection: 'row',
//     }
// });