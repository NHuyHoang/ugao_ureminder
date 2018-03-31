import React from 'react';
import { StyleSheet, Text, View, Animated, Image } from 'react-native';
export default class ProductItem extends React.Component {
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
                translateY: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, this.props.translateY]
                })
            }]
        }
        return (
            <Animated.View style={[styles.container, animTransform]}>
                <Image style={styles.productImg} source={{uri:this.props.source}}/>
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
        justifyContent:'center',
        alignItems:'center',
        zIndex: 3,
        bottom: 30,
        right: 30,
        padding:5,
        backgroundColor: 'white',
        elevation: 5,
    },
    productImg:{
        resizeMode:'contain',
        height: 30,
        width: 30,
    }
})