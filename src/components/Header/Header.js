import React from 'react';
import { View, Image, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default Header = (props) => {
    const buttons = {

    }
    return (
        <View style={styles.headerBar}>
            <Image style={styles.logo} source={require('../../share/images/logo_txt_2.png')} />
            {
                props.data && <View style={styles.btnContainer}>
                    {
                        props.data.map((button, i) => (
                            <IconButton key={i} {...button} />
                        ))
                    }
                </View>
            }
        </View>
    )
}

const IconButton = (props) => (
    <TouchableNativeFeedback
        onPress={props.onPress}
        background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', true)}>
        <View style={styles.iconBtnContainer}>
            <Icon name={props.name} size={20} color={props.color} />
        </View>
    </TouchableNativeFeedback>
)

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
    iconBtnContainer: {
        marginRight: 14,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    }
})
