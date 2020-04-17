import React from 'react'
import { SearchBar,Icon } from 'react-native-elements';
import {View,Text,FlatList,StyleSheet,TouchableOpacity} from 'react-native'
import axios from 'axios'

export default class SearchScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            value:'',
            suggetData:[]
        }
        this.sendQuery = this.sendQuery.bind(this)
    }

    getAutoComplteData(text){
        axios.get(`https://suggestqueries.google.com/complete/search?ds=yt&client=firefox&hjson=t&q=${text}&alt=json`)
        .then(res=>{
            this.setState({suggetData:res.data[1]})
        })
        .catch(err=>{console.log(err)})
        this.setState({value:text})
        if(text==''){
            this.setState({value:' '})
        }
    }

    sendQuery(){
        this.props.navigation.navigate('result',{query:this.state.value})
    }
    render(){
        return(
            <View >
                <SearchBar
                    platform='android'
                    searchIcon={(<Icon name='search'/>)}
                    value={this.state.value}
                    onChangeText={(text)=>this.getAutoComplteData(text)}
                    onSubmitEditing={this.sendQuery}
                    defaultValue=" "
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
        )
    }
}
const style = StyleSheet.create({
    textinput:{
        fontSize:17,
        borderColor:'gray',
        borderWidth:1,
        marginTop:'5%',
        marginLeft:'2%',
        marginRight:'2%',
        borderRadius:5
    },
    suggets:{
        textAlign:'center',
        fontSize:18,
        padding:5,
        marginLeft:'2%',
        marginRight:'2%'
    }
})