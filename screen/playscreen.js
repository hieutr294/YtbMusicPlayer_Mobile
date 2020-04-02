import React from 'react'

import {View,Text,Image,StyleSheet,ScrollView,FlatList,TouchableOpacity} from 'react-native'
import {Button,Icon} from '@ui-kitten/components';
import TrackPlayer from 'react-native-track-player';
import ytdl from 'react-native-ytdl'
import Item from '../component/item'
import ProgressBar from '../component/progress'
import ViewPager from '@react-native-community/viewpager';
import Carousel from 'react-native-snap-carousel';
import { connect } from 'react-redux';
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
        this.count = 0
        this.nameIcon = 'play-circle-outline'
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
                    idYtb:info.video_id,
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

    componentDidUpdate(prevProps){
        if(prevProps.id!=this.props.id){
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
                        idYtb:info.video_id,
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
        })
    }

    playPause(){
        TrackPlayer.pause()
        this.nameIcon='pause-circle-outline'
        this.count+=1
        if(this.count>=2){
            TrackPlayer.play()
            this.nameIcon='play-circle-outline'
            this.count=0
        }
    }

    playIcon(){
        return(
            <Icon fill='black' width='24' height='24' name={this.nameIcon}/>
        )
    }

    stopIcon(){
        return(
            <Icon fill='black' width='24' height='24' name='stop-circle-outline'/>
        )
    }

    skipIcon(){
        return(
            <Icon fill='black' width='24' height='24' name='skip-back-outline'/>
        )
    }

    forwardIcon(){
        return(
            <Icon fill='black' width='24' height='24' name='skip-forward-outline'/>
        )
    }

    nextTrack(){
        this.refs.carousel.snapToNext()
    }

    prevTrack(){
        this.refs.carousel.snapToPrev()
    }

    render(){
        return(
            <ViewPager style={{width:'100%',height:'100%',flex:1}} initialPage={0}>
                <View key="1" style={{alignItems:'center',justifyContent:'center'}}>
                    <View style={style.container}>

                        <Carousel
                            ref={'carousel'}
                            data={this.state.related}
                            renderItem={({item,index})=>(
                                <View>
                                    <Image source={{uri:item.artwork}} style={{width:246,height:138}}/>
                                    <Text style={style.title}>{item.title}</Text>
                                </View>
                            )}
                            sliderWidth={246}
                            itemWidth={246}
                            onSnapToItem={(index)=>TrackPlayer.skip(this.state.related[index].id)}
                            contentContainerCustomStyle={style.img}
                            loop={true}
                        />

                        <ProgressBar/>

                        <View style={style.buttonGroup}>
                            <Button style={style.button} icon={this.skipIcon} onPress={()=>this.prevTrack()}></Button>
                            <Button style={style.button} icon={this.playIcon} onPress={this.playPause}></Button>
                            <Button style={style.button} icon={this.stopIcon} onPress={()=>TrackPlayer.stop()}></Button>
                            <Button style={style.button} icon={this.forwardIcon} onPress={()=>this.nextTrack()}></Button>
                        </View>

                    </View>
                </View>

                <View key="2">
                    <ScrollView>
                        <FlatList
                            data={this.state.related}
                            initialNumToRender={this.state.related.length}
                            renderItem={({item,index})=>(
                                <TouchableOpacity onPress={()=>this.skipTo(index,item)}>
                                    <Item channeltitle={''} thumbnail={item.artwork} title={item.title}/>
                                </TouchableOpacity>
                            )}
                        />
                    </ScrollView>
                </View>
            </ViewPager>
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