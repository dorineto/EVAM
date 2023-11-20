import {Item, ItemEstoque, eItemTipo} from '../../Entidades/Item';
import {ItemRepositorio} from '../../Repositorios/ItemRepositorio';
import {EvamSqliteUtil} from './EvamSqliteUtil';

import {enablePromise} from 'react-native-sqlite-storage';
import {getMedida} from '../../Entidades/Medida';

interface ItemRegistro {
    item_id: number;
    tipo: eItemTipo;
    descricao: string;
    inclusao: string;
}

interface ItemEstoqueRegistro extends ItemRegistro {
    medida_id: number;
    qtd_estoque: number;
    med_valor_unid: number;
}

enablePromise(true);
export default class ItemRepositorioSQlite implements ItemRepositorio {
    private _sqliteUtil: EvamSqliteUtil;

    constructor(sqliteUtil: EvamSqliteUtil) {
        this._sqliteUtil = sqliteUtil;
    }

    async listaMateriasPrimas(): Promise<ItemEstoque[]> {
        return await this.listaItemEstoque(eItemTipo.MateriaPrima);
    }

    async listaProdutos(): Promise<ItemEstoque[]> {
        return await this.listaItemEstoque(eItemTipo.Produto);
    }

    private async listaItemEstoque(tipo: eItemTipo): Promise<ItemEstoque[]> {
        const connection = await this._sqliteUtil.getConnection();

        const [resultado] = await connection.executeSql(
            `select item_id
            ,descricao
            ,inclusao
            ,medida_id
            ,qtd_estoque
            ,med_valor_unid
            from Item 
            where item_tipo_id = ?;`,
            [<number>tipo],
        );

        const retorno: ItemEstoque[] = [];
        for (let i = 0; i < resultado.rows.length; i++) {
            const linha = resultado.rows.item(i);

            retorno.push(
                ItemRepositorioSQlite.traduzRegistroItemEstoque({
                    item_id: linha.item_id,
                    tipo: tipo,
                    descricao: linha.descricao,
                    inclusao: linha.inclusao,
                    medida_id: linha.medida_id,
                    med_valor_unid: linha.med_valor_unid,
                    qtd_estoque: linha.qtd_estoque,
                }),
            );
        }

        return retorno;
    }

    private static traduzRegistroItemEstoque(
        itemEstoqueRegistro: ItemEstoqueRegistro,
    ): ItemEstoque {
        return {
            item: ItemRepositorioSQlite.traduzRegistroItem(itemEstoqueRegistro),
            medida: getMedida(itemEstoqueRegistro.medida_id),
            qtd: itemEstoqueRegistro.qtd_estoque,
            valorMediaUnidade: itemEstoqueRegistro.med_valor_unid,
        };
    }

    private static traduzRegistroItem(itemRegistro: ItemRegistro): Item {
        return {
            id: itemRegistro.item_id,
            tipo: itemRegistro.tipo,
            descricao: itemRegistro.descricao,
            inclusao: itemRegistro.inclusao,
        };
    }

    async buscaMateriaPrima(id: number): Promise<ItemEstoque | null> {
        return await this.buscaItemEstoque(id, eItemTipo.MateriaPrima);
    }

    async buscaProduto(id: number): Promise<ItemEstoque | null> {
        return await this.buscaItemEstoque(id, eItemTipo.Produto);
    }

    private async buscaItemEstoque(
        id: number,
        tipo: eItemTipo,
    ): Promise<ItemEstoque | null> {
        const connection = await this._sqliteUtil.getConnection();

        const [resultado] = await connection.executeSql(
            `select item_id
            ,descricao
            ,inclusao
            ,medida_id
            ,qtd_estoque
            ,med_valor_unid
            from Item 
            where item_tipo_id = ?
              and item_id = ?;`,
            [tipo, id],
        );

        if (resultado.rows.length <= 0) {
            return null;
        }

        const linha = resultado.rows.item(0);

        return ItemRepositorioSQlite.traduzRegistroItemEstoque({
            item_id: linha.item_id,
            tipo: tipo,
            descricao: linha.descricao,
            inclusao: linha.inclusao,
            medida_id: linha.medida_id,
            med_valor_unid: linha.med_valor_unid,
            qtd_estoque: linha.qtd_estoque,
        });
    }

    async gravaMateriaPrima(item: ItemEstoque): Promise<number> {
        return await this.gravaItemEstoque(item);
    }

    async gravaProduto(item: ItemEstoque): Promise<number> {
        return await this.gravaItemEstoque(item);
    }

    private async gravaItemEstoque(item: ItemEstoque): Promise<number> {
        const connection = await this._sqliteUtil.getConnection();

        const [resultadoItemExiste] = await connection.executeSql(
            'select item_id from Item where item_id = ?;',
            [item.item.id],
        );

        const itemGravado = resultadoItemExiste.rows.length > 0;

        if (itemGravado) {
            await connection.executeSql(
                `update Item set descricao = ?,
                medida_id = ?,
                qtd_estoque = ?,
                med_valor_unid = ?
                where item_id = ?;`,
                [
                    item.item.descricao,
                    item.medida.id,
                    item.qtd,
                    item.valorMediaUnidade,
                    item.item.id,
                ],
            );

            return item.item.id;
        }

        const [resultadoUltimoId] = await connection.executeSql(
            'select max(item_id) ultimo_id from Item;',
            [],
        );

        let novoId = 1;
        if (resultadoUltimoId.rows.length > 0) {
            novoId = (resultadoUltimoId.rows.item(0).ultimo_id ?? 0) + 1;
        }

        await connection.executeSql(
            `insert or ignore into Item (
                item_id,
                medida_id,
                item_tipo_id,
                descricao,
                qtd_estoque,
                med_valor_unid
            )
            values
            (?, ?, ?, ?, ?, ?);`,
            [
                (item.item?.id ?? 0) > 0 ? item.item.id : novoId,
                item.medida.id,
                <number>item.item.tipo,
                item.item.descricao,
                item.qtd,
                item.valorMediaUnidade,
            ],
        );

        return novoId;
    }

    async deletaMateriaPrima(id: number): Promise<void> {
        await this.deletaItemEstoque(id);
    }

    async deletaProduto(id: number): Promise<void> {
        await this.deletaItemEstoque(id);
    }

    async deletaItemEstoque(id: number): Promise<void> {
        const connection = await this._sqliteUtil.getConnection();

        await connection.executeSql('delete from Item where item_id = ?', [id]);
    }

    async buscaItens(...ids: number[]): Promise<Item[]> {
        if (ids.length <= 0) {
            return [];
        }

        const connection = await this._sqliteUtil.getConnection();

        const [resultado] = await connection.executeSql(
            `select item_id,
            item_tipo_id,
            descricao,
            inclusao
            from Item 
            where item_id in (?);`,
            [ids.join(',')],
        );

        const retorno: Item[] = [];
        for (let i = 0; i < resultado.rows.length; i++) {
            const linha = resultado.rows.item(i);

            retorno.push(
                ItemRepositorioSQlite.traduzRegistroItem({
                    item_id: linha.item_id,
                    tipo: ItemRepositorioSQlite.traduzItemTipo(
                        linha.item_tipo_id,
                    ),
                    descricao: linha.descricao,
                    inclusao: linha.inclusao,
                }),
            );
        }

        return retorno;
    }

    private static traduzItemTipo(itemTipoId: number): eItemTipo {
        let retorno: eItemTipo;
        switch (itemTipoId) {
            case 1:
                retorno = eItemTipo.MateriaPrima;
                break;
            case 2:
                retorno = eItemTipo.Produto;
                break;
            default:
                throw new Error('Tipo de item não identificado');
        }

        return retorno;
    }
}
