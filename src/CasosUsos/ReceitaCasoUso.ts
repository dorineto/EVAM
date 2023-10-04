import _ from 'lodash';
import {Receita} from '../Entidades/Receita';
import {ReceitaRepositorio} from '../Repositorios/ReceitaRepositorio';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';

export class ReceitaCasoUso {
    private _receitaRepositorio: ReceitaRepositorio;
    private _itemRepositorio: ItemRepositorio;

    constructor(
        receitaRepositorio: ReceitaRepositorio,
        itemRepositorio: ItemRepositorio,
    ) {
        this._receitaRepositorio = receitaRepositorio;
        this._itemRepositorio = itemRepositorio;
    }

    async listaReceitas(): Promise<Receita[]> {
        return await this._receitaRepositorio.listaReceitas();
    }

    async buscaReceita(id: number): Promise<Receita | null> {
        if (id <= 0) {
            return null;
        }

        return _.cloneDeep(await this._receitaRepositorio.buscaReceita(id));
    }

    async gravaReceita(receita: Receita): Promise<number> {
        if (receita.descricao.trim() === '') {
            throw new Error('A descrição da receita não pode ser vazia');
        }

        if (receita.ingredientes.length === 0) {
            throw new Error('Tem que ter no minimo um ingrediente');
        }

        if (receita.ingredientes.some(i => i.item.id <= 0)) {
            throw new Error(
                'Não é possivel encontrar o(s) ingrediente(s) informado(s)',
            );
        }

        if (receita.ingredientes.some(i => i.qtd <= 0)) {
            throw new Error(
                'A quantidade utilizada de ingrediente tem que ser maior que 0',
            );
        }

        const produtoProduzido = await this._itemRepositorio.buscaProduto(
            receita.produz.item.id,
        );

        if (!produtoProduzido) {
            throw Error('Não foi possivel encontrar o produto produzido');
        }

        const totalValorIngredientesGastos = receita.ingredientes.reduce(
            (prevVal, currVal) => {
                return currVal.qtd * currVal.valorMediaUnidade + prevVal;
            },
            0,
        );

        const valorUnidadeCalculado =
            totalValorIngredientesGastos / receita.produz.qtd;

        // Para sempre ter o menor valor de media
        if (valorUnidadeCalculado < produtoProduzido.valorMediaUnidade) {
            produtoProduzido.valorMediaUnidade = valorUnidadeCalculado;

            await this._itemRepositorio.gravaProduto(produtoProduzido);
        }

        return await this._receitaRepositorio.gravaReceita(receita);
    }

    async deletaReceita(id: number): Promise<void> {
        if (id <= 0) {
            return;
        }

        await this._receitaRepositorio.deletaReceita(id);
    }
}
