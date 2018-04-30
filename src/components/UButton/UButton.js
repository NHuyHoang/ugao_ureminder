import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableNativeFeedback,
    PanResponder
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ui from '../../share/ui.constant'

export default class UButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        }
        this.anim = {
            colorAnim: new Animated.Value(0),
        }
        this.panRes = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                Animated.timing(this.anim.colorAnim, {
                    toValue: 1,
                    duration: 10
                }).start()
            },
            onPanResponderRelease: (evt, gestureState) => {
                Animated.timing(this.anim.colorAnim, {
                    toValue: 0,
                    duration: 10
                }).start(() => {
                    if (this.props.disabled) return
                    this.props.onPress()
                })
            },
        })
        this.colors = {
            highlight: this.props.color ? this.props.highlight : 'black',
            fadeColor: this.props.fadeColor ? this.props.fadeColor : ui.colors.dark_gray,
        }
    }




    render() {
        let colorHandler = this.props.disabled ?
            ui.colors.dark_gray :
            this.anim.colorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [this.colors.highlight, this.colors.fadeColor]
            })
        return (
            <Animated.View    {...this.panRes.panHandlers}
                style={[styles.container, { borderColor: colorHandler, marginTop: this.props.top }]}>
                <View style={[styles.innerContainer]}>
                    {
                        !this.state.isActive &&
                        <Animated.Text
                            style={[styles.txtStyle, { color: colorHandler }]}>
                            {this.props.txt}
                        </Animated.Text>
                    }
                </View>
            </Animated.View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 250,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    innerContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtStyle: {
        fontFamily: ui.fonts.bold,
        fontSize: 18,
        color: 'black',
        marginRight: 5
    }
})