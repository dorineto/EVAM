import React from 'react';
import {createContext} from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import {
    NavigationContainer,
    RouteProp,
    ParamListBase,
} from '@react-navigation/native';
import {
    createBottomTabNavigator,
    BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';

import {Provider} from 'react-redux';

//import Dashboard from './Presenters/Screens/Dashboard';
import Estoque from './Presenters/Screens/Estoque';
import Vendas from './Presenters/Screens/Vendas';
//import Configuracoes from './Presenters/Screens/Configuracoes';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {library, IconName} from '@fortawesome/fontawesome-svg-core';
import {
    faChartPie,
    faBoxesStacked,
    faReceipt,
    faGears,
    faCaretDown,
    faBook,
    faTags,
    faBox,
    faShoppingCart,
    faPlus,
    faMinus,
    faCircle,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {StatusBar, View} from 'react-native';
import {ItemCasoUso} from './CasosUsos/ItemCasoUso';
import ItemRepositorioStub from './Data/ItemRepositorioStub';
import {Store} from './Presenters/Slicers/Store';
import {ReceitaCasoUso} from './CasosUsos/ReceitaCasoUso';
import {ReceitaRepositorioStub} from './Data/ReceitaRepositorioStub';
import {OrdemCompraCasoUso} from './CasosUsos/OrdemCompraCasoUso';
import {OrdemCompraRepositorioStub} from './Data/OrdemCompraRepositorioStub';
import {OrdemVendaCasoUso} from './CasosUsos/OrdemVendaCasoUso';
import {OrdemVendaRepositorioStub} from './Data/OrdemVendaRepostorioStub';
import { EvamSqliteUtil } from './Data/EvamSqliteUtil';

library.add(
    faChartPie,
    faBoxesStacked,
    faReceipt,
    faGears,
    faCaretDown,
    faBook,
    faTags,
    faBox,
    faShoppingCart,
    faPlus,
    faMinus,
    faCircle,
    faXmark,
);

const Tab = createBottomTabNavigator();

function renderIconsBar({
    route,
}: {
    route: RouteProp<ParamListBase, string>;
}): BottomTabNavigationOptions {
    const iconsRender = ({
        focused,
        color,
        size,
    }: {
        focused: boolean;
        color: string;
        size: number;
    }): React.ReactNode => {
        let iconName: IconName;

        if (route.name === 'Dashboard') {
            iconName = 'chart-pie';
        } else if (route.name === 'Estoque') {
            iconName = 'boxes-stacked';
        } else if (route.name === 'Vendas') {
            iconName = 'receipt';
        } else {
            iconName = 'gears';
        }

        return (
            <View
                style={{
                    backgroundColor: color,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: focused ? '#7F3A9A' : '#A36FB8',
                    padding: 7,
                    borderRadius: 100,
                }}>
                <FontAwesomeIcon
                    icon={['fas', iconName]}
                    color="#fff"
                    size={size}
                />
            </View>
        );
    };

    return {
        tabBarIcon: iconsRender,
        tabBarActiveTintColor: '#8E49A9',
        tabBarShowLabel: false,
        tabBarInactiveTintColor: '#AD79C2',
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: true,
    };
}

export type CasoUsoInit = {
    itemCasoUso: ItemCasoUso;
    receitaCasoUso: ReceitaCasoUso;
    ordemCompraCasoUso: OrdemCompraCasoUso;
    ordemVendaCasoUso: OrdemVendaCasoUso;
};

const evamSqliteUtil = new EvamSqliteUtil(true);

evamSqliteUtil.criaEstruturaBanco();

const itemRepositorio = new ItemRepositorioStub();

const casoUsoInit: CasoUsoInit = {
    itemCasoUso: new ItemCasoUso(itemRepositorio),
    receitaCasoUso: new ReceitaCasoUso(
        new ReceitaRepositorioStub(itemRepositorio),
        itemRepositorio,
    ),
    ordemCompraCasoUso: new OrdemCompraCasoUso(
        new OrdemCompraRepositorioStub(itemRepositorio),
        itemRepositorio,
    ),
    ordemVendaCasoUso: new OrdemVendaCasoUso(
        new OrdemVendaRepositorioStub(itemRepositorio),
        itemRepositorio,
    ),
};

export const CasoUso = createContext<CasoUsoInit>(casoUsoInit);

function App(): JSX.Element {
    return (
        <Provider store={Store}>
            <CasoUso.Provider value={casoUsoInit}>
                <SafeAreaProvider>
                    <StatusBar />
                    <NavigationContainer>
                        <Tab.Navigator
                            screenOptions={renderIconsBar}
                            initialRouteName="Estoque"
                            backBehavior="history">
                            {/* <Tab.Screen
                                name="Dashboard"
                                component={Dashboard}
                            /> */}
                            <Tab.Screen name="Estoque" component={Estoque} />
                            <Tab.Screen name="Vendas" component={Vendas} />
                            {/* <Tab.Screen
                                name="Configuracoes"
                                component={Configuracoes}
                            /> */}
                        </Tab.Navigator>
                    </NavigationContainer>
                </SafeAreaProvider>
            </CasoUso.Provider>
        </Provider>
    );
}

export default App;
