import React from 'react'
import { SearchBar,Icon,Divider } from 'react-native-elements';
import {View,Text,FlatList,StyleSheet,TouchableOpacity,ScrollView} from 'react-native'
import axios from 'axios'
import cheerio from 'react-native-cheerio'
import Item from '../component/item'
import { connect } from 'react-redux';
import {setId} from '../actions/index'

class MainScreen extends React.Component{
    constructor(){
        super()
        this.state={
            suggetData:[],
            value:' ',
            isHiden:false,
            trending:[]
        }
        this.sendQuery = this.sendQuery.bind(this)
        this.getYtbData = this.getYtbData.bind(this)
    }

    getYtbData(){
        axios.get(`https://www.youtube.com/feed/trending?bp=4gIuCggvbS8wNHJsZhIiUExGZ3F1TG5MNTlhbW42X05FZFc5TGswZDdXZWVST0Q2VA%3D%3D`)
        .then(res=>{
            const $ = cheerio.load(res.data)
            let imgLink = []
            let arrLink = []
            let authors= []

            $('.yt-lockup-byline').map((i,el)=>{
                authors.push($(el).children().text())
            })

            $('.yt-thumb-simple').map((i,el)=>{
                if($(el).children().attr('src').includes('https')){
                    imgLink.push($(el).children().attr('src'))
                }else{
                    imgLink.push($(el).children().attr('data-thumb'))
                }
            })
        
            $('.yt-lockup-title').map((i,el)=>{
                arrLink.push({
                    title:$(el).children().first().text(),
                    id:$(el).children().attr('href').replace('/watch?v=',''),
                    img:imgLink[i],
			        author:authors[i]
                })
            })
            this.setState({trending:this.state.trending.concat(arrLink)})
        })
    }

    componentDidMount(){
        this.getYtbData()
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
            <View style={{backgroundColor:'white'}}>
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
                    <View style={style.trending}>
                        <FlatList
                            data={this.state.trending}
                            initialNumToRender={this.state.trending.length}
                            renderItem={({item})=>(
                                <TouchableOpacity onPress={()=>{
                                    this.props.onPressItem(item.id)
                                    this.props.navigation.navigate('player')
                                    }} >
                                    <Item channeltitle={item.author} thumbnail={item.img} title={item.title}/>
                                    
                                </TouchableOpacity>
                            )}
                            keyExtractor={item=>item.id}
                        />
                    </View>

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
    },
    trending:{
        backgroundColor:'white',
        height:'87%'
    }
})

export default connect(state=>{return{}},dispatch=>{
    return{
        onPressItem:(id)=>{dispatch(setId(id))}
    }
})(MainScreen)