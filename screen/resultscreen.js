import React from 'react'
import {ScrollView,View,TouchableOpacity,FlatList} from 'react-native'
import Item from '../component/item'
import axios from 'axios'

class ResultScreen extends React.Component{
    constructor(){
        super()
        this.state={
            searchdata:[]
        }
    }
    componentDidMount(){
        axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${this.props.route.params.query}&key=AIzaSyBLzpSnGYDCwLISe9XZSVHuGHWiiQs9A_I`)
        .then(res=>{
            this.setState({searchData:res.data.items})
        })
        .catch(err=>{console.log(error.response.request._response)})
    }
    render(){
        return(
            <View>
                <ScrollView style={{backgroundColor:'white'}}>
                    <FlatList
                        data={this.state.searchData}
                        initialNumToRender={this.state.searchdata.length}
                        renderItem={({item})=>(
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('player',{videoId:item.id.videoId})}} >
                                <Item channeltitle={item.channelTitle} thumbnail={item.snippet.thumbnails.default} title={item.snippet.title}/>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item=>item.id}
                    />
                </ScrollView>
            </View>
        )
    }
}