import React from 'react';
import { StyleSheet, Text, View, Animated, Image, PanResponder, Dimensions } from 'react-native';
export default class ProductItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setDraggingAnim: false,
            removeAnim: new Animated.Value(1)
        }
        this._height = Dimensions.get('screen').height;
        this._width = Dimensions.get('screen').width;
        this.elementPos = { x: 0, y: 0 };
        this.anim = new Animated.ValueXY({ x: 0, y: 0 });
        this.defaultPos = { x: 0, y: 0 };
        this.panRes = PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gt) => {

                this.anim.setOffset({ x: 0, y: this.props.translateY })
                this.anim.setValue({ x: 0, y: 0 })
            },
            onPanResponderMove: (e, gt) => {
                Animated.event([null, { dx: this.anim.x, dy: this.anim.y }])(e, gt);
            },
            //
            onPanResponderRelease: (evt, { moveX, moveY, dx, dy }) => {
                this.anim.flattenOffset();
                if (this.isInRemove(moveX, moveY)) {
                    Animated.parallel([
                        Animated.timing(this.anim.x, {
                            toValue: 55 - (this._width / 2),
                            duration: 100,
                            useNativeDriver: true
                        }),
                        Animated.timing(this.anim.y, {
                            toValue: 79 + 50 - (this._height / 2),
                            duration: 100,
                            useNativeDriver: true
                        })
                    ]).start(() => {
                        Animated.timing(this.state.removeAnim, {
                            toValue: 0,
                            timing: 10,
                            useNativeDriver: true
                        }).start(() => this.props.removeProduct())
                    })
                } else {
                    Animated.parallel([
                        Animated.spring(this.anim.x, {
                            toValue: 0,
                            stiffness: 120,
                            damping: 10,
                            useNativeDriver: true
                        }),
                        Animated.spring(this.anim.y, {
                            toValue: this.props.translateY,
                            stiffness: 120,
                            damping: 10,
                            useNativeDriver: true
                        })
                    ]).start()
                }
            }
        })
    }

    isInRemove(x, y) {
        const _height = this._height / 2;
        const _width = this._width / 2;
        if (x <= _width + 50 &&
            x >= _width - 50 &&
            y <= _height + 50 &&
            y >= _height - 50) return true;
        return false
    }


    componentWillReceiveProps(props) {
        if (props.show) {
            Animated.spring(this.anim.y, {
                toValue: props.translateY,
                stiffness: 120,
                damping: 10,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(this.anim.y, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start()
        }
    }

    render() {
        let animTransform = {
            transform: [{
                translateY: this.anim.y
            }, {
                translateX: this.anim.x,
            }, {
                scale: this.state.removeAnim
            }],
        }
        /*  let draggingTransform = {}
         if (this.state.setDraggingAnim) {
             draggingTransform = {
                 transform: [{
                     translateX: this.state.draggingAnim.x,
                 },
                 {
                     translateY: this.state.draggingAnim.y,
                 }]
             }
         } */
        return (
            <Animated.View
                onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    this.elementPos.x = x;
                    this.elementPos.y = y;
                }}
                {...this.panRes.panHandlers} style={[styles.container,{bottom:this.props.initPosition.x,right:this.props.initPosition.y}, animTransform]}>
                <Image style={styles.productImg} source={{ uri: this.props.source }} />
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
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        //bottom: 30,
        //right: 30,
        padding: 5,
        backgroundColor: 'white',
    },
    productImg: {
        resizeMode: 'contain',
        height: 30,
        width: 30,
    }
})