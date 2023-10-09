import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {eComponenteEstoqueTipo} from '../Componentes/ComponentesEstoque';
import {eModalTipo} from '../Componentes/Utils';

type ModalInfo = {
    tipo: eModalTipo;
    mensagem: string;
    redirecionaConfirma: EstoqueStackScreens;
    redirecionaCancela?: EstoqueStackScreens;
};

export type EstoqueParamList = {
    EstoqueVisualizacao: undefined;
    EstoqueGerenciamento: {
        componenteEstoqueTipo: eComponenteEstoqueTipo;
        id?: number;
        cancelado?: boolean;
    };
    EstoqueModalInfo: ModalInfo;
    EstoqueModalOpcoes: {
        tipo: eComponenteEstoqueTipo;
        id: number;
        cancelado?: boolean;
    };
};

export type VendaParamList = {
    VendaVisualizacao: undefined;
    VendaGerenciamento: {
        id?: number;
        cancelado?: boolean;
    };
    VendaModalInfo: ModalInfo;
    VendaModalOpcoes: {
        id: number;
        cancelado?: boolean;
    };
};

export type EstoqueStackScreens =
    | 'volta'
    | Omit<'EstoqueModalInfo', keyof EstoqueParamList>
    | Omit<'VendaModalInfo', keyof VendaParamList>;

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

export type VendaGerenciamentoProps = NativeStackScreenProps<
    VendaParamList,
    'VendaGerenciamento',
    'VendaStack'
>;

export type VendaModalInfoProps = NativeStackScreenProps<
    VendaParamList,
    'VendaModalInfo',
    'VendaStack'
>;

export type VendaModalOpcoesProps = NativeStackScreenProps<
    VendaParamList,
    'VendaModalOpcoes',
    'VendaStack'
>;
