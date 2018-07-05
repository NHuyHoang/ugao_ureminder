import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import  RoundedIconButton  from '../UButton/RoundedIconButton';

export default Header = (props) => {
    return (
        <View style={styles.headerBar}>
            <Image style={styles.logo} source={require('../../share/images/logo_txt_2.png')} />
            {
                props.data && <View style={styles.btnContainer}>
                    {
                        props.data.map((button, i) => {
                            if (!button) return null;
                            return <RoundedIconButton key={i} {...button} />
                        })
                    }
                </View>
            }
        </View>
    )
}



const styles = StyleSheet.create({
    headerBar: {
        height: 42,
        width: '100%',
        elevation: 3,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    logo: {
        width: 100,
        height: 28,
        resizeMode: 'contain'
    },
    btnContainer: {
        flexDirection: 'row'
    },
})
