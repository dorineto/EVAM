/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Dashboard from './Presenters/Screens/Dashboard';
import Estoque from './Presenters/Screens/Estoque';
import Vendas from './Presenters/Screens/Vendas';
import Configuracoes from './Presenters/Screens/Configuracoes';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconName} from '@fortawesome/fontawesome-svg-core';

import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faChartPie,
  faBoxesStacked,
  faReceipt,
  faGears,
} from '@fortawesome/free-solid-svg-icons';

library.add(faChartPie, faBoxesStacked, faReceipt, faGears);

const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
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
                <FontAwesomeIcon
                  icon={['fas', iconName]}
                  color={color}
                  size={size}
                />
              );
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}>
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="Estoque" component={Estoque} />
          <Tab.Screen name="Vendas" component={Vendas} />
          <Tab.Screen name="Configuracoes" component={Configuracoes} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
