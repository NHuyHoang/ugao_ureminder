import React from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
export default class RemoveBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anim: new Animated.Value(1),
        }
       /*  this.panRes = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                Animated.timing(this.state.anim,{
                    toValue:1.5,
                    timing:10,
                    useNativeDriver: true
                }).start()
            },
        }) */
    }

    componentWillReceiveProps(props) {
        if(props.onRemove){
            Animated.timing(this.state.anim,{
                toValue:1.2,
                timing:2,
                useNativeDriver: true
            }).start()
        }else{
            Animated.timing(this.state.anim,{
                toValue:1,
                timing:2,
                useNativeDriver: true
            }).start()
        }
    }

    render() {
        let animTransform = {
            transform: [{
                scale: this.state.anim
            }]
        }
        return (
            <Animated.View  style={[styles.container, animTransform]}>
                <Icon size={30} name="clear" color="white" />
            </Animated.View>
        );
    }
}
const _height = Dimensions.get('window').height;
const _width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        width: 70,
        height: 70,
        position: 'absolute',
        zIndex: 3,
        top: _height / 2 - 35,
        left: _width / 2 - 35,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scale: 0.01 }]
    }
})