import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import MainScreen from './screen/mainscreen'
import ResultScreen from './screen/resultscreen'
import PlayScreen from './screen/playscreen'

const Stack = createStackNavigator()

class App extends React.Component{
  constructor(){
    super()
  }
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='main' component={MainScreen} options={{title:'Trang Chủ',headerTitleAlign:'center'}}/>
          <Stack.Screen name='result' component={ResultScreen} options={({route})=>({title:route.params.query})}/>
          <Stack.Screen name='player' component={PlayScreen} options={{title:''}}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;
console.disableYellowBox = true;