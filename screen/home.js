import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

import MainScreen from './mainscreen'
import ResultScreen from './resultscreen'

export default class Home extends React.Component{
    render(){
        return(
            <Stack.Navigator>
                <Stack.Screen name='main' component={MainScreen} options={{title:'Trang Chủ',headerTitleAlign:'center'}}/>
                <Stack.Screen name='result' component={ResultScreen} options={({route})=>({title:route.params.query})}/>
            </Stack.Navigator>
        )
    }
}