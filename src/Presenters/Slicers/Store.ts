import {configureStore} from '@reduxjs/toolkit';
import estoqueSliceReducer from './EstoqueSlice';
import {useDispatch} from 'react-redux';

export const Store = configureStore({
    reducer: {estoque: estoqueSliceReducer},
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispath = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch<typeof Store.dispatch>();
