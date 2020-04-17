import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import {StyleSheet} from 'react-native'
import { Icon } from 'react-native-elements';
const Stack = createStackNavigator()

import MainScreen from './mainscreen'
import ResultScreen from './resultscreen'
import SearchScreen from './searchscreen'
export default class Home extends React.Component{
    render(){
        return(
            <Stack.Navigator>
                <Stack.Screen name='main' component={MainScreen} options={{
                    title:'Trang Chủ',
                    headerRight:()=>(<Icon name='search' onPress={()=>this.props.navigation.navigate('search')}/>),
                    headerRightContainerStyle:{
                        marginRight:'5%'
                    }
                    }}/>
                <Stack.Screen name='result' component={ResultScreen} options={({route})=>({title:route.params.query})}/>
                <Stack.Screen name='search' component={SearchScreen}/>
            </Stack.Navigator>
        )
    }
}

const style = StyleSheet.create({
    searchIcon:{

    }
})