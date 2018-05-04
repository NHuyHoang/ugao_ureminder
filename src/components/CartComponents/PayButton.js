import React from 'react';
import { StyleSheet, Text, View, Animated, TouchableWithoutFeedback } from 'react-native';
import ui from '../../share/ui.constant';
import Icon from 'react-native-vector-icons/Ionicons'
export default class PayButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.anim = new Animated.Value(0)
    }

    componentWillReceiveProps(props) {
        if (props.show) {
            Animated.spring(this.anim, {
                toValue: 1,
                stiffness: 120,
                damping: 7,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(this.anim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start()
        }
    }

    render() {
        let animTransform = {
            transform: [{
                translateX: this.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70]
                })
            }]
        }
        return (
            <TouchableWithoutFeedback
                onPress={this.props.onPress}>
                <Animated.View style={[styles.container, animTransform]}>
                    <Icon name="ios-card" size={30} color="black" />
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 50,
        borderRadius: 25,
        position: 'absolute',
        zIndex: 4,
        bottom: 30,
        right: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1
    }
})