import React, {useContext, useState, useCallback} from 'react';
import {PropsWithChildren} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {ItemEstoque} from '../../Entidades/Item';
import {useNavigation} from '@react-navigation/native';
import {EstoqueGerenciamentoProps} from '../Navigation/types';
import {Medida, MedidaInfo, eMedida, getMedida} from '../../Entidades/Medida';
import {SelectList} from 'react-native-dropdown-select-list';
import MaskInput, {Masks} from 'react-native-mask-input';
import {
    ButtonForm,
    ButtonWithStyle,
    ItemQuantidadeInput,
    MultipleItemQuantidade,
    QtdMask,
    RegistroItemListaItem,
    convertNumberToMaskedNumber,
    eModalTipo,
    formataDataDisplay,
    styleFormularioUtil,
    styleModalOpcoes,
    styleScreenUtil,
    styleUtil,
} from './Utils';
import {
    ItemEstoqueFormulario,
    OrdemCompraFormulario,
    ReceitaFormulario,
    useDeletaMateriaPrima,
    useDeletaOrdemCompra,
    useDeletaProduto,
    useDeletaReceita,
    useFormularioMateriaPrima,
    useFormularioOrdemCompra,
    useFormularioProduto,
    useFormularioReceita,
} from '../Controlles/EstoqueController';
import {CasoUso} from '../../App';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Receita} from '../../Entidades/Receita';
import {OrdemCompra} from '../../Entidades/OrdemCompra';
import {ItemQuantidade} from '../Controlles/Util';

export type EstoqueContainerProps = {
    title: string;
};

export type ButtonExpandeProps = {
    onPress?: () => void;
    expandido?: boolean;
};

export function ButtonExpande({
    onPress,
    expandido,
}: ButtonExpandeProps): React.JSX.Element {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styleButtonExpand.expandButton,
                (expandido ?? false) && styleButtonExpand.expandidoExpandButton,
            ]}>
            <FontAwesomeIcon
                color={styleButtonExpand.expandButton.color}
                size={styleButtonExpand.expandButton.fontSize}
                icon={['fas', 'caret-down']}
            />
        </TouchableOpacity>
    );
}

const styleButtonExpand = StyleSheet.create({
    expandButton: {
        color: '#fff',
        fontSize: 25,
        backgroundColor: '#A972BE',
        borderRadius: 100,
        padding: 5,
    },
    expandidoExpandButton: {
        transform: [{rotateX: '180deg'}],
    },
});

export function EstoqueContainer({
    title,
    children,
}: PropsWithChildren<EstoqueContainerProps>): React.JSX.Element {
    const [expandido, setExpandido] = useState(false);

    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleEstoqueContainer.containerEstoque,
                expandido && styleEstoqueContainer.expandidoContainerEstoque,
            ]}>
            <Text
                style={[
                    styleUtil.titleText,
                    styleEstoqueContainer.titleContainerEstoque,
                ]}>
                {title}
            </Text>
            <ScrollView
                centerContent
                showsVerticalScrollIndicator={false}
                style={{
                    width: styleEstoqueContainer.contentContainerEstoque.width,
                }}
                contentContainerStyle={[
                    styleEstoqueContainer.contentContainerEstoque,
                ]}>
                {children}
            </ScrollView>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleEstoqueContainer.expandButtonContainer,
                    expandido &&
                        styleEstoqueContainer.expandidoExpandButtonContainer,
                ]}>
                <ButtonExpande
                    onPress={() => setExpandido(!expandido)}
                    expandido={expandido}
                />
            </View>
        </View>
    );
}

const styleEstoqueContainer = StyleSheet.create({
    containerEstoque: {
        backgroundColor: '#E2E2E2',
        borderRadius: 15,
        padding: 10,
        gap: 20,
        width: '90%',
        borderColor: '#CFCFCF',
        borderWidth: 2,
        maxHeight: 350,
    },
    expandidoContainerEstoque: {
        maxHeight: undefined, // TODO: fazer o Scrollvierw funcionar um dentro do outro Scrollvierw
    },
    titleContainerEstoque: {
        backgroundColor: '#8E49A9',
        color: '#fff',
        padding: 10,
        borderRadius: 50,
        width: '100%',
        textAlign: 'center',
    },
    contentContainerEstoque: {
        padding: 10,
        width: '100%',
    },
    expandButtonContainer: {
        width: '107%',
        position: 'absolute',
        bottom: 0,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,.6)',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    expandidoExpandButtonContainer: {
        position: 'relative',
        bottom: 'auto',
        backgroundColor: undefined,
        width: '100%',
        padding: 0,
    },
});

export type MateriaPrimaRegistroProps = {
    materiaPrima: ItemEstoque;
};

export function MateriaPrimaRegistro({
    materiaPrima,
}: MateriaPrimaRegistroProps): React.JSX.Element {
    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function opcoes() {
        navigate('EstoqueModalOpcoes', {
            tipo: eComponenteEstoqueTipo.MateriaPrima,
            id: materiaPrima.item.id,
        });
    }

    return (
        <TouchableOpacity
            onLongPress={opcoes}
            style={styleItemRegistro.containerRegistro}>
            <Text
                style={[
                    styleItemRegistro.descricaoRegistro,
                    styleUtil.contentText,
                ]}>
                {materiaPrima.item.descricao}
            </Text>
            <View style={styleItemRegistro.sideInfoContainerRegistro}>
                <Text
                    style={[
                        styleItemRegistro.badgeValorRegistro,
                        styleUtil.contentText,
                    ]}>
                    R${' '}
                    {materiaPrima.valorMediaUnidade
                        .toFixed(2)
                        .replace('.', ',')}
                </Text>
                <Text
                    style={[
                        styleItemRegistro.quantidadeRegistro,
                        styleUtil.contentText,
                    ]}>
                    {materiaPrima.qtd.toString().replace('.', ',')}{' '}
                    {materiaPrima.medida.abreviacao}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export type ProdutoRegistroProp = {
    produto: ItemEstoque;
};

export function ProdutoRegistro({
    produto,
}: ProdutoRegistroProp): React.JSX.Element {
    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function opcoes() {
        navigate('EstoqueModalOpcoes', {
            tipo: eComponenteEstoqueTipo.Produto,
            id: produto.item.id,
        });
    }

    return (
        <TouchableOpacity
            onLongPress={opcoes}
            style={styleItemRegistro.containerRegistro}>
            <Text
                style={[
                    styleItemRegistro.descricaoRegistro,
                    styleUtil.contentText,
                ]}>
                {produto.item.descricao}
            </Text>
            <View style={styleItemRegistro.sideInfoContainerRegistro}>
                <Text
                    style={[
                        styleItemRegistro.badgeValorRegistro,
                        styleUtil.contentText,
                    ]}>
                    R$ {produto.valorMediaUnidade.toFixed(2).replace('.', ',')}
                </Text>
                <Text
                    style={[
                        styleItemRegistro.quantidadeRegistro,
                        styleUtil.contentText,
                    ]}>
                    {produto.qtd.toString().replace('.', ',')}{' '}
                    {produto.medida.abreviacao}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export type ReceitaRegistroProp = {
    receita: Receita;
};

export function ReceitaRegistro({
    receita,
}: ReceitaRegistroProp): React.JSX.Element {
    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();
    const [expandido, setExpandido] = useState(false);

    function opcoes() {
        navigate('EstoqueModalOpcoes', {
            tipo: eComponenteEstoqueTipo.Receitas,
            id: receita.id,
        });
    }

    return (
        <TouchableOpacity onLongPress={opcoes}>
            {!expandido ? (
                <View style={[styleReceitaRegistro.containerReceitaRegistro]}>
                    <ButtonExpande
                        onPress={() => setExpandido(true)}
                        expandido={false}
                    />
                    <Text
                        style={[
                            styleReceitaRegistro.descricaoReceitaRegistro,
                            styleUtil.contentText,
                        ]}>
                        {receita.descricao}
                    </Text>
                </View>
            ) : (
                <View
                    style={[
                        styleReceitaRegistro.containerReceitaRegistro,
                        styleReceitaRegistro.expandidoContainerReceitaRegistro,
                    ]}>
                    <Text
                        style={[
                            styleReceitaRegistro.descricaoReceitaRegistro,
                            styleReceitaRegistro.expandidoDescricaoReceitaRegistro,
                            styleUtil.subTitle,
                        ]}>
                        {receita.descricao}
                    </Text>
                    <View
                        style={[
                            styleUtil.alignCenter,
                            styleReceitaRegistro.itensContainerReceitaRegistro,
                        ]}>
                        <Text style={[styleUtil.nestedSubTitle]}>Produto</Text>
                        <RegistroItemListaItem item={receita.produz} />
                    </View>
                    <View
                        style={[
                            styleUtil.alignCenter,
                            styleReceitaRegistro.itensContainerReceitaRegistro,
                        ]}>
                        <Text style={[styleUtil.nestedSubTitle]}>
                            Ingredientes
                        </Text>
                        {receita.ingredientes.map(i => (
                            <RegistroItemListaItem item={i} key={i.item.id} />
                        ))}
                    </View>
                    <ButtonExpande
                        onPress={() => setExpandido(false)}
                        expandido={true}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}

const styleReceitaRegistro = StyleSheet.create({
    containerReceitaRegistro: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#BFAEC6',
        gap: 10,
        width: '100%',
        borderRadius: 15,
        marginBottom: 10,
        padding: 5,
    },
    expandidoContainerReceitaRegistro: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    descricaoReceitaRegistro: {
        flexGrow: 0.7,
        maxWidth: '70%',
    },
    expandidoDescricaoReceitaRegistro: {
        flexGrow: undefined,
        width: '100%',
        backgroundColor: '#B180C5',
        padding: 10,
        color: '#fff',
        borderRadius: 15,
    },
    itensContainerReceitaRegistro: {
        backgroundColor: '#E8D7EE',
        borderRadius: 15,
        padding: 10,
    },
});

export type OrdemCompraRegistroProp = {
    compra: OrdemCompra;
};

export function OrdemCompraRegistro({
    compra,
}: OrdemCompraRegistroProp): React.JSX.Element {
    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();
    const [expandido, setExpandido] = useState(false);

    function opcoes() {
        navigate('EstoqueModalOpcoes', {
            tipo: eComponenteEstoqueTipo.Compras,
            id: compra.id,
        });
    }

    const descricaoOrdemCompra = `#${compra.id} - Compra ${formataDataDisplay(
        compra.inclusao,
    )}`;

    const totalCompra = `R$ ${convertNumberToMaskedNumber(compra.totalCompra)}`;

    return (
        <TouchableOpacity onLongPress={opcoes}>
            {!expandido ? (
                <View style={[styleOrdemCompraRegistro.container]}>
                    <View
                        style={[styleOrdemCompraRegistro.containerBtnExpande]}>
                        <ButtonExpande
                            onPress={() => setExpandido(true)}
                            expandido={false}
                        />
                    </View>
                    <View
                        style={[
                            styleUtil.alignCenter,
                            styleOrdemCompraRegistro.infoContainer,
                        ]}>
                        <Text
                            style={[
                                styleUtil.contentText,
                                styleOrdemCompraRegistro.descricaoRegistro,
                            ]}>
                            {descricaoOrdemCompra}
                        </Text>
                        <View
                            style={[
                                styleOrdemCompraRegistro.sideInfoContainer,
                            ]}>
                            <Text
                                style={[
                                    styleUtil.contentText,
                                    styleOrdemCompraRegistro.badgeValor,
                                ]}>
                                {totalCompra}
                            </Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View
                    style={[
                        styleOrdemCompraRegistro.container,
                        styleOrdemCompraRegistro.expandidoContainer,
                    ]}>
                    <Text
                        style={[
                            styleOrdemCompraRegistro.infoContainer,
                            styleOrdemCompraRegistro.expandidoDescricaoRegistro,
                            styleUtil.subTitle,
                        ]}>
                        {descricaoOrdemCompra}
                    </Text>
                    <Text
                        style={[
                            styleUtil.contentText,
                            styleOrdemCompraRegistro.totalValor,
                        ]}>
                        Total: {totalCompra}
                    </Text>
                    <View
                        style={[
                            styleUtil.alignCenter,
                            styleOrdemCompraRegistro.itensContainer,
                        ]}>
                        <Text style={[styleUtil.nestedSubTitle]}>
                            Itens Comprados
                        </Text>
                        {compra.itensComprados.map(i => (
                            <RegistroItemListaItem
                                item={i}
                                key={i.item.id}
                                mostraValor
                            />
                        ))}
                    </View>
                    <ButtonExpande
                        onPress={() => setExpandido(false)}
                        expandido={true}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}

const styleOrdemCompraRegistro = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#BFAEC6',
        gap: 5,
        width: '100%',
        borderRadius: 15,
        marginBottom: 10,
    },
    expandidoContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 5,
        gap: 10,
    },
    infoContainer: {
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: undefined,
    },
    sideInfoContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        top: 0,
        right: 0,
        width: '34%',
    },
    descricaoRegistro: {
        paddingVertical: 5,
        width: '66%',
    },
    badgeValor: {
        alignSelf: 'flex-start',
        backgroundColor: '#E8D7EE',
        borderColor: '#DECDE4',
        borderWidth: 2,
        paddingHorizontal: 10,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        maxWidth: '100%',
    },
    totalValor: {
        backgroundColor: '#B180C5',
        padding: 10,
        color: '#fff',
        borderRadius: 15,
    },
    expandidoDescricaoRegistro: {
        flexGrow: undefined,
        width: '100%',
        backgroundColor: '#B180C5',
        padding: 10,
        color: '#fff',
        borderRadius: 15,
    },
    itensContainer: {
        backgroundColor: '#E8D7EE',
        borderRadius: 15,
        padding: 10,
    },
    containerBtnExpande: {
        paddingVertical: 5,
        paddingLeft: 5,
    },
});

const styleItemRegistro = StyleSheet.create({
    containerRegistro: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#BFAEC6',
        gap: 15,
        width: '100%',
        borderRadius: 15,
        marginBottom: 10,
    },
    descricaoRegistro: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexGrow: 0.7,
        maxWidth: '70%',
    },
    sideInfoContainerRegistro: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexGrow: 0.3,
    },
    badgeValorRegistro: {
        backgroundColor: '#E8D7EE',
        borderColor: '#DECDE4',
        borderWidth: 2,
        paddingHorizontal: 10,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    quantidadeRegistro: {
        paddingHorizontal: 10,
    },
});

export function ButtonAdicionaEstoque(): React.JSX.Element {
    const [expandido, setExpandido] = useState(false);

    const {navigate} = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    return (
        <View
            style={[
                styleButtonAdicionaEstoque.containerButtonAdicionaEstoque,
                styleUtil.alignCenter,
                expandido
                    ? styleButtonAdicionaEstoque.expandidoButtonAdicionaEstoque
                    : styleButtonAdicionaEstoque.colapsadoButtonAdicionaEstoque,
            ]}>
            {expandido && (
                <View style={[styleUtil.alignCenter]}>
                    <ButtonForm
                        icon={['fas', 'book']}
                        title="Receitas"
                        onPress={() =>
                            navigate('EstoqueGerenciamento', {
                                componenteEstoqueTipo:
                                    eComponenteEstoqueTipo.Receitas,
                            })
                        }
                    />
                    <ButtonForm
                        icon={['fas', 'tags']}
                        title="Produtos"
                        onPress={() =>
                            navigate('EstoqueGerenciamento', {
                                componenteEstoqueTipo:
                                    eComponenteEstoqueTipo.Produto,
                            })
                        }
                    />
                    <ButtonForm
                        icon={['fas', 'box']}
                        title="Materias-primas"
                        onPress={() =>
                            navigate('EstoqueGerenciamento', {
                                componenteEstoqueTipo:
                                    eComponenteEstoqueTipo.MateriaPrima,
                            })
                        }
                    />
                    <ButtonForm
                        icon={['fas', 'cart-shopping']}
                        title="Compras"
                        onPress={() =>
                            navigate('EstoqueGerenciamento', {
                                componenteEstoqueTipo:
                                    eComponenteEstoqueTipo.Compras,
                            })
                        }
                    />
                </View>
            )}
            <ButtonForm
                icon={expandido ? ['fas', 'minus'] : ['fas', 'plus']}
                onPress={() => setExpandido(estadoAtual => !estadoAtual)}
            />
        </View>
    );
}

const styleButtonAdicionaEstoque = StyleSheet.create({
    containerButtonAdicionaEstoque: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    colapsadoButtonAdicionaEstoque: {
        marginVertical: 50,
        marginHorizontal: 78.5,
    },
    expandidoButtonAdicionaEstoque: {
        marginVertical: 50,
        marginHorizontal: 15,
    },
});

export enum eComponenteEstoqueTipo {
    MateriaPrima = 'materia-prima',
    Produto = 'produto',
    Receitas = 'receita',
    Compras = 'compras',
}

export interface FormularioEstoqueProp {
    id?: number;
    cancelado?: boolean;
}

interface FormularioMateriaPrimaLoadedProp extends FormularioEstoqueProp {
    itemEstoque: ItemEstoqueFormulario | null;
    gravaItemEstoque: (
        itemVisualizacao: ItemEstoqueFormulario,
    ) => Promise<void>;
    cancelar: () => void;
    confirmaGravar: () => void;
    displayMensagem: (mensagem: string, tipo: eModalTipo) => void;
    listaMedidasInfo: MedidaInfo[];
    cancelado?: boolean;
}

function FormularioMateriaPrimaLoaded({
    itemEstoque,
    gravaItemEstoque,
    cancelar,
    confirmaGravar,
    displayMensagem,
    listaMedidasInfo,
    cancelado,
}: FormularioMateriaPrimaLoadedProp) {
    let novoRegistro = (itemEstoque?.id ?? 0) === 0;

    const [medidaInp, setMedida] = useState(
        itemEstoque?.medida ?? getMedida(eMedida.unidade),
    );
    const [medValorInp, setMedValor] = useState(
        itemEstoque?.valorMediaUnidade.toFixed(2).replace('.', ',') ?? '',
    );
    const [qtdEstoqueInp, setQtdEstoque] = useState(
        itemEstoque?.qtd.toFixed(2).replace('.', ',') ?? '',
    );
    const [descricaoInp, setDescricao] = useState(itemEstoque?.descricao ?? '');

    const [aguardandoConfimacao, setAguardandoConfimacao] = useState(false);

    function validaValores() {
        if (descricaoInp.trim() === '') {
            return 'Informe valor para a nome da matéria-prima';
        }

        if (qtdEstoqueInp.trim() === '') {
            return 'Informe valor para a quantidade em estoque';
        }

        if (medValorInp.trim() === '') {
            return 'Informe valor para a média de preço';
        }

        let qtd = Number(
            qtdEstoqueInp.replaceAll('.', '').replace(',', '.').trim(),
        );

        if (Number.isNaN(qtd)) {
            return 'O valor informado para a quantidade em estoque é invalido';
        }

        if (Number.isNaN(qtd)) {
            return 'O valor informado para a quantidade em estoque é invalido';
        }

        let valorMediaUnidade = Number(
            medValorInp
                .replaceAll(/\.|R\$/g, '')
                .replaceAll(',', '.')
                .trim(),
        );

        if (Number.isNaN(valorMediaUnidade)) {
            return 'O valor informado para a média de preço é invalido';
        }

        return '';
    }

    const trataGravar = useCallback(
        (
            id: number,
            descricao: string,
            medida: Medida,
            qtdStr: string,
            valorMediaUnidadeStr: string,
        ) => {
            async function handleGravar() {
                setAguardandoConfimacao(false);

                let qtd = Number(
                    qtdStr.replaceAll('.', '').replace(',', '.').trim(),
                );

                let valorMediaUnidade = Number(
                    valorMediaUnidadeStr
                        .replaceAll(/\.|R\$/g, '')
                        .replaceAll(',', '.')
                        .trim(),
                );

                try {
                    await gravaItemEstoque({
                        id: id,
                        descricao: descricao,
                        medida: medida,
                        qtd: qtd,
                        valorMediaUnidade: valorMediaUnidade,
                    });

                    displayMensagem(
                        'Foi gravado com sucesso',
                        eModalTipo.Sucesso,
                    );
                } catch (e) {
                    if (e instanceof Error) {
                        displayMensagem(e.message, eModalTipo.Erro);
                    }
                }
            }

            handleGravar();
        },
        [displayMensagem, gravaItemEstoque],
    );

    if (aguardandoConfimacao && cancelado !== undefined && !cancelado) {
        trataGravar(
            itemEstoque?.id ?? 0,
            descricaoInp,
            medidaInp,
            qtdEstoqueInp,
            medValorInp,
        );
    }

    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleFormularioUtil.containerFormulario,
            ]}>
            <Text
                style={[
                    styleFormularioUtil.titleFormulario,
                    styleUtil.titleText,
                ]}>
                {novoRegistro ? 'Adição' : 'Edição'} Matéria-prima
            </Text>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.inputContainerFormulario,
                ]}>
                <TextInput
                    placeholder="Nome matéria-prima"
                    value={descricaoInp}
                    onChangeText={setDescricao}
                    maxLength={50}
                    style={[
                        styleFormularioUtil.inputFormulario,
                        styleUtil.contentText,
                    ]}
                />
                <View
                    style={[
                        styleUtil.alignCenter,
                        styleFormularioUtil.containerDropdownList,
                    ]}>
                    <MaskInput
                        mask={QtdMask}
                        placeholder="Quantidade estoque"
                        value={qtdEstoqueInp}
                        onChangeText={setQtdEstoque}
                        keyboardType="numeric"
                        style={[
                            styleFormularioUtil.inputFormulario,
                            styleUtil.contentText,
                            styleFormularioUtil.inputSideDropdownList,
                        ]}
                    />
                    <SelectList
                        setSelected={(val: number) => {
                            setMedida(getMedida(val));
                        }}
                        data={listaMedidasInfo}
                        defaultOption={listaMedidasInfo.find(
                            lmi => lmi.key === (medidaInp?.id ?? 1),
                        )}
                        save="key"
                        search={false}
                        dropdownStyles={styleFormularioUtil.inputDropdownList}
                        boxStyles={styleFormularioUtil.inputDropdownList}
                        dropdownTextStyles={styleUtil.contentText}
                        inputStyles={styleUtil.contentText}
                    />
                </View>
                <MaskInput
                    mask={Masks.BRL_CURRENCY}
                    placeholder={`Média preço por ${medidaInp.descricao}`}
                    value={medValorInp}
                    onChangeText={maskedValue =>
                        setMedValor(
                            maskedValue.trim() !== 'R$' ? maskedValue : '',
                        )
                    }
                    keyboardType="numeric"
                    style={[
                        styleFormularioUtil.inputFormulario,
                        styleUtil.contentText,
                    ]}
                />
            </View>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.buttonContainerFormulario,
                ]}>
                <ButtonWithStyle
                    title={novoRegistro ? 'Adicionar' : 'Gravar'}
                    onPress={() => {
                        let mensagem = validaValores();
                        if (mensagem.trim() !== '') {
                            displayMensagem(mensagem, eModalTipo.Erro);
                            return;
                        }

                        confirmaGravar();
                        setAguardandoConfimacao(true);
                    }}
                    style={[styleUtil.button, styleUtil.actionButton]}
                />
                <ButtonWithStyle
                    title="Cancelar"
                    onPress={cancelar}
                    style={[styleUtil.button, styleUtil.cancelaButton]}
                />
            </View>
        </View>
    );
}

export function FormularioMateriaPrima({
    id,
    cancelado,
}: FormularioEstoqueProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [
        cancelar,
        confirmaGravar,
        displayMensagem,
        listaMedidasInfo,
        itemEstoque,
        gravaItemEstoque,
        loading,
    ] = useFormularioMateriaPrima(casoUsoInit, id);

    return (
        <View>
            {!loading ? (
                <FormularioMateriaPrimaLoaded
                    itemEstoque={itemEstoque}
                    gravaItemEstoque={gravaItemEstoque}
                    cancelar={cancelar}
                    confirmaGravar={confirmaGravar}
                    displayMensagem={displayMensagem}
                    listaMedidasInfo={listaMedidasInfo}
                    cancelado={cancelado}
                />
            ) : (
                <Text>loading</Text>
            )}
        </View>
    );
}

interface FormularioProdutoLoadedProp extends FormularioEstoqueProp {
    itemEstoque: ItemEstoqueFormulario | null;
    gravaItemEstoque: (
        itemVisualizacao: ItemEstoqueFormulario,
    ) => Promise<void>;
    cancelar: () => void;
    confirmaGravar: () => void;
    displayMensagem: (mensagem: string, tipo: eModalTipo) => void;
    listaMedidasInfo: MedidaInfo[];
    cancelado?: boolean;
}

function FormularioProdutoLoaded({
    itemEstoque,
    gravaItemEstoque,
    cancelar,
    confirmaGravar,
    displayMensagem,
    listaMedidasInfo,
    cancelado,
}: FormularioProdutoLoadedProp) {
    let novoRegistro = (itemEstoque?.id ?? 0) === 0;

    const [medidaInp, setMedida] = useState(
        itemEstoque?.medida ?? getMedida(eMedida.unidade),
    );
    const [medValorInp, setMedValor] = useState(
        itemEstoque?.valorMediaUnidade.toFixed(2).replace('.', ',') ?? '',
    );
    const [qtdEstoqueInp, setQtdEstoque] = useState(
        itemEstoque?.qtd.toFixed(2).replace('.', ',') ?? '',
    );
    const [descricaoInp, setDescricao] = useState(itemEstoque?.descricao ?? '');

    const [aguardandoConfimacao, setAguardandoConfimacao] = useState(false);

    function validaValores() {
        if (descricaoInp.trim() === '') {
            return 'Informe valor para a nome do produto';
        }

        if (qtdEstoqueInp.trim() === '') {
            return 'Informe valor para a quantidade em estoque';
        }

        if (medValorInp.trim() === '') {
            return 'Informe valor para a média de preço';
        }

        let qtd = Number(
            qtdEstoqueInp.replaceAll('.', '').replace(',', '.').trim(),
        );

        if (Number.isNaN(qtd)) {
            return 'O valor informado para a quantidade em estoque é invalido';
        }

        if (Number.isNaN(qtd)) {
            return 'O valor informado para a quantidade em estoque é invalido';
        }

        let valorMediaUnidade = Number(
            medValorInp
                .replaceAll(/\.|R\$/g, '')
                .replaceAll(',', '.')
                .trim(),
        );

        if (Number.isNaN(valorMediaUnidade)) {
            return 'O valor informado para a média de preço é invalido';
        }

        return '';
    }

    const trataGravar = useCallback(
        (
            id: number,
            descricao: string,
            medida: Medida,
            qtdStr: string,
            valorMediaUnidadeStr: string,
        ) => {
            async function handleGravar() {
                setAguardandoConfimacao(false);

                let qtd = Number(
                    qtdStr.replaceAll('.', '').replace(',', '.').trim(),
                );

                let valorMediaUnidade = Number(
                    valorMediaUnidadeStr
                        .replaceAll(/\.|R\$/g, '')
                        .replaceAll(',', '.')
                        .trim(),
                );

                try {
                    await gravaItemEstoque({
                        id: id,
                        descricao: descricao,
                        medida: medida,
                        qtd: qtd,
                        valorMediaUnidade: valorMediaUnidade,
                    });

                    displayMensagem(
                        'Foi gravado com sucesso',
                        eModalTipo.Sucesso,
                    );
                } catch (e) {
                    if (e instanceof Error) {
                        displayMensagem(e.message, eModalTipo.Erro);
                    }
                }
            }

            handleGravar();
        },
        [displayMensagem, gravaItemEstoque],
    );

    if (aguardandoConfimacao && cancelado !== undefined && !cancelado) {
        trataGravar(
            itemEstoque?.id ?? 0,
            descricaoInp,
            medidaInp,
            qtdEstoqueInp,
            medValorInp,
        );
    }

    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleFormularioUtil.containerFormulario,
            ]}>
            <Text
                style={[
                    styleFormularioUtil.titleFormulario,
                    styleUtil.titleText,
                ]}>
                {novoRegistro ? 'Adição' : 'Edição'} Produto
            </Text>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.inputContainerFormulario,
                ]}>
                <TextInput
                    placeholder="Nome Produto"
                    value={descricaoInp}
                    onChangeText={setDescricao}
                    maxLength={50}
                    style={[
                        styleFormularioUtil.inputFormulario,
                        styleUtil.contentText,
                    ]}
                />
                <View
                    style={[
                        styleUtil.alignCenter,
                        styleFormularioUtil.containerDropdownList,
                    ]}>
                    <MaskInput
                        mask={QtdMask}
                        placeholder="Quantidade estoque"
                        value={qtdEstoqueInp}
                        onChangeText={setQtdEstoque}
                        keyboardType="numeric"
                        style={[
                            styleFormularioUtil.inputFormulario,
                            styleUtil.contentText,
                            styleFormularioUtil.inputSideDropdownList,
                        ]}
                    />
                    <SelectList
                        setSelected={(val: number) => {
                            setMedida(getMedida(val));
                        }}
                        data={listaMedidasInfo}
                        defaultOption={listaMedidasInfo.find(
                            lmi => lmi.key === (medidaInp?.id ?? 1),
                        )}
                        save="key"
                        search={false}
                        dropdownStyles={styleFormularioUtil.inputDropdownList}
                        boxStyles={styleFormularioUtil.inputDropdownList}
                        dropdownTextStyles={styleUtil.contentText}
                        inputStyles={styleUtil.contentText}
                    />
                </View>
                <MaskInput
                    mask={Masks.BRL_CURRENCY}
                    placeholder={`Média preço por ${medidaInp.descricao}`}
                    value={medValorInp}
                    onChangeText={maskedValue =>
                        setMedValor(
                            maskedValue.trim() !== 'R$' ? maskedValue : '',
                        )
                    }
                    keyboardType="numeric"
                    style={[
                        styleFormularioUtil.inputFormulario,
                        styleUtil.contentText,
                    ]}
                />
            </View>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.buttonContainerFormulario,
                ]}>
                <ButtonWithStyle
                    title={novoRegistro ? 'Adicionar' : 'Gravar'}
                    onPress={() => {
                        let mensagem = validaValores();
                        if (mensagem.trim() !== '') {
                            displayMensagem(mensagem, eModalTipo.Erro);
                            return;
                        }

                        confirmaGravar();
                        setAguardandoConfimacao(true);
                    }}
                    style={[styleUtil.button, styleUtil.actionButton]}
                />
                <ButtonWithStyle
                    title="Cancelar"
                    onPress={cancelar}
                    style={[styleUtil.button, styleUtil.cancelaButton]}
                />
            </View>
        </View>
    );
}

export function FormularioProduto({
    id,
    cancelado,
}: FormularioEstoqueProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [
        cancelar,
        confirmaGravar,
        displayMensagem,
        listaMedidasInfo,
        itemEstoque,
        gravaItemEstoque,
        loading,
    ] = useFormularioProduto(casoUsoInit, id);

    return (
        <View>
            {!loading ? (
                <FormularioProdutoLoaded
                    itemEstoque={itemEstoque}
                    gravaItemEstoque={gravaItemEstoque}
                    cancelar={cancelar}
                    confirmaGravar={confirmaGravar}
                    displayMensagem={displayMensagem}
                    listaMedidasInfo={listaMedidasInfo}
                    cancelado={cancelado}
                />
            ) : (
                <Text>loading</Text>
            )}
        </View>
    );
}

interface FormularioReceitaLoadedProp extends FormularioEstoqueProp {
    receitaFormulario: ReceitaFormulario | null;
    listaProdutos: ItemEstoque[];
    listaMateriasPrimas: ItemEstoque[];
    gravaReceita: (receitaVisualizacao: ReceitaFormulario) => Promise<void>;
    cancelar: () => void;
    confirmaGravar: () => void;
    displayMensagem: (mensagem: string, tipo: eModalTipo) => void;
}

function FormularioReceitaLoaded({
    receitaFormulario,
    listaProdutos,
    listaMateriasPrimas,
    gravaReceita,
    cancelar,
    confirmaGravar,
    displayMensagem,
    cancelado,
}: FormularioReceitaLoadedProp) {
    let novoRegistro = (receitaFormulario?.id ?? 0) === 0;

    const [descricaoInp, setDescricao] = useState(
        receitaFormulario?.descricao ?? '',
    );

    const [itemProduzido, setItemProduzido] = useState<
        ItemQuantidade | undefined
    >(receitaFormulario?.produz);

    const [listaIngredientes, setListaIngredientes] = useState<
        ItemQuantidade[]
    >([]);

    const [aguardandoConfimacao, setAguardandoConfimacao] = useState(false);

    function validaValores() {
        if (descricaoInp.trim() === '') {
            return 'Informe valor para a nome da receita';
        }

        if (!itemProduzido || itemProduzido.id <= 0) {
            return 'Selecione um produto que será produzido pela receita';
        }

        if (itemProduzido.qtd <= 0) {
            return 'Informe a quantidade que será produzida do produto pela receita';
        }

        if (
            listaIngredientes.length === 0 ||
            listaIngredientes.every(li => li.id === 0)
        ) {
            return 'Selecione pelo menos um ingrediente para a receita';
        }

        const itensSemQuantidade = listaIngredientes
            .filter(li => li.qtd <= 0)
            .map(li => li.id);
        if (itensSemQuantidade.length > 0) {
            const descricoesItensSemQuantidade = listaMateriasPrimas
                .filter(lmp => itensSemQuantidade.includes(lmp.item.id))
                .map(lmp => lmp.item.descricao)
                .join(',');

            return `Informe a quantidade que será utilizada do(s) ingrediente(s): ${descricoesItensSemQuantidade}`;
        }

        return '';
    }

    const trataGravar = useCallback(
        (
            id: number,
            descricao: string,
            itemProduzidoSelecionado: ItemQuantidade,
            ingredientes: ItemQuantidade[],
        ) => {
            async function handleGravar() {
                setAguardandoConfimacao(false);

                try {
                    await gravaReceita({
                        id: id,
                        descricao: descricao,
                        produz: itemProduzidoSelecionado,
                        ingredientes: ingredientes,
                    });

                    displayMensagem(
                        'Foi gravado com sucesso',
                        eModalTipo.Sucesso,
                    );
                } catch (e) {
                    if (e instanceof Error) {
                        displayMensagem(e.message, eModalTipo.Erro);
                    }
                }
            }

            handleGravar();
        },
        [displayMensagem, gravaReceita],
    );

    if (aguardandoConfimacao && cancelado !== undefined && !cancelado) {
        if (itemProduzido) {
            trataGravar(
                receitaFormulario?.id ?? 0,
                descricaoInp,
                itemProduzido,
                listaIngredientes,
            );
        }
    }

    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleFormularioUtil.containerFormulario,
            ]}>
            <Text
                style={[
                    styleFormularioUtil.titleFormulario,
                    styleUtil.titleText,
                ]}>
                {novoRegistro ? 'Adição' : 'Edição'} Receita
            </Text>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.inputContainerFormulario,
                ]}>
                <TextInput
                    placeholder="Nome Receita"
                    value={descricaoInp}
                    onChangeText={setDescricao}
                    maxLength={50}
                    style={[
                        styleFormularioUtil.inputFormulario,
                        styleUtil.contentText,
                    ]}
                />
                <ItemQuantidadeInput
                    itens={listaProdutos}
                    valorInicial={receitaFormulario?.produz}
                    tipo="produto"
                    onChange={setItemProduzido}
                    widthDropDownList={'95%'}
                    placeholderQtdInput="Quantidade produzido"
                />
                <MultipleItemQuantidade
                    title="Itens Receita"
                    listaItens={listaMateriasPrimas}
                    valoresIniciais={receitaFormulario?.ingredientes}
                    onChange={setListaIngredientes}
                />
            </View>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.buttonContainerFormulario,
                ]}>
                <ButtonWithStyle
                    title={novoRegistro ? 'Adicionar' : 'Gravar'}
                    onPress={() => {
                        let mensagem = validaValores();
                        if (mensagem.trim() !== '') {
                            displayMensagem(mensagem, eModalTipo.Erro);
                            return;
                        }

                        confirmaGravar();
                        setAguardandoConfimacao(true);
                    }}
                    style={[styleUtil.button, styleUtil.actionButton]}
                />
                <ButtonWithStyle
                    title="Cancelar"
                    onPress={cancelar}
                    style={[styleUtil.button, styleUtil.cancelaButton]}
                />
            </View>
        </View>
    );
}

export function FormularioReceita({
    id,
    cancelado,
}: FormularioEstoqueProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [
        cancelar,
        confirmaGravar,
        displayMensagem,
        receitaFormulario,
        listaMateriaPrima,
        listaProdutos,
        gravaReceita,
        loading,
    ] = useFormularioReceita(casoUsoInit, id);

    return (
        <View>
            {!loading ? (
                <FormularioReceitaLoaded
                    receitaFormulario={receitaFormulario}
                    listaMateriasPrimas={listaMateriaPrima}
                    listaProdutos={listaProdutos}
                    gravaReceita={gravaReceita}
                    cancelar={cancelar}
                    confirmaGravar={confirmaGravar}
                    displayMensagem={displayMensagem}
                    cancelado={cancelado}
                />
            ) : (
                <Text>loading</Text>
            )}
        </View>
    );
}

interface FormularioCompraLoadedProp extends FormularioEstoqueProp {
    ordemCompraFormulario: OrdemCompraFormulario | null;
    listaItens: ItemEstoque[];
    gravaOrdemCompra: (
        compraVisualizacao: OrdemCompraFormulario,
    ) => Promise<void>;
    cancelar: () => void;
    confirmaGravar: () => void;
    displayMensagem: (mensagem: string, tipo: eModalTipo) => void;
}

function FormularioCompraLoaded({
    ordemCompraFormulario,
    listaItens,
    gravaOrdemCompra,
    cancelar,
    confirmaGravar,
    displayMensagem,
    cancelado,
}: FormularioCompraLoadedProp) {
    let novoRegistro = (ordemCompraFormulario?.id ?? 0) === 0;

    const [listaItensComprados, setListaItensComprados] = useState<
        ItemQuantidade[]
    >([]);

    const [valorTotal, setValorTotal] = useState(
        ordemCompraFormulario
            ? ordemCompraFormulario.itensComprados.reduce(
                  (prevVal, currVal) => prevVal + (currVal.valor ?? 0),
                  0,
              )
            : 0,
    );

    const [aguardandoConfimacao, setAguardandoConfimacao] = useState(false);

    function validaValores() {
        if (
            listaItensComprados.length === 0 ||
            listaItensComprados.every(li => li.id === 0)
        ) {
            return 'Selecione pelo menos um item na compra';
        }

        const itensSemQuantidade = listaItensComprados
            .filter(li => li.qtd <= 0)
            .map(li => li.id);
        if (itensSemQuantidade.length > 0) {
            const descricoesItensSemQuantidade = listaItens
                .filter(lmp => itensSemQuantidade.includes(lmp.item.id))
                .map(lmp => lmp.item.descricao)
                .join(',');

            return `Informe a quantidade comprada do(s) item(ns): ${descricoesItensSemQuantidade}`;
        }

        const itensSemValor = listaItensComprados
            .filter(li => (li.valor ?? 0) <= 0)
            .map(li => li.id);
        if (itensSemValor.length > 0) {
            const descricoesItensSemValor = listaItens
                .filter(lmp => itensSemValor.includes(lmp.item.id))
                .map(lmp => lmp.item.descricao)
                .join(',');

            return `Informe o valor total gasto na compra do(s) item(ns): ${descricoesItensSemValor}`;
        }

        return '';
    }

    const trataGravar = useCallback(
        (id: number, itensComprados: ItemQuantidade[], inclusao: string) => {
            async function handleGravar() {
                setAguardandoConfimacao(false);

                try {
                    await gravaOrdemCompra({
                        id: id,
                        itensComprados: itensComprados,
                        inclusao: inclusao,
                    });

                    displayMensagem(
                        'Foi gravado com sucesso',
                        eModalTipo.Sucesso,
                    );
                } catch (e) {
                    if (e instanceof Error) {
                        displayMensagem(e.message, eModalTipo.Erro);
                        console.log(e.stack);
                    }
                }
            }

            handleGravar();
        },
        [displayMensagem, gravaOrdemCompra],
    );

    if (aguardandoConfimacao && cancelado !== undefined && !cancelado) {
        trataGravar(
            ordemCompraFormulario?.id ?? 0,
            listaItensComprados,
            ordemCompraFormulario?.inclusao ?? new Date().toISOString(),
        );
    }

    let descricaoFormulario = 'Adição Compra';

    if (!novoRegistro) {
        let inclusaoFormatar = new Date(ordemCompraFormulario?.inclusao ?? '');

        descricaoFormulario = `Edição Compra - #${
            ordemCompraFormulario?.id
        } ${formataDataDisplay(inclusaoFormatar)}`;
    }

    function handleItensCompraChange(val: ItemQuantidade[]) {
        const totalCalculado = val.reduce(
            (prevVal, currVal) => prevVal + (currVal.valor ?? 0),
            0,
        );

        if (totalCalculado !== valorTotal) {
            setValorTotal(totalCalculado);
        }

        setListaItensComprados(val);
    }

    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleFormularioUtil.containerFormulario,
            ]}>
            <Text
                style={[
                    styleFormularioUtil.titleFormulario,
                    styleUtil.titleText,
                ]}>
                {descricaoFormulario}
            </Text>
            <Text
                style={[styleUtil.contentText, styleFormularioUtil.totalValor]}>
                Total: R$ {convertNumberToMaskedNumber(valorTotal)}
            </Text>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.inputContainerFormulario,
                ]}>
                <MultipleItemQuantidade
                    title="Itens Compra"
                    listaItens={listaItens}
                    valoresIniciais={ordemCompraFormulario?.itensComprados}
                    incluiValor
                    onChange={handleItensCompraChange}
                    placeholderQtdInput="Quantidade comprada"
                />
            </View>
            <View
                style={[
                    styleUtil.alignCenter,
                    styleFormularioUtil.buttonContainerFormulario,
                ]}>
                <ButtonWithStyle
                    title={novoRegistro ? 'Adicionar' : 'Gravar'}
                    onPress={() => {
                        let mensagem = validaValores();
                        if (mensagem.trim() !== '') {
                            displayMensagem(mensagem, eModalTipo.Erro);
                            return;
                        }

                        confirmaGravar();
                        setAguardandoConfimacao(true);
                    }}
                    style={[styleUtil.button, styleUtil.actionButton]}
                />
                <ButtonWithStyle
                    title="Cancelar"
                    onPress={cancelar}
                    style={[styleUtil.button, styleUtil.cancelaButton]}
                />
            </View>
        </View>
    );
}

export function FormularioCompra({
    id,
    cancelado,
}: FormularioEstoqueProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [
        cancelar,
        confirmaGravar,
        displayMensagem,
        ordemCompraFormulario,
        listaItens,
        gravaOrdemCompra,
        loading,
    ] = useFormularioOrdemCompra(casoUsoInit, id);

    return (
        <View>
            {!loading ? (
                <FormularioCompraLoaded
                    ordemCompraFormulario={ordemCompraFormulario}
                    listaItens={listaItens}
                    gravaOrdemCompra={gravaOrdemCompra}
                    cancelar={cancelar}
                    confirmaGravar={confirmaGravar}
                    displayMensagem={displayMensagem}
                    cancelado={cancelado}
                />
            ) : (
                <Text>loading</Text>
            )}
        </View>
    );
}

export interface EstoqueModalOpcoesProp {
    id: number;
    cancelado?: boolean;
}

export function EstoqueModalOpcoesMateriaPrima({
    id,
    cancelado,
}: EstoqueModalOpcoesProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [deleta] = useDeletaMateriaPrima(casoUsoInit);
    const natigation = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function editar() {
        natigation.navigate('EstoqueGerenciamento', {
            componenteEstoqueTipo: eComponenteEstoqueTipo.MateriaPrima,
            id: id,
        });
    }

    function confimaExclusao() {
        natigation.navigate('EstoqueModalInfo', {
            tipo: eModalTipo.Aviso,
            mensagem: 'Deseja excluir o registro selecionado?',
            redirecionaConfirma: 'EstoqueModalOpcoes',
            redirecionaCancela: 'EstoqueVisualizacao',
        });
    }

    const trataExclui = useCallback(
        (idExclui: number) => {
            async function handleExclui() {
                try {
                    await deleta(idExclui);
                    natigation.navigate('EstoqueVisualizacao');
                } catch (e) {
                    if (e instanceof Error) {
                        natigation.navigate('EstoqueModalInfo', {
                            tipo: eModalTipo.Erro,
                            mensagem: e.message,
                            redirecionaConfirma: 'EstoqueVisualizacao',
                        });
                    }
                }
            }

            handleExclui();
        },
        [deleta, natigation],
    );

    if (cancelado !== undefined) {
        trataExclui(id);
    }

    return (
        <View
            style={[
                styleScreenUtil.alignCenter,
                styleModalOpcoes.containerModalOption,
            ]}>
            <ButtonWithStyle
                title="Editar"
                onPress={editar}
                style={[styleUtil.button, styleUtil.actionButton]}
            />
            <ButtonWithStyle
                title="Excluir"
                onPress={confimaExclusao}
                style={[styleUtil.button, styleUtil.cancelaButton]}
            />
        </View>
    );
}

export function EstoqueModalOpcoesProduto({
    id,
    cancelado,
}: EstoqueModalOpcoesProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [deleta] = useDeletaProduto(casoUsoInit);
    const natigation = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function editar() {
        natigation.navigate('EstoqueGerenciamento', {
            componenteEstoqueTipo: eComponenteEstoqueTipo.Produto,
            id: id,
        });
    }

    function confimaExclusao() {
        natigation.navigate('EstoqueModalInfo', {
            tipo: eModalTipo.Aviso,
            mensagem: 'Deseja excluir o registro selecionado?',
            redirecionaConfirma: 'EstoqueModalOpcoes',
            redirecionaCancela: 'EstoqueVisualizacao',
        });
    }

    const trataExclui = useCallback(
        (idExclui: number) => {
            async function handleExclui() {
                try {
                    await deleta(idExclui);
                    natigation.navigate('EstoqueVisualizacao');
                } catch (e) {
                    if (e instanceof Error) {
                        natigation.navigate('EstoqueModalInfo', {
                            tipo: eModalTipo.Erro,
                            mensagem: e.message,
                            redirecionaConfirma: 'EstoqueVisualizacao',
                        });
                    }
                }
            }

            handleExclui();
        },
        [deleta, natigation],
    );

    if (cancelado !== undefined) {
        trataExclui(id);
    }

    return (
        <View
            style={[
                styleScreenUtil.alignCenter,
                styleModalOpcoes.containerModalOption,
            ]}>
            <ButtonWithStyle
                title="Editar"
                onPress={editar}
                style={[styleUtil.button, styleUtil.actionButton]}
            />
            <ButtonWithStyle
                title="Excluir"
                onPress={confimaExclusao}
                style={[styleUtil.button, styleUtil.cancelaButton]}
            />
        </View>
    );
}

export function EstoqueModalOpcoesReceita({
    id,
    cancelado,
}: EstoqueModalOpcoesProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [deleta] = useDeletaReceita(casoUsoInit);
    const natigation = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function editar() {
        natigation.navigate('EstoqueGerenciamento', {
            componenteEstoqueTipo: eComponenteEstoqueTipo.Receitas,
            id: id,
        });
    }

    function confimaExclusao() {
        natigation.navigate('EstoqueModalInfo', {
            tipo: eModalTipo.Aviso,
            mensagem: 'Deseja excluir o registro selecionado?',
            redirecionaConfirma: 'EstoqueModalOpcoes',
            redirecionaCancela: 'EstoqueVisualizacao',
        });
    }

    const trataExclui = useCallback(
        (idExclui: number) => {
            async function handleExclui() {
                try {
                    await deleta(idExclui);
                    natigation.navigate('EstoqueVisualizacao');
                } catch (e) {
                    if (e instanceof Error) {
                        natigation.navigate('EstoqueModalInfo', {
                            tipo: eModalTipo.Erro,
                            mensagem: e.message,
                            redirecionaConfirma: 'EstoqueVisualizacao',
                        });
                    }
                }
            }

            handleExclui();
        },
        [deleta, natigation],
    );

    if (cancelado !== undefined) {
        trataExclui(id);
    }

    return (
        <View
            style={[
                styleScreenUtil.alignCenter,
                styleModalOpcoes.containerModalOption,
            ]}>
            <ButtonWithStyle
                title="Editar"
                onPress={editar}
                style={[styleUtil.button, styleUtil.actionButton]}
            />
            <ButtonWithStyle
                title="Excluir"
                onPress={confimaExclusao}
                style={[styleUtil.button, styleUtil.cancelaButton]}
            />
        </View>
    );
}

export function EstoqueModalOpcoesCompra({
    id,
    cancelado,
}: EstoqueModalOpcoesProp): React.JSX.Element {
    const casoUsoInit = useContext(CasoUso);

    const [deleta] = useDeletaOrdemCompra(casoUsoInit);
    const natigation = useNavigation<EstoqueGerenciamentoProps['navigation']>();

    function editar() {
        natigation.navigate('EstoqueGerenciamento', {
            componenteEstoqueTipo: eComponenteEstoqueTipo.Compras,
            id: id,
        });
    }

    function confimaExclusao() {
        natigation.navigate('EstoqueModalInfo', {
            tipo: eModalTipo.Aviso,
            mensagem: 'Deseja excluir o registro selecionado?',
            redirecionaConfirma: 'EstoqueModalOpcoes',
            redirecionaCancela: 'EstoqueVisualizacao',
        });
    }

    const trataExclui = useCallback(
        (idExclui: number) => {
            async function handleExclui() {
                try {
                    await deleta(idExclui);
                    natigation.navigate('EstoqueVisualizacao');
                } catch (e) {
                    if (e instanceof Error) {
                        natigation.navigate('EstoqueModalInfo', {
                            tipo: eModalTipo.Erro,
                            mensagem: e.message,
                            redirecionaConfirma: 'EstoqueVisualizacao',
                        });
                    }
                }
            }

            handleExclui();
        },
        [deleta, natigation],
    );

    if (cancelado !== undefined) {
        trataExclui(id);
    }

    return (
        <View
            style={[
                styleScreenUtil.alignCenter,
                styleModalOpcoes.containerModalOption,
            ]}>
            <ButtonWithStyle
                title="Editar"
                onPress={editar}
                style={[styleUtil.button, styleUtil.actionButton]}
            />
            <ButtonWithStyle
                title="Excluir"
                onPress={confimaExclusao}
                style={[styleUtil.button, styleUtil.cancelaButton]}
            />
        </View>
    );
}
