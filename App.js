import React from 'react';
import 'react-native-gesture-handler';

import Home from './screen/home'
import PlayScreen from './screen/playscreen'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { NavigationContainer } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
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
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name='home' component={Home} options={tabOption.tab1}/>
            <Tab.Screen name='player' component={PlayScreen} options={tabOption.tab2}/>
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}
const tabOption = {
  tab1:{
    title:'Trang Chủ',
    headerTitleAlign:'center',
    tabBarIcon:()=>(
      <Icon name='home'/>
    )
  },
  tab2:{
    title:'Player',
    tabBarIcon:()=>(
      <Icon name='library-music'/>
    )
  }
}
export default App;
console.disableYellowBox = true;