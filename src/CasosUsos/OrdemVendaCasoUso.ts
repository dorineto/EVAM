import _ from 'lodash';
import {Cliente} from '../Entidades/Cliente';
import {Local} from '../Entidades/Local';
import {OrdemVenda} from '../Entidades/OrdemVenda';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';
import {OrdemVendaRepositorio} from '../Repositorios/OrdemVendaRepostorio';
import {ItemOrdem, eItemTipo} from '../Entidades/Item';

export class OrdemVendaCasoUso {
    private _ordemVendaRepositorio: OrdemVendaRepositorio;
    private _itemRepositorio: ItemRepositorio;

    constructor(
        ordemVendaRepositorio: OrdemVendaRepositorio,
        itemRepositorio: ItemRepositorio,
    ) {
        this._ordemVendaRepositorio = ordemVendaRepositorio;
        this._itemRepositorio = itemRepositorio;
    }

    async listaOrdemVendas(): Promise<OrdemVenda[]> {
        return await this._ordemVendaRepositorio.listaOrdemVendas();
    }

    async listaClientes(): Promise<Cliente[]> {
        return await this._ordemVendaRepositorio.listaClientes();
    }

    async listaLocais(): Promise<Local[]> {
        return await this._ordemVendaRepositorio.listaLocais();
    }

    async buscaOrdemVenda(id: number): Promise<OrdemVenda | null> {
        if (id <= 0) {
            return null;
        }

        return _.cloneDeep(
            await this._ordemVendaRepositorio.buscaOrdemVenda(id),
        );
    }

    private _calculaDiferencaItensCompra(
        itensVendidosAtuais: ItemOrdem[],
        itensVendidosGravados: ItemOrdem[] | null = null,
    ): {
        [id: number]: {id: number; tipo: eItemTipo; qtdAlterada: number};
    } {
        const itensCompradosGravadosTratado = itensVendidosGravados ?? [];

        const itensCompradosAtuaisDict = itensVendidosAtuais.reduce(
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

        for (let itemCompraAtual of itensVendidosAtuais) {
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

    private _gravaOrdemVendaInvariantes(venda: OrdemVenda): string {
        if (venda.itensVendidos.length === 0) {
            return 'A lista de itens vendidos tem que conter pelo menos um item';
        }

        if (venda.itensVendidos.some(iv => iv.item.id <= 0)) {
            return 'Item com id inválido';
        }

        if (venda.itensVendidos.some(iv => iv.qtd <= 0)) {
            return 'A quantidade de itens vendidos tem que ser superior a zero';
        }

        if (venda.itensVendidos.some(iv => iv.valorTotal <= 0)) {
            return 'O valor total do item vendidos tem que ser superior a zero';
        }

        if (venda.cliente.id === 0 && venda.cliente.nome.trim() === '') {
            return 'O nome do cliente adicionado tem que estar preenchido';
        }

        if (venda.local.id === 0 && venda.local.descricao.trim() === '') {
            return 'A descricao do local adicionado tem que estar preenchido';
        }

        return '';
    }

    async gravaOrdemVenda(
        venda: OrdemVenda,
    ): Promise<{vendaId: number; clienteId: number; localId: number}> {
        const retornoChecagem = this._gravaOrdemVendaInvariantes(venda);
        if (retornoChecagem.trim() !== '') {
            throw new Error(retornoChecagem);
        }

        const vendaGravar = _.cloneDeep(venda);

        const itensVendidosGravados =
            vendaGravar.id > 0
                ? (
                      await this._ordemVendaRepositorio.buscaOrdemVenda(
                          vendaGravar.id,
                      )
                  )?.itensVendidos
                : null;

        const itensCompradosInfo = this._calculaDiferencaItensCompra(
            vendaGravar.itensVendidos,
            itensVendidosGravados,
        );

        const itensEstoqueVendidos = await Promise.all(
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

        const itensEstoqueAtualizados = itensEstoqueVendidos.map(iec => {
            if (!iec) {
                return null;
            }

            const {qtdAlterada} = itensCompradosInfo[iec.item.id];

            return {
                ...iec,
                qtd:
                    iec.qtd + qtdAlterada * -1 > 0
                        ? iec.qtd + qtdAlterada * -1
                        : 0,
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

        let clienteId = vendaGravar.cliente.id;
        if (clienteId <= 0) {
            clienteId = await this._ordemVendaRepositorio.gravaCliente(
                vendaGravar.cliente,
            );

            vendaGravar.cliente = {...vendaGravar.cliente, id: clienteId};
        }

        let localId = vendaGravar.local.id;
        if (localId <= 0) {
            localId = await this._ordemVendaRepositorio.gravaLocal(
                vendaGravar.local,
            );

            vendaGravar.local = {...vendaGravar.local, id: localId};
        }

        const vendaId = await this._ordemVendaRepositorio.gravaOrdemVenda(
            vendaGravar,
        );

        return {
            vendaId: vendaId,
            clienteId: clienteId,
            localId: localId,
        };
    }

    async deletaOrdemVenda(id: number): Promise<void> {
        if (id <= 0) {
            return;
        }

        return await this._ordemVendaRepositorio.deletaOrdemVenda(id);
    }
}
