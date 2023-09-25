import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {eComponenteEstoqueTipo} from '../Componentes/ComponentesEstoque';

export type EstoqueParamList = {
    EstoqueVisualizacao: undefined;
    EstoqueGerenciamento: {
        componenteEstoqueTipo: eComponenteEstoqueTipo;
        id?: number;
        cancelado?: boolean;
    };
    EstoqueModalInfo: {
        tipo: eModalTipo;
        mensagem: string;
        redirecionaConfirma: EstoqueStackScreens;
        redirecionaCancela?: EstoqueStackScreens;
    };
    EstoqueModalOpcoes: {
        tipo: eComponenteEstoqueTipo;
        id: number;
        cancelado?: boolean;
    };
};

export type EstoqueStackScreens =
    | 'volta'
    | Omit<'EstoqueModalInfo', keyof EstoqueParamList>;

export enum eModalTipo {
    Sucesso = 1,
    Aviso = 2,
    Info = 3,
    Erro = 4,
}

// export type EstoqueVisualizacaoProps = NativeStackScreenProps<
//     EstoqueParamList,
//     'EstoqueVisualizacao',
//     'EstoqueStack'
// >;

export type EstoqueGerenciamentoProps = NativeStackScreenProps<
    EstoqueParamList,
    'EstoqueGerenciamento',
    'EstoqueStack'
>;

export type EstoqueModalInfoProps = NativeStackScreenProps<
    EstoqueParamList,
    'EstoqueModalInfo',
    'EstoqueStack'
>;

export type EstoqueModalOpcoesProps = NativeStackScreenProps<
    EstoqueParamList,
    'EstoqueModalOpcoes',
    'EstoqueStack'
>;
