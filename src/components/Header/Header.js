import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default Header = (props) => (
    <View style={styles.headerBar}>
        <Image style={styles.logo} source={require('../../share/images/logo_txt_2.png')} />
        {props.children}
    </View>
)

const styles = StyleSheet.create({
    headerBar: {
        height: 42,
        width: '100%',
        elevation: 3,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems:'center',
        flexDirection:'row'
    },
    logo: {
        width: 100,
        height: 28,
        resizeMode: 'contain'
    },
})
