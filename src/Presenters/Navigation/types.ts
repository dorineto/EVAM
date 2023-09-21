import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type EstoqueParamList = {
    EstoqueVisualizacao: undefined;
    EstoqueGerenciamento: undefined;
};

export type EstoqueStackProps = NativeStackScreenProps<
    EstoqueParamList,
    'EstoqueVisualizacao',
    'EstoqueStack'
>;
