import React from 'react'
import Slider from '@react-native-community/slider';
import {View,Text,Image,StyleSheet,Button,ScrollView,FlatList,TouchableOpacity} from 'react-native'
import TrackPlayer from 'react-native-track-player';
import moment from 'moment'

export default class ProgressBar extends TrackPlayer.ProgressComponent{
    render(){
        return(
            <View>
                <Slider
                    maximumValue={this.state.duration}
                    value={this.state.position}
                    onValueChange={(s)=>TrackPlayer.seekTo(s)}
                    minimumValue={0}
                />
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <Text>{moment.unix(this.state.position).utc().format('mm:ss')}/</Text>
                    <Text style={{textAlign:'center'}}>{moment.unix(this.state.duration).utc().format('mm:ss')}</Text>
                </View>
            </View>
        )
    }
}