import React from 'react'
import {View,TouchableOpacity,FlatList} from 'react-native'
import Item from '../component/item'
import axios from 'axios'
import cheerio from 'react-native-cheerio'
import { connect } from 'react-redux';
import {setId} from '../actions/index'

class ResultScreen extends React.Component{
    constructor(){
        super()
        this.state={
            searchdatas:[]
        }
        this.page = 1
    }

    async getYtbSearchData(){
        var arrLink2 = []
        await axios.get(`https://www.youtube.com/results?search_query=${this.props.route.params.query}`)
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
        this.getYtbSearchData().then(result=>{
            this.setState({searchdatas:this.state.searchdatas.concat(result)})
        })
    }

    loadMore(){
        this.page+=1
        axios.get(`https://www.youtube.com/results?page=${this.page}&search_query=${this.props.route.params.query}`)
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
            this.setState({
                searchdatas:this.state.searchdatas.concat(arrLink)
            })
        })
    }
    render(){
        return(
            <View>
                <FlatList
                    data={this.state.searchdatas}
                    initialNumToRender={this.state.searchdatas.length}
                    renderItem={({item,index})=>(
                        <TouchableOpacity key={index} onPress={()=>{
                            this.props.navigation.navigate('player')
                            this.props.onPressItem(item.id)
                            }} >
                            <Item channeltitle={item.author} thumbnail={item.img} title={item.title}/>
                        </TouchableOpacity>
                    )}
                    onEndReached={()=>this.loadMore()}
                    onEndReachedThreshold={0.5}
                />
            </View>
        )
    }
}

export default connect(state=>{return{}},dispatch=>{
    return{
        onPressItem:(id)=>{dispatch(setId(id))}
    }
})(ResultScreen)