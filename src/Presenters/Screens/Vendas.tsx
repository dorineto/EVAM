import {View, Text} from 'react-native';
import React from 'react';

function Vendas() {
    return (
        <View
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100%',
                minWidth: '100%',
            }}>
            <Text style={{fontSize: 32}}>Vendas</Text>
        </View>
    );
}

export default Vendas;
