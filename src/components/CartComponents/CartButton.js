import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import ui from '../../share/ui.constant';

export default class CartButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.checkCart}>
                <View style={styles.container}>
                    <View style={styles.cartBtn}>
                        <Icon name="shopping-cart" size={30} color={ui.colors.highlight} />
                    </View>
                    {
                        this.props.quantity > 0 &&
                        <View style={styles.counter}>
                            <Text style={styles.counterTxt}>{this.props.quantity}</Text>
                        </View>
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const _height = Dimensions.get("screen").height;
const _width = Dimensions.get("screen").width;

const styles = StyleSheet.create({
    container: {
        height: 70,
        width: 70,
        position: 'absolute',
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        right: 20,
        backgroundColor: 'transparent',
        elevation: 1
    },
    cartBtn: {
        height: 60,
        width: 60,
        position: 'absolute',
        zIndex: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        borderRadius: 30,
    },
    counter: {
        height: 25,
        width: 25,
        borderRadius: 20,
        position: 'absolute',
        backgroundColor: ui.colors.red,
        top: 0,
        zIndex: 6,
        right: 0,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterTxt: {
        fontFamily: ui.fonts.bold,
        fontSize: 13,
        color: 'white'
    },
})