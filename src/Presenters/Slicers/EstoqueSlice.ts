import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from './Store';
import {ItemEstoque} from '../../Entidades/Item';
import {
    ItemEstoqueFormulario,
    OrdemCompraFormulario,
    OrdemCompraSerializada,
    ReceitaFormulario,
    ReceitaSerializada,
} from '../Controlles/EstoqueController';
import {
    OrdemVendaFormulario,
    OrdemVendaSerializada,
} from '../Controlles/VendasController';

export interface FormularioItemEstoque {
    itemEstoque: ItemEstoque | null;
    itemEstoqueFormulario: ItemEstoqueFormulario | null;
    isLoading: boolean;
}

export interface FormularioReceita {
    receitaSerializada: ReceitaSerializada | null;
    receitaFormulario: ReceitaFormulario | null;
    isLoading: boolean;
}

export interface FormularioOrdemCompra {
    ordemCompraSerializada: OrdemCompraSerializada | null;
    ordemCompraFormulario: OrdemCompraFormulario | null;
    isLoading: boolean;
}

export interface FormularioOrdemVenda {
    ordemVendaSerializada: OrdemVendaSerializada | null;
    ordemVendaFormulario: OrdemVendaFormulario | null;
    isLoading: boolean;
}

export const EstoqueSlice = createSlice({
    name: 'estoque',
    initialState: {
        formularioMateriaPrima: <FormularioItemEstoque>{
            itemEstoque: null,
            itemEstoqueFormulario: null,
            isLoading: true,
        },
        formularioProduto: <FormularioItemEstoque>{
            itemEstoque: null,
            itemEstoqueFormulario: null,
            isLoading: true,
        },
        formularioReceita: <FormularioReceita>{
            receitaSerializada: null,
            receitaFormulario: null,
            isLoading: true,
        },
        formularioOrdemCompra: <FormularioOrdemCompra>{
            ordemCompraSerializada: null,
            ordemCompraFormulario: null,
            isLoading: true,
        },
        formularioOrdemVenda: <FormularioOrdemVenda>{
            ordemVendaSerializada: null,
            ordemVendaFormulario: null,
            isLoading: true,
        },
    },
    reducers: {
        setFormularioMateriaPrima: (state, action) => {
            state.formularioMateriaPrima = action.payload;
        },
        setFormularioProduto: (state, action) => {
            state.formularioProduto = action.payload;
        },
        setFormularioReceita: (state, action) => {
            state.formularioReceita = action.payload;
        },
        setFormularioOrdemCompra: (state, action) => {
            state.formularioOrdemCompra = action.payload;
        },
        setFormularioOrdemVenda: (state, action) => {
            state.formularioOrdemVenda = action.payload;
        },
    },
});

export const {
    setFormularioMateriaPrima,
    setFormularioProduto,
    setFormularioReceita,
    setFormularioOrdemCompra,
    setFormularioOrdemVenda,
} = EstoqueSlice.actions;

export const selectFormularioMateriaPrima = (state: RootState) =>
    state.estoque.formularioMateriaPrima;

export const selectFormularioProduto = (state: RootState) =>
    state.estoque.formularioProduto;

export const selectFormularioReceita = (state: RootState) =>
    state.estoque.formularioReceita;

export const selectFormularioOrdemCompra = (state: RootState) =>
    state.estoque.formularioOrdemCompra;

export const selectFormularioOrdemVenda = (state: RootState) =>
    state.estoque.formularioOrdemVenda;

export default EstoqueSlice.reducer;
