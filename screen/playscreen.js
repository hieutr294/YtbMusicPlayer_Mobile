import React from 'react'

import {View,Text,Image,StyleSheet,ScrollView,FlatList,TouchableOpacity} from 'react-native'

import TrackPlayer from 'react-native-track-player';
import ytdl from 'react-native-ytdl'
import Item from '../component/item'
import ProgressBar from '../component/progress'
import ViewPager from '@react-native-community/viewpager';
import { connect } from 'react-redux';
import { Button,Icon } from 'react-native-elements';

class PlayScreen extends React.Component{
    constructor(){
        super()
        this.state={
            arr:[],
            title:'',
            artwork:'',
            related:[],
            currentTrack:'',
            noMusic:false
        }
        this.count = 0
        this.nameIcon = 'play-arrow'
        this.playPause = this.playPause.bind(this)
        this.playIcon = this.playIcon.bind(this)
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

        if(this.props.id==""){
            this.setState({
                noMusic:true
            })
        }else{
            ytdl.getInfo(`https://www.youtube.com/watch?v=${this.props.id}`,(err,info)=>{
                TrackPlayer.add({
                    id:"first",
                    url:ytdl.filterFormats(info.formats,'audioonly')[0].url,
                    artwork:info.player_response.videoDetails.thumbnail.thumbnails[2].url,
                    title:info.title,
                    artist:info.player_response.videoDetails.author
                })
                this.setState({
                    related:[{
                        id:"first",
                        url:ytdl.filterFormats(info.formats,'audioonly')[0].url,
                        artwork:info.player_response.videoDetails.thumbnail.thumbnails[2].url,
                        title:info.title,
                        artist:info.player_response.videoDetails.author
                    }]
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
    }

    componentDidUpdate(prevProps){
        if(prevProps.id!=this.props.id){
            this.setState({
                noMusic:false
            })
            TrackPlayer.destroy()
            TrackPlayer.setupPlayer()
            this.setState({
                related:[]
            })
            ytdl.getInfo(`https://www.youtube.com/watch?v=${this.props.id}`,(err,info)=>{
                TrackPlayer.add({
                    id:"first",
                    url:ytdl.filterFormats(info.formats,'audioonly')[0].url,
                    artwork:info.player_response.videoDetails.thumbnail.thumbnails[2].url,
                    title:info.title,
                    artist:info.player_response.videoDetails.author
                })

                this.setState({
                    related:[{
                        id:"first",
                        url:ytdl.filterFormats(info.formats,'audioonly')[0].url,
                        artwork:info.player_response.videoDetails.thumbnail.thumbnails[2].url,
                        title:info.title,
                        artist:info.player_response.videoDetails.author
                    }]
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
                                idYtb:info.video_id,
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

        TrackPlayer.getState().then(val=>{
            if(val==TrackPlayer.STATE_READY){
                TrackPlayer.play()
            }
            if(val==TrackPlayer.STATE_PAUSED){
                console.log(val)
            }
        })

    }

    playPause(){
        TrackPlayer.pause()
        this.nameIcon='pause'
        this.count+=1
        if(this.count>=2){
            TrackPlayer.play()
            this.nameIcon='play-arrow'
            this.count=0
        }
    }

    playIcon(){
        return(
            <Icon name={this.nameIcon}/>
        )
    }

    stopIcon(){
        return(
            <Icon name='stop'/>
        )
    }

    skipIcon(){
        return(
            <Icon name='skip-previous'/>
        )
    }

    forwardIcon(){
        return(
            <Icon name='skip-next'/>
        )
    }

    nextTrack(){
        TrackPlayer.skipToNext()
    }

    prevTrack(){
        TrackPlayer.skipToPrevious()
    }

    skipTo(index,item){
        TrackPlayer.skip(item.id)
    }

    render(){
        if(this.state.noMusic){
            return(
                <View style={{width:'100%',height:'100%',backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                        <Text>PLEASE SELECT MUSIC</Text>
                </View>
            )
        }else{
            return(
                <ViewPager style={{width:'100%',height:'100%',flex:1}} initialPage={0}>
                    <View key="1" style={{alignItems:'center',justifyContent:'center'}}>
                        <View style={style.container}>

                        <View style={style.img}>
                            <Image style={{width:246,height:138}} source={{uri:this.state.artwork}} onPress={()=>{console.log(1)}}/>
                        </View>

                        <Text style={style.title}>{this.state.title}</Text>

                        <ProgressBar/>
    
                        <View style={style.buttonGroup}>
                            <Button buttonStyle={style.button} icon={this.skipIcon} onPress={()=>this.prevTrack()}></Button>
                            <Button buttonStyle={style.button} icon={this.playIcon} onPress={this.playPause}></Button>
                            <Button buttonStyle={style.button} icon={this.stopIcon} onPress={()=>TrackPlayer.stop()}></Button>
                            <Button buttonStyle={style.button} icon={this.forwardIcon} onPress={()=>this.nextTrack()}></Button>
                        </View>
    
                        </View>
                    </View>
    
                    <View key="2">
                            <FlatList
                                data={this.state.related}
                                initialNumToRender={this.state.related.length}
                                renderItem={({item,index})=>(
                                    <TouchableOpacity onPress={()=>this.skipTo(index,item)}>
                                        <Item channeltitle={''} thumbnail={item.artwork} title={item.title}/>
                                    </TouchableOpacity>
                                )}
                            />
                    </View>
                </ViewPager>
            )
        }
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
        justifyContent:'space-evenly'
    },
    button:{
        backgroundColor:'rgba(0, 0, 0, 0)',
        borderColor:'rgba(0, 0, 0, 0)'
    }
})

export default connect(state=>{
    return{
        id:state.id
    }
})(PlayScreen)