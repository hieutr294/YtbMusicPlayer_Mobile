import React from 'react'
import {View,Text,FlatList,TextInput,StyleSheet,TouchableOpacity,Button} from 'react-native'
import axios from 'axios'

class MainScreen extends React.Component{
    constructor(){
        super()
        this.state={
            suggetData:[],
            searchData:[],
            value:'',
            isHiden:false
        }
    }

    getAutoComplteData(text){
        axios.get(`https://suggestqueries.google.com/complete/search?ds=yt&client=firefox&hjson=t&q=${text}&alt=json`)
        .then(res=>{
            this.setState({suggetData:res.data[1]})
        })
        .catch(err=>{console.log(err)})
        this.setState({value:text})
    }

    sendQuery(){
        this.props.navigation.navigate('result',{query:this.state.value})
    }

    render(){
        return(
            <View style={{backgroundColor:'white'}}>
                    <View >
                        <TextInput 
                            style={style.textinput}
                            onChangeText={(text)=>this.getAutoComplteData(text)}
                            onSubmitEditing={this.sendQuery}
                            defaultValue={this.state.value}
                        />
                        <FlatList
                            data={this.state.suggetData}
                            renderItem={({item})=>(
                                <TouchableOpacity onPress={()=>{this.setState({value:item})}}>
                                    <Text style={style.suggets}>{item}</Text>
                                </TouchableOpacity>
            
                            )}
                            keyExtractor={item=>item.id}
                        />
                    </View>

            </View>
        )
    }

}