import {useEffect, useState} from 'react';
import {ItemEstoque} from '../../Entidades/Item';
import {CasoUsoInit} from '../../App';

export interface EstoqueRegistro {
    materiasPrimas: ItemEstoque[];
}

export function useVisualizaEstoque({
    itemCasoUso,
}: CasoUsoInit): [EstoqueRegistro] {
    const [estoqueRegistro, setEstoqueRegistro] = useState<EstoqueRegistro>({
        materiasPrimas: [],
    });

    useEffect(() => {
        async function buscaInfoEstoque() {
            const materiasPrimas = await itemCasoUso.listaMateriasPrimas();

            setEstoqueRegistro({
                materiasPrimas: materiasPrimas,
            });
        }

        buscaInfoEstoque();
    }, [itemCasoUso]);

    return [estoqueRegistro];
}
