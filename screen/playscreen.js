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

    componentDidMount(){
        const {videoId} = this.props.route.params
        ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`,(err,info)=>{
            this.setState({
                playUrl:ytdl.filterFormats(info.formats,'audioonly')[0].url,
                imgUrl:info.player_response.videoDetails.thumbnail.thumbnails[2].url,
                title:info.title,
                author:info.player_response.videoDetails.author
            })
        })
    }
    
    play(url,title,artwork,artist){
        TrackPlayer.updateOptions({
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_STOP
            ],
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_STOP
            ]
        })
        TrackPlayer.setupPlayer().then(async ()=>{
            await TrackPlayer.add({
                id:'trackId',
                url,
                title,
                artwork,
                artist
            })
            TrackPlayer.play()
        })
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