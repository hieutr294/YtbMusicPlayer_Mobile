import React from 'react'
import {View,FlatList,StyleSheet,TouchableOpacity} from 'react-native'
import axios from 'axios'
import cheerio from 'react-native-cheerio'
import Item from '../component/item'
import { connect } from 'react-redux';
import {setId} from '../actions/index'

class MainScreen extends React.Component{
    constructor(){
        super()
        this.state={
            trending:[]
        }
        this.getYtbTrendingData = this.getYtbTrendingData.bind(this)
    }

    async getYtbTrendingData(){
        var arrLink2 = []
        await axios.get(`https://www.youtube.com/feed/trending?bp=4gIuCggvbS8wNHJsZhIiUExGZ3F1TG5MNTlhbW42X05FZFc5TGswZDdXZWVST0Q2VA%3D%3D`)
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
            
            arrLink2=arrLink
        })
        return arrLink2
    }

    componentDidMount(){
        this.getYtbTrendingData().then(result=>{
            this.setState({trending:this.state.trending.concat(result)})
        })
    }

    render(){
        return(
            <View style={{backgroundColor:'white'}}>
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
    trending:{
        backgroundColor:'white',
        height:'100%'
    }
})

export default connect(state=>{return{}},dispatch=>{
    return{
        onPressItem:(id)=>{dispatch(setId(id))}
    }
})(MainScreen)