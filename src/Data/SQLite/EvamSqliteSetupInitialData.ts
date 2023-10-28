import {listaMateriaPrima, listaProdutos} from '../Stub/InitialDataStub';
import ItemRepositorioSQlite from './ItemRepositorioSQlite';

export type SetupInitialDataSQLiteParams = {
    itemRepositorio: ItemRepositorioSQlite;
};

export async function setupInitialDataSQLite({
    itemRepositorio,
}: SetupInitialDataSQLiteParams) {
    for (let item of listaMateriaPrima) {
        await itemRepositorio.gravaMateriaPrima(item);
    }

    for (let item of listaProdutos) {
        await itemRepositorio.gravaProduto(item);
    }
}
