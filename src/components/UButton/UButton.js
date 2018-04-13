import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ui from '../../share/ui.constant'

export default class UButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        }
        this.anim = {
            widthScaleAnim: new Animated.Value(0),

        }
        this.onBtnActive = this.onBtnActiveHandler.bind(this)
    }

    onBtnActiveHandler() {

        if (!this.state.isActive) {
            this.setState({ isActive: true }, () => {
                Animated.timing(this.anim.widthScaleAnim, {
                    toValue: 1,
                    timing: 50
                }).start()
            })
        }
    }

    render() {
        let buttonAnimTranform = {
            width: this.anim.widthScaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [250, 50]
            }),
        }
        return (
            <TouchableWithoutFeedback onPress={this.onBtnActive} >
                <Animated.View style={[styles.container, buttonAnimTranform]}>
                    {!this.state.isActive && <Text style={styles.costTxt}>{this.props.cost}</Text>}
                    <Icon name={this.props.iconName} size={25} color={ui.colors.highlight} />
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 250,
        borderWidth: 2,
        borderColor: ui.colors.highlight,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    costTxt: {
        fontFamily: ui.fonts.bold,
        fontSize: 18,
        color: ui.colors.highlight,
        marginRight: 5
    }
})