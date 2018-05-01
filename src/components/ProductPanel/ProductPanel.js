import React from 'react';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ui from '../../share/ui.constant';
import Ribbon from './Ribbon';

export default ProductPanel = (props) => {
    let { img, name, price, weight } = props.product;
    return (
        <View style={styles.container}>
            <Ribbon weight={weight} />
            <View style={styles.ImgContainer}>
                <Image style={styles.productImg} source={{ uri: img }} />
                {/* <View style={styles.dimmer} /> */}
            </View>
            <View style={styles.InfoContainer}>
                <View style={styles.productNameContainer}>
                    <Text style={styles.productName}>{name}</Text>
                </View>
                <TouchableNativeFeedback onPress={props.pressed}>
                    <View style={styles.addToCart}>
                        <Icon name="add-shopping-cart" size={20} color={ui.colors.black} />
                        <Text style={styles.productCost}>{price}k</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    );
}

const _width = Dimensions.get('window').width;
const borderRadiusConst = 4;
const styles = StyleSheet.create({
    container: {
        height: 217.5,
        width: _width / 2 - 20,
        borderRadius: borderRadiusConst,
        marginLeft: 8,
        marginRight: 8,
        elevation: 2,
        backgroundColor: 'white'
    },
    ImgContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: borderRadiusConst,
        borderTopRightRadius: borderRadiusConst,
    },
    productImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    /* dimmer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        opacity: 0.03,
        position: 'absolute',
        borderTopRightRadius: borderRadiusConst,
        borderTopLeftRadius: borderRadiusConst
    }, */
    InfoContainer: {
        width: '100%',
        height: '40%',
    },
    productNameContainer: {
        width: '100%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 25,
        paddingRight: 25,
    },
    addToCart: {
        width: '100%',
        height: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: borderRadiusConst,
        borderBottomRightRadius: borderRadiusConst,
    },
    productName: {
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.semiTiny,
        color: 'black',
        textAlign: 'center'
    },
    productCost: {
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.semiTiny,
        color: ui.colors.black,
        marginLeft: 2
    }
})