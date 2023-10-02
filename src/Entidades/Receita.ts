import {ItemMensurado, ItemReceita} from './Item';
import _ from 'lodash';

export class Receita {
    private _id: number;
    private _descricao: string;
    private _ingredientes: ItemReceita[];
    private _produz: ItemMensurado;
    private _inclusao: string;

    constructor(
        id: number,
        descricao: string,
        produz: ItemMensurado,
        ingredientes: ItemReceita[],
        inclusao: Date,
    ) {
        this._id = id;
        this._descricao = descricao;
        this._produz = produz;
        this._ingredientes = ingredientes;
        this._inclusao = inclusao.toISOString();
    }

    // atualizaIngredientes(...ingredientes: ItemReceita[]) {
    //     const ingredientesAtualizaDict = ingredientes.reduce(
    //         (prevVal: {[id: number]: ItemReceita}, currVal) => {
    //             prevVal[currVal.item.id] = currVal;
    //             return prevVal;
    //         },
    //         {},
    //     );

    //     const ingredientesAtualDict = this._ingredientes.reduce(
    //         (prevVal: {[id: number]: ItemReceita}, currVal) => {
    //             prevVal[currVal.item.id] = currVal;
    //             return prevVal;
    //         },
    //         {},
    //     );

    //     const ingredientesAtualizaIds = Object.keys(ingredientesAtualizaDict);
    //     const ingredientesAtualIds = Object.keys(ingredientesAtualDict);

    //     const ingredientesAtualizarIds = ingredientesAtualizaIds
    //         .filter(iai => ingredientesAtualIds.includes(iai))
    //         .map(iai => Number(iai));

    //     const ingredientesAdicionarIds = ingredientesAtualizaIds
    //         .filter(iai => !ingredientesAtualIds.includes(iai))
    //         .map(iai => Number(iai));

    //     for (let id of ingredientesAtualizarIds) {
    //         const ingredienteAtual = ingredientesAtualDict[id];
    //         const ingredienteAtualizarInfo = ingredientesAtualizaDict[id];

    //         ingredienteAtual.qtd = ingredienteAtualizarInfo.qtd;
    //     }

    //     let ingredientesAdicionar = ingredientesAdicionarIds.map(
    //         iai => ingredientesAtualizaDict[iai],
    //     );

    //     this._ingredientes.push(...ingredientesAdicionar);
    // }

    get id(): number {
        return this._id;
    }

    set id(idInp: number) {
        if (this._id > 0) {
            throw new Error('Id já setado');
        }

        this._id = idInp;
    }

    get descricao(): string {
        return this._descricao;
    }

    set descricao(descricaoInp: string) {
        this._descricao = descricaoInp;
    }

    get ingredientes(): ItemReceita[] {
        return _.cloneDeep(this._ingredientes);
    }

    set ingredientes(ingredientesInp: ItemReceita[]) {
        this._ingredientes = _.cloneDeep(ingredientesInp);
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
