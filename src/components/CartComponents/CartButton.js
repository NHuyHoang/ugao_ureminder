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
                        <Icon name="shopping-cart" size={30} color="white" />
                    </View>
                    {this.props.quantity === 0 ?
                        null : <View style={styles.counter}>
                            <Text style={styles.counterTxt}>{this.props.quantity}</Text>
                        </View>}
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
        zIndex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        right: 20,
        backgroundColor: 'transparent',
    },
    cartBtn: {
        height: 60,
        width: 60,
        position: 'absolute',
        zIndex: 5,
        backgroundColor: ui.colors.highlight,
        justifyContent: 'center',
        alignItems: 'center',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterTxt: {
        fontFamily: ui.fonts.bold,
        fontSize: 13,
        color: 'white'
    }

})