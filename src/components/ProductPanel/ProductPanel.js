import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import ui from '../../share/ui.constant';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default ProductPanel = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.ImgContainer}>
                <Image style={styles.productImg} source={require('../../share/images/phuong-hoang.jpg')} />
                <View style={styles.dimmer} />
            </View>
            <View style={styles.InfoContainer}>
                <View style={styles.productNameContainer}>
                    <Text style={styles.productName}>Gạo Hạt Ngọc Trời Phượng Hoàng</Text>
                </View>
                <TouchableOpacity style={styles.addToCart}>
                    <Icon name="add-shopping-cart" size={20} color={ui.colors.highlight} />
                    <Text style={styles.productCost}>89k VND</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 217.5,
        width: 166.5,
        borderRadius: 12,
        marginLeft: 5,
        marginRight: 5,
        elevation: 2,
        backgroundColor: 'white'
    },
    ImgContainer: {
        width: '100%',
        height: '60%',
    },
    productImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    dimmer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        opacity: 0.1,
        position: 'absolute',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12
    },
    InfoContainer: {
        width: '100%',
        height: '40%',
    },
    productNameContainer: {
        width: '100%',
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 25,
        paddingRight: 25,
    },
    addToCart: {
        width: '100%',
        height: '40%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    productName: {
        fontFamily: ui.fonts.medium,
        fontSize: 12,
        color: ui.colors.dark_gray,
        textAlign: 'center'
    },
    productCost: {
        fontFamily: ui.fonts.medium,
        fontSize: 12,
        color: ui.colors.highlight
    }
})