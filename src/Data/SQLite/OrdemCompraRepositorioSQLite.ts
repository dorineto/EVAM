import _ from 'lodash';
import {OrdemCompra} from '../../Entidades/OrdemCompra';
import {OrdemCompraRepositorio} from '../../Repositorios/OrdemCompraRepositorio';
import {Item, ItemEstoque, ItemOrdem, eItemTipo} from '../../Entidades/Item';
import {ItemRepositorio} from '../../Repositorios/ItemRepositorio';
import {EvamSqliteUtil} from './EvamSqliteUtil';
import {getMedida} from '../../Entidades/Medida';
import {ResultSet} from 'react-native-sqlite-storage';

type ItemCompraRegistro = {
    ordem_compra_id: number;
    item_id: number;
    medida_id: number;
    valor_total: number;
    qtd_comprado: number;
};

type OrdemCompraRegistro = {
    ordem_compra_id: number;
    inclusao: string;
};

export class OrdemCompraRepositorioSQlite implements OrdemCompraRepositorio {
    private _sqliteUtil: EvamSqliteUtil;
    private _itemRepositorio: ItemRepositorio;

    constructor(sqliteUtil: EvamSqliteUtil, itemRepositorio: ItemRepositorio) {
        this._sqliteUtil = sqliteUtil;
        this._itemRepositorio = itemRepositorio;
    }

    private async buscaItensCompra(
        ...compraIds: number[]
    ): Promise<Map<number, ItemOrdem[]>> {
        const connection = await this._sqliteUtil.getConnection();

        let resultadoItemCompra: ResultSet;

        if (compraIds.length === 0) {
            [resultadoItemCompra] = await connection.executeSql(
                `select ordem_compra_id,
                item_id,
                medida_id,
                valor_total,
                qtd_comprado,
                from Item_compra`,
                [],
            );
        } else {
            [resultadoItemCompra] = await connection.executeSql(
                `select ordem_compra_id,
                item_id,
                medida_id,
                valor_total,
                qtd_comprado,
                from Item_compra
                where ordem_compra_id in (?)`,
                [compraIds.join(',')],
            );
        }

        const itensCompraInfo: ItemCompraRegistro[] = [];
        for (let i = 0; i < resultadoItemCompra.rows.length; i++) {
            const linha = resultadoItemCompra.rows.item(i);

            itensCompraInfo.push({
                ordem_compra_id: linha.ordem_compra_id,
                item_id: linha.item_id,
                medida_id: linha.medida_id,
                valor_total: linha.valor_total,
                qtd_comprado: linha.qtd_comprado,
            });
        }

        const itensBuscados = (
            await this._itemRepositorio.buscaItens(
                ...new Set(itensCompraInfo.map(ici => ici.item_id)),
            )
        ).reduce((acc, i) => {
            acc.set(i.id, i);
            return acc;
        }, new Map<number, Item>());

        const retorno = new Map<number, ItemOrdem[]>();
        for (let itemCompraInfo of itensCompraInfo) {
            const item = itensBuscados.get(itemCompraInfo.item_id);

            if (!item) {
                throw new Error('Item não identificado');
            }

            const itemOrdemCompra =
                OrdemCompraRepositorioSQlite.traduzItemCompraRegistro(
                    itemCompraInfo,
                    item,
                );

            if (!retorno.has(itemCompraInfo.ordem_compra_id)) {
                retorno.set(itemCompraInfo.ordem_compra_id, []);
            }

            retorno.get(itemCompraInfo.ordem_compra_id)?.push(itemOrdemCompra);
        }

        return retorno;
    }

    private static traduzItemCompraRegistro(
        itemCompra: ItemCompraRegistro,
        item: Item,
    ): ItemOrdem {
        if (itemCompra.item_id !== item.id) {
            throw new Error(
                'O item informado não corresponde com o item da compra',
            );
        }

        return {
            item: {...item},
            medida: getMedida(itemCompra.medida_id),
            qtd: itemCompra.qtd_comprado,
            valorTotal: itemCompra.valor_total,
        };
    }

    async listaOrdemCompras(): Promise<OrdemCompra[]> {
        const itensCompras = await this.buscaItensCompra();

        const connection = await this._sqliteUtil.getConnection();

        /*
        private _id: number;
        private _itensComprados: ItemOrdem[];
        private _inclusao: string;

        create table if not exists Ordem_compra (
            ordem_compra_id int NOT NULL primary key,
            valor_total numeric(10,2) not null,
            inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP
        );
        */

        const [resultadoOrdemCompra] = await connection.executeSql(
            `select ordem_compra_id,
            inclusao,
            from Ordem_compra`,
            [],
        );

        const compras: OrdemCompraRegistro[] = [];
        for (let i = 0; i < resultadoOrdemCompra.rows.length; i++) {
            const linha = resultadoOrdemCompra.rows.item(i);

            compras.push({
                ordem_compra_id: linha.ordem_compra_id,
                inclusao: linha.inclusao,
            });
        }

        return compras.map(c => {
            const itensCompra = itensCompras.get(c.ordem_compra_id);

            if (!itensCompra) {
                throw new Error(
                    `Compra ${c.ordem_compra_id} não tem itens comprados`,
                );
            }

            return OrdemCompraRepositorioSQlite.traduzRegistroOrdemCompra(
                c,
                itensCompra,
            );
        });
    }

    async buscaOrdemCompra(id: number): Promise<OrdemCompra | null> {
        const itensCompras = await this.buscaItensCompra(id);

        const connection = await this._sqliteUtil.getConnection();

        /*
        private _id: number;
        private _itensComprados: ItemOrdem[];
        private _inclusao: string;

        create table if not exists Ordem_compra (
            ordem_compra_id int NOT NULL primary key,
            valor_total numeric(10,2) not null,
            inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP
        );
        */

        const [resultadoOrdemCompra] = await connection.executeSql(
            `select ordem_compra_id,
            inclusao,
            from Ordem_compra
            where ordem_compra_id = ?`,
            [id],
        );

        const linha = resultadoOrdemCompra.rows.item(0);

        const compra: OrdemCompraRegistro = {
            ordem_compra_id: linha.ordem_compra_id,
            inclusao: linha.inclusao,
        };

        const itensCompra = itensCompras.get(compra.ordem_compra_id);

        if (!itensCompra) {
            throw new Error(
                `Compra ${compra.ordem_compra_id} não tem itens comprados`,
            );
        }

        return OrdemCompraRepositorioSQlite.traduzRegistroOrdemCompra(
            compra,
            itensCompra,
        );
    }

    private static traduzRegistroOrdemCompra(
        compraRegistro: OrdemCompraRegistro,
        itensCompra: ItemOrdem[],
    ): OrdemCompra {
        return new OrdemCompra(
            compraRegistro.ordem_compra_id,
            itensCompra,
            new Date(compraRegistro.inclusao),
        );
    }

    async gravaOrdemCompra(compra: OrdemCompra): Promise<number> {
        let compraGravada =
            this._ordemComprasGravadas.find(ocg => ocg.id === compra.id) ??
            _.cloneDeep(compra);

        const itensEstoqueComprados: {[id: number]: ItemEstoque} = {};

        for (let item of compra.itensComprados) {
            let itemBuscado: ItemEstoque | null = null;

            if (item.item.tipo === eItemTipo.MateriaPrima) {
                itemBuscado = await this._itemRepositorio.buscaMateriaPrima(
                    item.item.id,
                );
            } else {
                itemBuscado = await this._itemRepositorio.buscaProduto(
                    item.item.id,
                );
            }

            if (!itemBuscado) {
                throw new Error(`Item não encontrado: ID=${item.item.id}`);
            }

            itensEstoqueComprados[itemBuscado.item.id] = itemBuscado;
        }

        const itensCompradosGrava: ItemOrdem[] = compra.itensComprados.map(
            ic => {
                return {
                    ...ic,
                    item: itensEstoqueComprados[ic.item.id].item,
                };
            },
        );

        compraGravada.inclusao = compra.inclusao;
        compraGravada.itensComprados = itensCompradosGrava;

        if (compraGravada.id === 0) {
            const id =
                Math.max(...this._ordemComprasGravadas.map(r => r.id)) + 1;

            compraGravada.id = id;

            this._ordemComprasGravadas.push(compraGravada);
        }

        return compraGravada.id;
    }

    async deletaOrdemCompra(id: number): Promise<void> {
        this._ordemComprasGravadas = this._ordemComprasGravadas.filter(
            ocg => ocg.id !== id,
        );
    }
}
