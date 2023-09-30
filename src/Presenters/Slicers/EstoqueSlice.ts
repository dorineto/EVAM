import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from './Store';
import {ItemEstoque} from '../../Entidades/Item';
import {ItemEstoqueFormulario} from '../Controlles/EstoqueController';

export interface FormularioItemEstoque {
    itemEstoque: ItemEstoque | null;
    itemEstoqueFormulario: ItemEstoqueFormulario | null;
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
    },
    reducers: {
        setFormularioMateriaPrima: (state, action) => {
            state.formularioMateriaPrima = action.payload;
        },
        setFormularioProduto: (state, action) => {
            state.formularioProduto = action.payload;
        },
    },
});

export const {setFormularioMateriaPrima, setFormularioProduto} =
    EstoqueSlice.actions;

export const selectFormularioMateriaPrima = (state: RootState) =>
    state.estoque.formularioMateriaPrima;

export const selectFormularioProduto = (state: RootState) =>
    state.estoque.formularioProduto;

export default EstoqueSlice.reducer;
