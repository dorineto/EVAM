import {Cliente} from '../Entidades/Cliente';
import {Local} from '../Entidades/Local';
import {OrdemVenda} from '../Entidades/OrdemVenda';

export interface OrdemVendaRepositorio {
    listaOrdemVendas: () => Promise<OrdemVenda[]>;
    listaClientes: () => Promise<Cliente[]>;
    listaLocais: () => Promise<Local[]>;
    buscaOrdemVenda: (id: number) => Promise<OrdemVenda | null>;
    gravaOrdemVenda: (compra: OrdemVenda) => Promise<number>;
    gravaCliente: (cliente: Cliente) => Promise<number>;
    gravaLocal: (local: Local) => Promise<number>;
    deletaOrdemVenda: (id: number) => Promise<void>;
}
