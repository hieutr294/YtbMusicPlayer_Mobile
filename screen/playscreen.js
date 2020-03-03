import React from 'react'

import {View,Text,Image,StyleSheet,Button} from 'react-native'

import TrackPlayer from 'react-native-track-player';
import ytdl from 'react-native-ytdl'

class PlayScreen extends React.Component{
    constructor(){
        super()
        this.state={
            playUrl:'',
            imgUrl:'',
            title:'',
            author:''
        }
    }

    render(){
        const {playUrl,imgUrl,author,title} = this.state
        return(
            <View style={style.container}>
                <Image style={{width:246,height:138}} source={{uri:this.state.imgUrl}}/>
                <Text style={style.title}>{this.state.title}</Text>
                <View style={style.buttonGroup}>
                    <Button title='pause' onPress={()=>{TrackPlayer.pause()}}/>
                    <Button title='play' onPress={()=>{this.play(playUrl,title,imgUrl,author)}}/>
                    <Button title='stop' onPress={()=>{TrackPlayer.stop()}}/>
                </View>
            </View>
        )
    }
}

export default PlayScreen