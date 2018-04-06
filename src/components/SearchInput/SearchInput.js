import React from 'react';
import { StyleSheet, View, Text, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ui from '../../share/ui.constant';

export default SearchInput = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../../share/images/logo_txt_2.png')} />
            </View>
            <View style={styles.inputContainer}>
                <TextInput 
                    underlineColorAndroid='transparent'
                    style={styles.input} 
                    placeholder="Tìm kiếm"
                    selectionColor={ui.colors.highlight}
                    placeholderTextColor={ui.colors.light_gray}/>
            </View>
            <View style={styles.searchIcon}>
                <Icon size={20} name="search" color={ui.colors.black} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: ui.colors.light_gray,
        borderRadius: 6,
        flex: 1,
        flexDirection:'row'
    },
    logoContainer:{
        width: '20%',
        height: '100%',
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:2
    },
    logo: {
        width:'100%',
        height:'100%',
        resizeMode: 'contain'
    },
    inputContainer:{
        width:'70%',
        height:'100%',
        justifyContent:'center',
        alignItems:'flex-end',
    },
    input:{
        fontSize:15,
        width:'100%',
        height:'100%',
        marginTop:9,
        fontFamily:ui.fonts.light
    },
    searchIcon:{
        width:'10%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    }
})