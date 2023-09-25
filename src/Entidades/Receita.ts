import {ItemMensurado} from './Item';
import _ from 'lodash';

export class Receita {
    private _ingredientes: ItemMensurado[];
    private _produz: ItemMensurado;
    private _inclusao: string;

    constructor(
        produz: ItemMensurado,
        ingredientes: ItemMensurado[],
        inclusao: Date,
    ) {
        this._produz = produz;
        this._ingredientes = ingredientes;
        this._inclusao = inclusao.toISOString();
    }

    adicionaIngredientes(...ingredientesAdicionados: ItemMensurado[]) {
        throw new Error('Não implementado');
    }

    removerIngredientes(...ingredientesRemovidos: ItemMensurado[]) {
        throw new Error('Não implementado');
    }

    get ingredientes(): ItemMensurado[] {
        return _.cloneDeep(this._ingredientes);
    }

    set produz(itemProduzido: ItemMensurado) {
        this._produz = itemProduzido;
    }

    get produz(): ItemMensurado {
        return _.cloneDeep(this._produz);
    }

    set inclusao(inclusao: Date) {
        this._inclusao = inclusao.toISOString();
    }

    get inclusao() {
        return new Date(this._inclusao);
    }
}
