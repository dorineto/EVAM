export enum eMedida {
    unidade = 1,
    metro = 2,
    centimetro = 3,
    litro = 4,
    mililitro = 5,
    kilo = 6,
    grama = 7,
    miligrama = 8,
}

export interface Medida {
    id: number;
    descricao: string;
    abreviacao: string;
}

export function getMedida(medida: eMedida): Medida {
    let returnVal: Medida = {
        id: medida,
        descricao: eMedida[medida],
        abreviacao: '',
    };

    let abreviacaoMedida = '';
    switch (medida) {
        case eMedida.unidade:
            abreviacaoMedida = 'unid';
            break;
        case eMedida.metro:
            abreviacaoMedida = 'm';
            break;
        case eMedida.centimetro:
            abreviacaoMedida = 'cm';
            break;
        case eMedida.litro:
            abreviacaoMedida = 'l';
            break;
        case eMedida.mililitro:
            abreviacaoMedida = 'ml';
            break;
        case eMedida.kilo:
            abreviacaoMedida = 'kg';
            break;
        case eMedida.grama:
            abreviacaoMedida = 'g';
            break;
        case eMedida.miligrama:
            abreviacaoMedida = 'mg';
            break;
        default:
            throw new Error('Medida desconhecida');
    }

    returnVal.abreviacao = abreviacaoMedida;

    return returnVal;
}
