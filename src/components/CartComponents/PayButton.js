import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import ui from '../../share/ui.constant';
import Icon from 'react-native-vector-icons/MaterialIcons'
export default class PayButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anim: new Animated.Value(0)
        }
    }

    componentWillReceiveProps(props) {
        if (props.show) {
            Animated.spring(this.state.anim, {
                toValue: 1,
                stiffness: 120,
                damping: 7,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(this.state.anim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start()
        }
    }

    render() {
        let animTransform = {
            transform: [{
                translateX: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70]
                })
            }]
        }
        return (
            <Animated.View style={[styles.container, animTransform]}>
                <Icon name="check" size={30} color="white"/>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 50,
        borderRadius: 25,
        position: 'absolute',
        zIndex: 3,
        bottom: 30,
        right: 30,
        backgroundColor: ui.colors.highlight,
        justifyContent:'center',
        alignItems:'center',
        elevation:1
    }
})