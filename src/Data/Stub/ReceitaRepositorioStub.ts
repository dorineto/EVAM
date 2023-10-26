import _ from 'lodash';
import {ItemEstoque, ItemMensurado, ItemReceita} from '../../Entidades/Item';
import {Receita} from '../../Entidades/Receita';
import {ReceitaRepositorio} from '../../Repositorios/ReceitaRepositorio';
import {listaReceitas} from './InitialDataStub';
import ItemRepositorioStub from './ItemRepositorioStub';

export class ReceitaRepositorioStub implements ReceitaRepositorio {
    private _listaReceitas: Receita[];
    private _repositorioItem: ItemRepositorioStub;

    constructor(repositorioItem: ItemRepositorioStub) {
        this._listaReceitas = [...listaReceitas];
        this._repositorioItem = repositorioItem;
    }

    async listaReceitas(): Promise<Receita[]> {
        return _.cloneDeep(this._listaReceitas);
    }

    async buscaReceita(id: number): Promise<Receita | null> {
        return this._listaReceitas.find(lr => lr.id === id) ?? null;
    }

    async gravaReceita(receita: Receita): Promise<number> {
        let receitaGravada =
            this._listaReceitas.find(lr => lr.id === receita.id) ??
            _.cloneDeep(receita);

        const produtoProduzido = await this._repositorioItem.buscaProduto(
            receita.produz.item.id,
        );

        if (!produtoProduzido) {
            throw new Error(
                `Produto não encontrado: ID=${receita.produz.item.id}`,
            );
        }

        const ingredientes: {[id: number]: ItemEstoque} = {};

        for (let item of receita.ingredientes) {
            const itemBuscado = await this._repositorioItem.buscaMateriaPrima(
                item.item.id,
            );

            if (!itemBuscado) {
                throw new Error(
                    `Materia prima não encontrado: ID=${item.item.id}`,
                );
            }

            ingredientes[itemBuscado.item.id] = itemBuscado;
        }

        const itemProduzidoGrava: ItemMensurado = {
            ...receita.produz,
            item: produtoProduzido.item,
        };

        const ingredienteGrava: ItemReceita[] = receita.ingredientes.map(i => {
            return {
                ...i,
                item: ingredientes[i.item.id].item,
            };
        });

        receitaGravada.descricao = receita.descricao;
        receitaGravada.inclusao = receita.inclusao;

        receitaGravada.produz = itemProduzidoGrava;
        receitaGravada.ingredientes = ingredienteGrava;

        if (receitaGravada.id === 0) {
            const id = Math.max(...this._listaReceitas.map(r => r.id)) + 1;

            receitaGravada.id = id;

            this._listaReceitas.push(receitaGravada);
        }

        return receitaGravada.id;
    }

    async deletaReceita(id: number): Promise<void> {
        this._listaReceitas = this._listaReceitas.filter(lr => lr.id !== id);
    }
}
