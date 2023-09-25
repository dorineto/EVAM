import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from './Store';
import {ItemEstoque} from '../../Entidades/Item';
import {ItemEstoqueFormulario} from '../Controlles/EstoqueController';

export interface FormularioMateriaPrima {
    itemEstoque: ItemEstoque | null;
    itemEstoqueFormulario: ItemEstoqueFormulario | null;
}

export const EstoqueSlice = createSlice({
    name: 'estoque',
    initialState: {
        formularioMateriaPrima: <FormularioMateriaPrima>{
            itemEstoque: null,
            itemEstoqueFormulario: null,
        },
    },
    reducers: {
        setFormularioMateriaPrima: (state, action) => {
            state.formularioMateriaPrima = action.payload;
        },
    },
});

export const {setFormularioMateriaPrima} = EstoqueSlice.actions;

export const selectFormularioMateriaPrima = (state: RootState) =>
    state.estoque.formularioMateriaPrima;

export default EstoqueSlice.reducer;
