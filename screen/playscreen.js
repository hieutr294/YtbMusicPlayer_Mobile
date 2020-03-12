import React, { Children } from 'react'

import {View,Text,Image,StyleSheet,Button,ScrollView,FlatList,TouchableOpacity} from 'react-native'
import TrackPlayer, { STATE_STOPPED, STATE_PLAYING } from 'react-native-track-player';
import ytdl from 'react-native-ytdl'
import Item from '../component/item'
class PlayScreen extends React.Component{
    constructor(){
        super()
        this.state={
            arr:[],
            title:'',
            artwork:'',
            related:[],
            currentTrack:''
        }
    }

    componentDidMount(){
        TrackPlayer.updateOptions({
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_STOP,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
            ],
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_STOP,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
            ],
            alwaysPauseOnInterruption:false
        })
        TrackPlayer.setupPlayer()

        const {videoId} = this.props.route.params
        ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`,(err,info)=>{
            TrackPlayer.add({
                id:"first",
                url:ytdl.filterFormats(info.formats,'audioonly')[0].url,
                artwork:info.player_response.videoDetails.thumbnail.thumbnails[2].url,
                title:info.title,
                artist:info.player_response.videoDetails.author
            })
            info.related_videos.map((val,index)=>{
                ytdl.getInfo(val.id,async (err,info)=>{
                    TrackPlayer.add({
                        id:`${index}`,
                        url:ytdl.filterFormats(info.formats,'audioonly')[0].url,
                        artwork:info.player_response.videoDetails.thumbnail.thumbnails[2].url,
                        title:info.title,
                        artist:info.player_response.videoDetails.author
                    })
                    this.setState({
                        related:[...this.state.related,{
                            id:`${index}`,
                            url:ytdl.filterFormats(info.formats,'audioonly')[0].url,
                            artwork:info.player_response.videoDetails.thumbnail.thumbnails[2].url,
                            title:info.title,
                            artist:info.player_response.videoDetails.author
                        }]
                    })
                })
            })

            TrackPlayer.addEventListener('playback-track-changed',data=>{
                TrackPlayer.getTrack(data.nextTrack).then(val=>{
                    this.setState({
                        title:val.title,
                        artwork:val.artwork
                    })
                })
            })
        })
    }

    componentDidUpdate(){
        TrackPlayer.getState().then(val=>{
            if(val==TrackPlayer.STATE_READY){
                TrackPlayer.play()
            }
        })
    }

    render(){
        return(
            <View style={style.container}>
                <View style={style.img}>
                    <Image style={{width:246,height:138}} source={{uri:this.state.artwork}}/>
                </View>
                
                <Text style={style.title}>{this.state.title}</Text>
                <View style={style.buttonGroup}>
                    <Button title='pause' onPress={()=>{TrackPlayer.pause()}}/>
                    <Button title='play' onPress={()=>{TrackPlayer.play()}}/>
                    <Button title='stop' onPress={()=>{TrackPlayer.stop()}}/>
                    <Button title='next' onPress={()=>{
                        TrackPlayer.skipToNext()
                    }}/>
                </View>
                <ScrollView>
                    <FlatList
                        data={this.state.related}
                        initialNumToRender={this.state.related.length}
                        renderItem={({item})=>(
                            <TouchableOpacity onPress={()=>TrackPlayer.skip(item.id)}>
                                <Item channeltitle={''} thumbnail={item.artwork} title={item.title}/>
                            </TouchableOpacity>
                        )}
                    />
                </ScrollView>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        marginTop:'7%'
    },
    title:{
        marginTop:'15%',
        fontSize:17,
        textAlign:'center'
    },
    img:{
        alignItems:'center',
        justifyContent:'center'
    },
    buttonGroup:{
        flexDirection:'row',
        marginTop:'5%',
        alignItems:'center',
        justifyContent:'center'
    }
})

export default PlayScreen