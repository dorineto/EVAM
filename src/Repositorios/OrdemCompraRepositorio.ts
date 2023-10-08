import {OrdemCompra} from '../Entidades/OrdemCompra';

export interface OrdemCompraRepositorio {
    listaOrdemCompras: () => Promise<OrdemCompra[]>;
    buscaOrdemCompra: (id: number) => Promise<OrdemCompra | null>;
    gravaOrdemCompra: (compra: OrdemCompra) => Promise<number>;
    deletaOrdemCompra: (id: number) => Promise<void>;
}
