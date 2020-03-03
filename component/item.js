import React from 'react'
import {Text,View,Image,StyleSheet} from 'react-native'

class Item extends React.Component{
    constructor(){
        super()
    }
    render(){
        return(
            <View style={style.container}>
                <Image style={{width:120,height:90}} source={{uri:this.props.thumbnail.url}}/>
                <View style={{marginLeft:'2%',marginTop:'2%',width:'60%'}}>
                    <Text style={{color:'black',textAlign:'center'}}>{this.props.title}</Text>
                    <Text style={{color:'black',textAlign:'center'}}>{this.props.channeltitle}</Text>
                </View>                
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flexDirection:'row',
        marginLeft:'3%',
        marginTop:'2%',
        marginRight:'3%'
    }
})
export default Item