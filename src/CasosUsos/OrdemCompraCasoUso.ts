import _ from 'lodash';
import {OrdemCompra} from '../Entidades/OrdemCompra';
import {OrdemCompraRepositorio} from '../Repositorios/OrdemCompraRepositorio';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';
import {ItemOrdem, eItemTipo} from '../Entidades/Item';

export class OrdemCompraCasoUso {
    private _ordemCompraRepositorio: OrdemCompraRepositorio;
    private _itemRepositorio: ItemRepositorio;

    constructor(
        ordemCompraRepositorio: OrdemCompraRepositorio,
        itemRepositorio: ItemRepositorio,
    ) {
        this._ordemCompraRepositorio = ordemCompraRepositorio;
        this._itemRepositorio = itemRepositorio;
    }

    async listaOrdemCompras(): Promise<OrdemCompra[]> {
        return await this._ordemCompraRepositorio.listaOrdemCompras();
    }

    async buscaOrdemCompra(id: number): Promise<OrdemCompra | null> {
        if (id <= 0) {
            return null;
        }

        return _.cloneDeep(
            await this._ordemCompraRepositorio.buscaOrdemCompra(id),
        );
    }

    private _calculaDiferencaItensCompra(
        itensCompradosAtuais: ItemOrdem[],
        itensCompradosGravados: ItemOrdem[] | null = null,
    ): {
        [id: number]: {id: number; tipo: eItemTipo; qtdAlterada: number};
    } {
        const itensCompradosGravadosTratado = itensCompradosGravados ?? [];

        const itensCompradosAtuaisDict = itensCompradosAtuais.reduce(
            (prevVal: {[id: number]: ItemOrdem}, currVal) => {
                prevVal[currVal.item.id] = currVal;
                return prevVal;
            },
            {},
        );

        let retorno: {
            [id: number]: {
                id: number;
                tipo: eItemTipo;
                qtdAlterada: number;
            };
        } = {};

        if (itensCompradosGravadosTratado.length > 0) {
            retorno = itensCompradosGravadosTratado.reduce(
                (
                    acumulador: {
                        [id: number]: {
                            id: number;
                            tipo: eItemTipo;
                            qtdAlterada: number;
                        };
                    },
                    valorAnterior,
                ) => {
                    const itemCompraQtdAtual =
                        itensCompradosAtuaisDict[valorAnterior.item.id]?.qtd ??
                        0;

                    acumulador[valorAnterior.item.id] = {
                        id: valorAnterior.item.id,
                        tipo: valorAnterior.item.tipo,
                        qtdAlterada: itemCompraQtdAtual - valorAnterior.qtd,
                    };

                    return acumulador;
                },
                {},
            );
        }

        for (let itemCompraAtual of itensCompradosAtuais) {
            if (retorno[itemCompraAtual.item.id]) {
                continue;
            }

            retorno[itemCompraAtual.item.id] = {
                id: itemCompraAtual.item.id,
                tipo: itemCompraAtual.item.tipo,
                qtdAlterada: itemCompraAtual.qtd,
            };
        }

        return retorno;
    }

    private _gravaOrdemCompraInvariantes(compra: OrdemCompra): string {
        if (compra.itensComprados.length === 0) {
            return 'A lista de itens comprados tem que conter pelo menos um item';
        }

        if (compra.itensComprados.some(ic => ic.item.id <= 0)) {
            return 'Item com id inválido';
        }

        if (compra.itensComprados.some(ic => ic.qtd <= 0)) {
            return 'A quantidade de itens comprados tem que ser superior a zero';
        }

        if (compra.itensComprados.some(ic => ic.valorTotal <= 0)) {
            return 'O valor total do item comprado tem que ser superior a zero';
        }

        return '';
    }

    async gravaOrdemCompra(compra: OrdemCompra): Promise<number> {
        const retornoChecagem = this._gravaOrdemCompraInvariantes(compra);
        if (retornoChecagem.trim() !== '') {
            throw new Error(retornoChecagem);
        }

        const itensCompradosGravados =
            compra.id > 0
                ? (
                      await this._ordemCompraRepositorio.buscaOrdemCompra(
                          compra.id,
                      )
                  )?.itensComprados
                : null;

        const itensCompradosInfo = this._calculaDiferencaItensCompra(
            compra.itensComprados,
            itensCompradosGravados,
        );

        const itensEstoqueComprados = await Promise.all(
            Object.values(itensCompradosInfo)
                .map(ici => {
                    return {id: ici.id, tipo: ici.tipo};
                })
                .map(ic => {
                    if (ic.tipo === eItemTipo.Produto) {
                        return this._itemRepositorio.buscaProduto(ic.id);
                    }

                    return this._itemRepositorio.buscaMateriaPrima(ic.id);
                }),
        );

        const itensEstoqueAtualizados = itensEstoqueComprados.map(iec => {
            if (!iec) {
                return null;
            }

            const {qtdAlterada} = itensCompradosInfo[iec.item.id];

            return {
                ...iec,
                qtd: iec.qtd + qtdAlterada > 0 ? iec.qtd + qtdAlterada : 0,
            };
        });

        for (let itemEstoqueAtualizado of itensEstoqueAtualizados) {
            if (!itemEstoqueAtualizado) {
                continue;
            }

            if (itemEstoqueAtualizado.item.tipo === eItemTipo.Produto) {
                await this._itemRepositorio.gravaProduto(itemEstoqueAtualizado);
            } else if (
                itemEstoqueAtualizado.item.tipo === eItemTipo.MateriaPrima
            ) {
                await this._itemRepositorio.gravaMateriaPrima(
                    itemEstoqueAtualizado,
                );
            }
        }

        return await this._ordemCompraRepositorio.gravaOrdemCompra(compra);
    }

    async deletaOrdemCompra(id: number): Promise<void> {
        if (id <= 0) {
            return;
        }

        return await this._ordemCompraRepositorio.deletaOrdemCompra(id);
    }
}
