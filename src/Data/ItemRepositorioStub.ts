import {ItemEstoque, eItemTipo} from '../Entidades/Item';
import {eMedida, getMedida} from '../Entidades/Medida';
import {ItemRepositorio} from '../Repositorios/ItemRepositorio';

export default class ItemRepositorioStub implements ItemRepositorio {
    async listaMateriasPrimas(): Promise<ItemEstoque[]> {
        return [
            {
                item: {
                    id: 1,
                    descricao: 'Essencia',
                    inclusao: new Date('2023-09-20 00:30:00'),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.mililitro),
                qtd: 1000,
                valorMediaUnidade: 0.3,
            },
            {
                item: {
                    id: 2,
                    descricao: 'Base glicerinada',
                    inclusao: new Date('2023-09-20 00:32:00'),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.kilo),
                qtd: 10,
                valorMediaUnidade: 30,
            },
            {
                item: {
                    id: 3,
                    descricao: 'Parafina',
                    inclusao: new Date('2023-09-20 00:33:00'),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.kilo),
                qtd: 10,
                valorMediaUnidade: 15,
            },
            {
                item: {
                    id: 4,
                    descricao: 'Pavio com ilhós',
                    inclusao: new Date('2023-09-20 00:33:00'),
                    tipo: eItemTipo.MateriaPrima,
                },
                medida: getMedida(eMedida.unidade),
                qtd: 150,
                valorMediaUnidade: 0.2,
            },
        ];
    }
}
