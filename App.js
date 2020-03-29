import React from 'react';

import { ApplicationProvider, Layout, Icon,IconRegistry } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import 'react-native-gesture-handler';

import Home from './screen/home'
import PlayScreen from './screen/playscreen'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { NavigationContainer } from '@react-navigation/native';

import {createStore} from 'redux'
import {Provider} from 'react-redux'
import setIdReducer from './reducers/setId.reducer'

const Tab = createBottomTabNavigator()

let appStore = {
  id:''
}

const store = createStore(setIdReducer,appStore)

class App extends React.Component{
  constructor(){
    super()
  }
  render(){
    return(
      <Provider store={store}>
        <React.Fragment>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <NavigationContainer>
              <Tab.Navigator>
                <Tab.Screen name='home' component={Home} options={tabOption.tab1}/>
                <Tab.Screen name='player' component={PlayScreen} options={tabOption.tab2}/>
              </Tab.Navigator>
            </NavigationContainer>
          </ApplicationProvider>
        </React.Fragment>
      </Provider>
    )
  }
}
const tabOption = {
  tab1:{
    title:'Trang Chủ',
    headerTitleAlign:'center',
    tabBarIcon:({color,size})=>(
      <Icon fill='black' width='24' height='24' name='home' />
    )
  },
  tab2:{
    title:'Player',
    tabBarIcon:({color,size})=>(
      <Icon fill='black' width='24' height='24' name='music' />
    )
  }
}
export default App;
console.disableYellowBox = true;