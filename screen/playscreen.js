import React from 'react'

import {View,Text,Image,StyleSheet,Button,Switch} from 'react-native'
import Video from 'react-native-video'
import TrackPlayer, { STATE_STOPPED, STATE_PLAYING } from 'react-native-track-player';
import ytdl from 'react-native-ytdl'

class PlayScreen extends React.Component{
    constructor(){
        super()
        this.state={
            playUrl:'',
            imgUrl:'',
            title:'',
            author:'',
            loopState:false
        }
        this.getInfo = this.getInfo.bind(this)
    }

    getInfo(videoId){
        ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`,(err,info)=>{
            this.setState({
                playUrl:ytdl.filterFormats(info.formats,'audioonly')[0].url,
                imgUrl:info.player_response.videoDetails.thumbnail.thumbnails[2].url,
                title:info.title,
                author:info.player_response.videoDetails.author,
                duration:info.length_seconds
            })
        })
    }
    componentDidMount(){
        const {videoId} = this.props.route.params
        this.getInfo(videoId)
    }

    componentDidUpdate(){
        const {playUrl,imgUrl,title,author} = this.state
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
            ],
            alwaysPauseOnInterruption:false
        })
        TrackPlayer.setupPlayer().then(async ()=>{
            await TrackPlayer.add({
                id:'trackId',
                url:playUrl,
                title,
                artwork:imgUrl,
                artist:author
            })
        })
    }
    render(){
        return(
            <View style={style.container}>
                <Image style={{width:246,height:138}} source={{uri:this.state.imgUrl}}/>
                <Text style={style.title}>{this.state.title}</Text>
                <View style={style.buttonGroup}>
                    <Button title='pause' onPress={()=>{TrackPlayer.pause()}}/>
                    <Button title='play' onPress={()=>{TrackPlayer.play()}}/>
                    <Button title='stop' onPress={()=>{TrackPlayer.stop()}}/>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        marginTop:'7%',
        paddingLeft:'15%',
        paddingRight:'15%'
    },
    title:{
        marginTop:'20%',
        fontSize:17,
        textAlign:'center'
    },
    buttonGroup:{
        flexDirection:'row',
        marginTop:'15%',
        justifyContent:'space-around'
    }
})

export default PlayScreen