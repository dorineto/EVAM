import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from './Store';
import {ItemEstoque} from '../../Entidades/Item';
import {
    ItemEstoqueFormulario,
    ReceitaFormulario,
    ReceitaSerializada,
} from '../Controlles/EstoqueController';

export interface FormularioItemEstoque {
    itemEstoque: ItemEstoque | null;
    itemEstoqueFormulario: ItemEstoqueFormulario | null;
}

export interface FormularioReceita {
    receitaSerializada: ReceitaSerializada | null;
    receitaFormulario: ReceitaFormulario | null;
}

export const EstoqueSlice = createSlice({
    name: 'estoque',
    initialState: {
        formularioMateriaPrima: <FormularioItemEstoque>{
            itemEstoque: null,
            itemEstoqueFormulario: null,
        },
        formularioProduto: <FormularioItemEstoque>{
            itemEstoque: null,
            itemEstoqueFormulario: null,
        },
        formularioReceita: <FormularioReceita>{
            receitaSerializada: null,
            receitaFormulario: null,
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
    },
});

export const {
    setFormularioMateriaPrima,
    setFormularioProduto,
    setFormularioReceita,
} = EstoqueSlice.actions;

export const selectFormularioMateriaPrima = (state: RootState) =>
    state.estoque.formularioMateriaPrima;

export const selectFormularioProduto = (state: RootState) =>
    state.estoque.formularioProduto;

export const selectFormularioReceita = (state: RootState) =>
    state.estoque.formularioReceita;

export default EstoqueSlice.reducer;
