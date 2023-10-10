import React, {useMemo, useState} from 'react';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
    DimensionValue,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    useWindowDimensions,
} from 'react-native';
import MaskInput, {Masks, createNumberMask} from 'react-native-mask-input';
import {EstoqueModalInfoProps, VendaModalInfoProps} from '../Navigation/types';
import {CommonActions} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    ItemEstoque,
    ItemMensurado,
    ItemOrdem,
    ItemReceita,
} from '../../Entidades/Item';
import _ from 'lodash';
import {SelectList} from 'react-native-dropdown-select-list';
import {ItemQuantidade} from '../Controlles/Util';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

export const QtdMask = createNumberMask({
    delimiter: '.',
    separator: ',',
    precision: 2,
});

export function useScreenScrollViewHeight(): number {
    const bottomTabHeight = useBottomTabBarHeight();
    const windowDimension = useWindowDimensions();

    return windowDimension.height - bottomTabHeight;
}

export enum eModalTipo {
    Sucesso = 1,
    Aviso = 2,
    Info = 3,
    Erro = 4,
}

export function ModalInfo({
    navigation,
    route: {
        params: {tipo, mensagem, redirecionaConfirma, redirecionaCancela},
    },
}: EstoqueModalInfoProps | VendaModalInfoProps) {
    let titulo: string;
    let tituloStyle: object;
    switch (tipo) {
        case eModalTipo.Sucesso:
            titulo = 'Sucesso';
            tituloStyle = styleModalInfo.titleSucesso;
            break;
        case eModalTipo.Aviso:
            titulo = 'Atenção';
            tituloStyle = styleModalInfo.titleAtencao;
            break;
        case eModalTipo.Info:
            titulo = 'Informativo';
            tituloStyle = styleModalInfo.titleInformativo;
            break;
        case eModalTipo.Erro:
            titulo = 'Erro';
            tituloStyle = styleModalInfo.titleErro;
            break;
        default:
            throw new Error('Tipo modal não identificado');
    }

    function handlePress(cancela: boolean) {
        let redirecionaAcao = cancela
            ? redirecionaCancela ?? 'volta'
            : redirecionaConfirma;

        switch (redirecionaAcao) {
            case 'volta':
                navigation.goBack();
                break;
            case 'EstoqueVisualizacao':
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'EstoqueVisualizacao',
                        params: {cancelado: cancela},
                        merge: true,
                    }),
                );
                break;
            case 'EstoqueGerenciamento':
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'EstoqueGerenciamento',
                        params: {cancelado: cancela},
                        merge: true,
                    }),
                );
                break;
            case 'EstoqueModalOpcoes':
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'EstoqueModalOpcoes',
                        params: {cancelado: cancela},
                        merge: true,
                    }),
                );
                break;
            case 'VendaVisualizacao':
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'VendaVisualizacao',
                        params: {cancelado: cancela},
                        merge: true,
                    }),
                );
                break;
            case 'VendaGerenciamento':
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'VendaGerenciamento',
                        params: {cancelado: cancela},
                        merge: true,
                    }),
                );
                break;
            case 'VendaModalOpcoes':
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'VendaModalOpcoes',
                        params: {cancelado: cancela},
                        merge: true,
                    }),
                );
                break;
            default:
                throw new Error('Ação de redirecionamento não identificado');
        }
    }

    return (
        <View
            style={[
                styleScreenUtil.alignCenter,
                styleScreenUtil.containerFillScreen,
                styleScreenUtil.backgroundOpaque,
            ]}>
            <View
                style={[
                    styleScreenUtil.alignCenter,
                    styleModalInfo.containerModal,
                ]}>
                <Text
                    style={[
                        styleUtil.titleText,
                        styleModalInfo.titleModal,
                        tituloStyle,
                    ]}>
                    {titulo}
                </Text>
                <View
                    style={[
                        styleUtil.alignCenter,
                        styleModalInfo.contentContainerModal,
                    ]}>
                    <Text
                        style={[
                            styleUtil.contentText,
                            styleModalInfo.messageModal,
                        ]}>
                        {mensagem}
                    </Text>
                    <ButtonWithStyle
                        title="Confirmar"
                        onPress={() => handlePress(false)}
                        style={[styleUtil.button, styleUtil.actionButton]}
                    />
                    {tipo === eModalTipo.Aviso && (
                        <ButtonWithStyle
                            title="Cancelar"
                            onPress={() => handlePress(true)}
                            style={[styleUtil.button, styleUtil.cancelaButton]}
                        />
                    )}
                </View>
            </View>
        </View>
    );
}

export function ButtonWithStyle(
    props: TouchableOpacityProps & {title: string | React.JSX.Element},
): React.JSX.Element {
    return (
        <TouchableOpacity {...props}>
            {typeof props.title === 'string' ? (
                <Text
                    style={[
                        props.style,
                        styleUtil.textAlignCenter,
                        {
                            backgroundColor: undefined,
                            borderColor: undefined,
                            borderWidth: undefined,
                            padding: undefined,
                        },
                    ]}>
                    {props.title}
                </Text>
            ) : (
                props.title
            )}
        </TouchableOpacity>
    );
}

const styleModalInfo = StyleSheet.create({
    containerModal: {
        backgroundColor: '#E2E2E2',
        borderColor: '#D8D8D8',
        borderWidth: 2,
        borderRadius: 15,
        padding: 20,
        width: '80%',
        gap: 10,
    },
    contentContainerModal: {
        width: '90%',
        gap: 10,
    },
    titleModal: {
        width: '100%',
        padding: 10,
        borderRadius: 50,
        color: '#fff',
    },
    titleAtencao: {
        backgroundColor: '#E58298',
    },
    titleInformativo: {
        backgroundColor: '#8E49A9',
    },
    titleSucesso: {
        backgroundColor: '#BC8ECF',
    },
    titleErro: {
        backgroundColor: '#D84061',
    },
    messageModal: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});

export const styleScreenUtil = StyleSheet.create({
    containerFillScreen: {
        height: '100%',
        width: '100%',
    },
    containerFillScreenHorizontal: {
        width: '100%',
    },
    alignTopCenter: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    alignBottomCenter: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    alignCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundOpaque: {backgroundColor: 'rgba(0, 0, 0, 0.3)'},
    screenContent: {
        gap: 20,
        padding: 20,
    },
});

export const styleUtil = StyleSheet.create({
    alignCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 26.4,
        letterSpacing: -0.7,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 26,
        letterSpacing: -0.7,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    nestedSubTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 23.4,
        letterSpacing: -0.7,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    contentText: {
        fontSize: 16,
        letterSpacing: -1,
        lineHeight: 20.8,
    },
    button: {
        width: '100%',
        color: '#fff',
        borderRadius: 50,
        fontSize: 16,
        letterSpacing: -1,
        lineHeight: 20.8,
        padding: 10,
    },
    buttonIcon: {
        width: undefined,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelaButton: {
        backgroundColor: '#D84061',
        borderColor: '#CE3657',
        borderWidth: 2,
    },
    actionButton: {
        backgroundColor: '#B180C5',
        borderColor: '#AF84C0',
        borderWidth: 2,
    },
    textAlignCenter: {
        textAlign: 'center',
        verticalAlign: 'middle',
    },
});

export const styleFormularioUtil = StyleSheet.create({
    viewContainer: {
        width: '100%',
    },
    containerFormulario: {
        backgroundColor: '#E2E2E2',
        borderColor: '#D8D8D8',
        borderWidth: 2,
        borderRadius: 15,
        padding: 10,
        minWidth: '90%', // Não sei, mas só respeita quando é minwidth, talvés depois pesquisar melhor o que está acontecendo
    },
    titleFormulario: {
        backgroundColor: '#8E49A9',
        borderRadius: 50,
        padding: 10,
        color: '#fff',
        width: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    inputContainerFormulario: {
        width: '90%',
    },
    inputFormulario: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E7E7E7',
        borderWidth: 2,
        padding: 15,
        borderRadius: 15,
        width: '100%',
    },
    containerDropdownList: {
        width: '100%',
        flexDirection: 'row',
    },
    containerDropdownListVertical: {
        flexDirection: 'column',
    },
    inputDropdownList: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E7E7E7',
        borderWidth: 2,
        padding: 15,
        borderRadius: 15,
        flexGrow: 0.3,
    },
    inputDropdownListVertical: {
        flexGrow: undefined,
    },
    inputSideDropdownList: {
        width: 'auto',
        flexGrow: 0.7,
    },
    buttonContainerFormulario: {
        width: '90%',
    },
    totalValor: {
        backgroundColor: '#B180C5',
        padding: 10,
        color: '#fff',
        borderRadius: 15,
    },
});

export function formataDataDisplay(data: Date) {
    if (!data) {
        return '';
    }

    const formatedDay = (data.getDate() < 10 ? '0' : '') + data.getDate();
    const formatedMonth =
        (data.getMonth() + 1 < 10 ? '0' : '') + (data.getMonth() + 1);

    return `${formatedDay}/${formatedMonth}/${data.getFullYear()}`;
}

export function convertMaskedNumberToNumber(maskedNumber: string): number {
    return Number(
        maskedNumber
            .replaceAll(/\.|R\$/g, '')
            .replace(',', '.')
            .trim(),
    );
}

export function convertNumberToMaskedNumber(
    numberVal: number | undefined,
): string {
    return numberVal?.toFixed(2).replace('.', ',') ?? '';
}

export type ItemQuantidadeInputProps = {
    itens: ItemEstoque[];
    tipo: 'produto' | 'item';
    valorInicial?: ItemQuantidade;
    onChange?: (value: ItemQuantidade) => void;
    widthDropDownList?: DimensionValue;
    placeholderQtdInput?: string;
    placeholderValorInput?: string;
    incluiValor?: boolean;
};

export function ItemQuantidadeInput({
    itens,
    tipo,
    valorInicial,
    onChange,
    widthDropDownList,
    placeholderQtdInput,
    placeholderValorInput,
    incluiValor = false,
}: ItemQuantidadeInputProps): React.JSX.Element {
    const itensInfo = useMemo(() => {
        const listaItens = itens.map(i => {
            return {
                key: i.item.id,
                value: i.item.descricao,
            };
        });

        const dictItens = itens.reduce(
            (lastVal: {[id: number]: ItemEstoque}, currValue) => {
                lastVal[currValue.item.id] = currValue;

                return lastVal;
            },
            {},
        );

        return {
            listaItens: listaItens,
            dictItens: dictItens,
        };
    }, [itens]);

    const [itemSelecionado, setItemSelecionado] = useState(
        itensInfo.dictItens[valorInicial?.id ?? 0],
    );

    const [qtdInp, setQtdInp] = useState(
        valorInicial?.qtd !== 0
            ? convertNumberToMaskedNumber(valorInicial?.qtd)
            : '',
    );

    const [valorInp, setValorInp] = useState(
        !incluiValor
            ? undefined
            : valorInicial?.valor !== 0
            ? convertNumberToMaskedNumber(valorInicial?.valor)
            : '',
    );

    function geraItemQuantidade(
        id: number,
        qtd: string,
        valor: string | undefined,
    ): ItemQuantidade {
        return {
            id: id,
            qtd: convertMaskedNumberToNumber(qtd),
            valor:
                valor !== undefined
                    ? convertMaskedNumberToNumber(valor)
                    : undefined,
        };
    }

    function onDropDownlistItemChange(key: number) {
        if (!key) {
            return;
        }

        setItemSelecionado(itensInfo.dictItens[key]);
    }

    function onDropDownlistItemSelect() {
        if (onChange) {
            onChange(
                geraItemQuantidade(
                    itemSelecionado?.item.id ?? 0,
                    qtdInp,
                    valorInp,
                ),
            );
        }
    }

    function onInputQtdChange(masked: string) {
        if (onChange) {
            onChange(
                geraItemQuantidade(
                    itemSelecionado?.item.id ?? 0,
                    masked,
                    valorInp,
                ),
            );
        }

        setQtdInp(masked);
    }

    function onInputValorChange(masked: string) {
        if (onChange) {
            onChange(
                geraItemQuantidade(
                    itemSelecionado?.item.id ?? 0,
                    qtdInp,
                    masked,
                ),
            );
        }

        setValorInp(masked.replace('R$', '').trim());
    }

    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleFormularioUtil.containerDropdownList,
                styleFormularioUtil.containerDropdownListVertical,
            ]}>
            <SelectList
                setSelected={onDropDownlistItemChange}
                onSelect={onDropDownlistItemSelect}
                data={itensInfo.listaItens}
                defaultOption={itensInfo.listaItens.find(
                    i => i.key === valorInicial?.id,
                )}
                placeholder={tipo === 'produto' ? 'Produto' : 'Item'}
                save="key"
                search={true}
                dropdownStyles={{
                    ...styleItemQuantidadeInput.inputDropdownList,
                    width: widthDropDownList,
                }}
                boxStyles={{
                    ...styleItemQuantidadeInput.inputDropdownList,
                    width: widthDropDownList,
                }}
                dropdownTextStyles={{
                    ...styleUtil.contentText,
                    width: widthDropDownList,
                }}
                inputStyles={{
                    ...styleUtil.contentText,
                    width: widthDropDownList,
                }}
                dropdownItemStyles={
                    styleItemQuantidadeInput.inputDropdownListDropdownItem
                }
                notFoundText="Não encontrado"
                searchPlaceholder="Pesquisar"
            />
            <View
                style={[
                    styleUtil.alignCenter,
                    styleItemQuantidadeInput.qtdInputConatiner,
                ]}>
                <MaskInput
                    mask={QtdMask}
                    placeholder={placeholderQtdInput}
                    value={qtdInp}
                    onChangeText={onInputQtdChange}
                    keyboardType="numeric"
                    style={[
                        styleFormularioUtil.inputFormulario,
                        styleUtil.contentText,
                        styleItemQuantidadeInput.qtdInput,
                    ]}
                />
                {itemSelecionado?.medida.abreviacao && (
                    <Text
                        style={[
                            styleUtil.contentText,
                            styleUtil.button,
                            styleUtil.actionButton,
                            styleUtil.textAlignCenter,
                            styleItemQuantidadeInput.abreviacaoLabel,
                        ]}>
                        {itemSelecionado?.medida.abreviacao}
                    </Text>
                )}
            </View>
            {incluiValor && (
                <MaskInput
                    mask={Masks.BRL_CURRENCY}
                    placeholder={placeholderValorInput}
                    value={valorInp}
                    onChangeText={onInputValorChange}
                    keyboardType="numeric"
                    style={[
                        styleFormularioUtil.inputFormulario,
                        styleUtil.contentText,
                    ]}
                />
            )}
        </View>
    );
}

const styleItemQuantidadeInput = StyleSheet.create({
    inputDropdownList: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E7E7E7',
        borderWidth: 2,
        padding: 10,
        borderRadius: 15,
    },
    inputDropdownListDropdownItem: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    abreviacaoLabel: {
        width: undefined,
        flexGrow: 0.4,
    },
    qtdInputConatiner: {flexDirection: 'row', width: '100%'},
    qtdInput: {width: undefined, flexGrow: 0.6},
});

export type MultipleItemQuantidadeProp = {
    title: string;
    listaItens: ItemEstoque[];
    valoresIniciais?: ItemQuantidade[] | null;
    incluiValor?: boolean;
    onChange?: (novaLista: ItemQuantidade[]) => void;
    placeholderQtdInput?: string;
    placeholderValorInput?: string;
    widthDropDownList?: DimensionValue;
};

export function MultipleItemQuantidade({
    title,
    listaItens,
    valoresIniciais,
    incluiValor = false,
    onChange,
    placeholderQtdInput = 'Quantidade utilizada',
    placeholderValorInput = 'Valor total',
    widthDropDownList = '95%',
}: MultipleItemQuantidadeProp): React.JSX.Element {
    const [listaItensQuantidade, setListaItensQuantidade] = useState(
        _.cloneDeep(valoresIniciais ?? []),
    );

    function handleAdd() {
        if (listaItensQuantidade.find(liq => liq.id === 0)) {
            return;
        }

        setListaItensQuantidade(value => [...value, {id: 0, qtd: 0}]);
    }

    function handleChangeItemQuantidadeInput(
        idItem: number,
        value: ItemQuantidade,
    ) {
        const listaItensQuantidadeAlterado = listaItensQuantidade.map(liq => {
            if (liq.id === idItem) {
                return {...value};
            }

            return liq;
        });

        if (onChange) {
            onChange(listaItensQuantidadeAlterado);
        }

        setListaItensQuantidade(listaItensQuantidadeAlterado);
    }

    function handleRemove(idItem: number) {
        const listaItensQuantidadeAlterado = listaItensQuantidade.filter(
            liq => liq.id !== idItem,
        );

        if (onChange) {
            onChange(listaItensQuantidadeAlterado);
        }

        setListaItensQuantidade(listaItensQuantidadeAlterado);
    }

    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleMultipleItemQuantidade.container,
            ]}>
            <Text
                style={[
                    styleUtil.subTitle,
                    styleMultipleItemQuantidade.titleElement,
                ]}>
                {title}
            </Text>
            {listaItensQuantidade.map(val => {
                return (
                    <View
                        key={val.id}
                        style={[
                            styleUtil.alignCenter,
                            styleMultipleItemQuantidade.containerInputs,
                        ]}>
                        <ButtonWithStyle
                            title={
                                <FontAwesomeIcon
                                    icon={['fas', 'xmark']}
                                    size={styleUtil.button.fontSize}
                                    color={styleUtil.button.color}
                                />
                            }
                            onPress={() => handleRemove(val.id)}
                            style={[
                                styleUtil.button,
                                styleUtil.buttonIcon,
                                styleUtil.cancelaButton,
                                styleMultipleItemQuantidade.removerBtn,
                            ]}
                        />
                        <ItemQuantidadeInput
                            itens={listaItens}
                            tipo="item"
                            valorInicial={val?.id !== 0 ? val : undefined}
                            incluiValor={incluiValor}
                            onChange={valor =>
                                handleChangeItemQuantidadeInput(val.id, valor)
                            }
                            widthDropDownList={widthDropDownList}
                            placeholderQtdInput={placeholderQtdInput}
                            placeholderValorInput={placeholderValorInput}
                        />
                    </View>
                );
            })}
            <ButtonWithStyle
                title={
                    <FontAwesomeIcon
                        icon={['fas', 'plus']}
                        size={styleUtil.button.fontSize * 1.3}
                        color={styleUtil.button.color}
                    />
                }
                onPress={handleAdd}
                style={[
                    styleUtil.button,
                    styleUtil.buttonIcon,
                    styleUtil.actionButton,
                ]}
            />
        </View>
    );
}

const styleMultipleItemQuantidade = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#D8D8D8',
        borderColor: '#CECECE',
        borderWidth: 2,
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    containerInputs: {
        width: '100%',
        backgroundColor: '#C4C4C4',
        borderColor: '#BABABA',
        borderWidth: 2,
        borderRadius: 15,
        padding: 10,
    },
    removerBtn: {
        alignSelf: 'flex-end',
    },
    titleElement: {
        color: '#fff',
        backgroundColor: '#A972BE',
        borderColor: '#9F68B4',
        borderWidth: 2,
        borderRadius: 20,
        width: '100%',
        padding: 10,
    },
});

export type RegistroItemListaItemProp = {
    item: ItemReceita | ItemOrdem | ItemMensurado;
    mostraValor?: boolean;
};

export function RegistroItemListaItem({
    item,
    mostraValor = false,
}: RegistroItemListaItemProp): React.JSX.Element {
    let valor: number | null = null;
    if ('valorTotal' in item || 'valorMediaUnidade' in item) {
        valor = 'valorTotal' in item ? item.valorTotal : item.valorMediaUnidade;
    }

    return (
        <View
            style={[styleRegistroItemListaItem.containerRegistroItemListaItem]}>
            <View
                style={[
                    styleRegistroItemListaItem.contentRegistroItemListaItem,
                    styleRegistroItemListaItem.iconRegistroItemListaItem,
                ]}>
                <FontAwesomeIcon
                    size={
                        styleRegistroItemListaItem.iconRegistroItemListaItem
                            .fontSize
                    }
                    icon={['fas', 'circle']}
                />
            </View>
            <Text
                style={[
                    styleUtil.contentText,
                    styleRegistroItemListaItem.contentRegistroItemListaItem,
                    mostraValor
                        ? styleRegistroItemListaItem.descricaoRegistroItemListaItem
                        : styleRegistroItemListaItem.expandidaDescricaoRegistroItemListaItem,
                ]}>
                {item.item.descricao}
            </Text>
            <Text
                style={[
                    styleUtil.contentText,
                    styleRegistroItemListaItem.contentRegistroItemListaItem,
                ]}>
                {item.qtd} {item.medida.abreviacao}
            </Text>
            {valor && mostraValor && (
                <Text
                    style={[
                        styleUtil.contentText,
                        styleRegistroItemListaItem.contentRegistroItemListaItem,
                    ]}>
                    R$ {valor.toFixed(2).replace('.', ',')}
                </Text>
            )}
        </View>
    );
}

const styleRegistroItemListaItem = StyleSheet.create({
    containerRegistroItemListaItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    iconRegistroItemListaItem: {
        fontSize: 8,
        paddingLeft: 5,
        width: '3%',
    },
    contentRegistroItemListaItem: {
        flexGrow: 1,
        textAlign: 'left',
        textAlignVertical: 'center',
        width: '23%',
    },
    descricaoRegistroItemListaItem: {
        width: '45%',
    },
    expandidaDescricaoRegistroItemListaItem: {
        width: '65%',
    },
});

export type ButtonFormProp = {
    icon: IconProp;
    title?: string;
    onPress: () => void;
};

export function ButtonForm({
    icon,
    title,
    onPress,
}: ButtonFormProp): React.JSX.Element {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styleButtonEstoqueForm.containerButtonEstoqueForm]}>
                {title && (
                    <View
                        style={[styleButtonEstoqueForm.titleButtonEstoqueForm]}>
                        <Text
                            style={[
                                styleButtonEstoqueForm.titleButtonEstoqueForm,
                                styleUtil.contentText,
                            ]}>
                            {title}
                        </Text>
                    </View>
                )}
                <View style={[styleButtonEstoqueForm.iconButtonEstoqueForm]}>
                    <FontAwesomeIcon
                        style={[styleButtonEstoqueForm.iconButtonEstoqueForm]}
                        size={
                            styleButtonEstoqueForm.iconButtonEstoqueForm
                                .fontSize
                        }
                        icon={icon}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styleButtonEstoqueForm = StyleSheet.create({
    containerButtonEstoqueForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    titleButtonEstoqueForm: {
        backgroundColor: '#A972BE',
        borderColor: '#9F68B4',
        color: '#fff',
        padding: 5,
        borderRadius: 50,
    },
    iconButtonEstoqueForm: {
        fontSize: 25,
        padding: 10,
        color: '#fff',
        backgroundColor: '#A972BE',
        borderColor: '#9F68B4',
        borderWidth: 2,
        borderRadius: 50,
        fontWeight: 'bold',
    },
});

export const styleModalOpcoes = StyleSheet.create({
    containerModalOption: {
        width: '100%',
        backgroundColor: '#D5D5D5',
        padding: 20,
        gap: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
});

export type KeyValueEntrie = {
    key: number;
    value: string;
};

export type DropDownListWithAddProps = {
    itens: KeyValueEntrie[];
    valorInicial?: number;
    onChange?: (value: KeyValueEntrie) => void;
    widthDropDownList?: DimensionValue;
    placeholderDropDownList?: string;
    addText?: string;
    placeholderInputAdd?: string;
    maxLengthValorImputado?: number;
};

export function DropDownListWithAdd({
    itens,
    valorInicial,
    onChange,
    widthDropDownList,
    placeholderDropDownList,
    addText = 'Adicione novo registro',
    placeholderInputAdd,
    maxLengthValorImputado = 255,
}: DropDownListWithAddProps): React.JSX.Element {
    const itensInfo = useMemo(() => {
        const listaItens: KeyValueEntrie[] = [
            {key: 0, value: addText},
            ...itens,
        ];

        const dictItens = itens.reduce(
            (lastVal: {[id: number]: KeyValueEntrie}, currValue) => {
                lastVal[currValue.key] = currValue;

                return lastVal;
            },
            {},
        );

        return {
            listaItens: listaItens,
            dictItens: dictItens,
        };
    }, [addText, itens]);

    const [change, setChanged] = useState(false);

    const [itemSelecionado, setItemSelecionado] = useState(
        itensInfo.dictItens[valorInicial ?? 0],
    );

    const [valorImputado, setValorImputado] = useState('');

    function geraKeyValueEntrie(key: number, value: string): KeyValueEntrie {
        return {
            key: key,
            value: value,
        };
    }

    function onDropDownlistItemChange(key: number) {
        setItemSelecionado(itensInfo.dictItens[key]);
    }

    function onDropDownlistItemSelect() {
        const selecionadoAdd = (itemSelecionado?.key ?? 0) === 0;

        if (onChange) {
            onChange(
                geraKeyValueEntrie(
                    itemSelecionado?.key ?? 0,
                    selecionadoAdd
                        ? valorImputado
                        : itemSelecionado?.value ?? '',
                ),
            );
        }

        if (!selecionadoAdd && valorImputado.trim() !== '') {
            setValorImputado('');
        }

        if (!change) {
            setChanged(true);
        }
    }

    function onValorImputadoChage(valor: string) {
        if (onChange) {
            onChange(geraKeyValueEntrie(0, valor));
        }

        setValorImputado(valor);

        if (!change) {
            setChanged(true);
        }
    }

    return (
        <View
            style={[
                styleUtil.alignCenter,
                styleFormularioUtil.containerDropdownList,
                styleFormularioUtil.containerDropdownListVertical,
            ]}>
            <SelectList
                setSelected={onDropDownlistItemChange}
                onSelect={onDropDownlistItemSelect}
                data={itensInfo.listaItens}
                defaultOption={itensInfo.listaItens.find(
                    i => i.key === valorInicial,
                )}
                placeholder={placeholderDropDownList}
                save="key"
                search={true}
                dropdownStyles={{
                    ...styleDropDownListWithAdd.inputDropdownList,
                    width: widthDropDownList,
                }}
                boxStyles={{
                    ...styleDropDownListWithAdd.inputDropdownList,
                    width: widthDropDownList,
                }}
                dropdownTextStyles={{
                    ...styleUtil.contentText,
                    width: widthDropDownList,
                }}
                inputStyles={{
                    ...styleUtil.contentText,
                    width: widthDropDownList,
                }}
                dropdownItemStyles={
                    styleDropDownListWithAdd.inputDropdownListDropdownItem
                }
                notFoundText="Não encontrado"
                searchPlaceholder="Pesquisar"
            />
            {(itemSelecionado?.key ?? 0) === 0 && change && (
                <TextInput
                    placeholder={placeholderInputAdd}
                    value={valorImputado}
                    onChangeText={onValorImputadoChage}
                    maxLength={maxLengthValorImputado}
                    style={[
                        styleFormularioUtil.inputFormulario,
                        styleUtil.contentText,
                    ]}
                />
            )}
        </View>
    );
}

const styleDropDownListWithAdd = StyleSheet.create({
    inputDropdownList: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E7E7E7',
        borderWidth: 2,
        padding: 10,
        borderRadius: 15,
    },
    inputDropdownListDropdownItem: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
