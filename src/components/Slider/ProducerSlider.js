import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    PanResponder,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Image
} from 'react-native';
import ui from '../../share/ui.constant'
export default class ProducerSlider extends React.Component {
    constructor(props) {
        super(props);
        this.savedPositon = 0;
        this.sliderWidth = 0;
        this.maxSlideLenght = 0;
        this.positionX = new Animated.Value(0);
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderMove: (e, gt) => {
                if (this.maxSlideLenght == 0) return;
                this.positionX.setValue(this.animationHandler(this.savedPositon, gt.dx))
            },
            onPanResponderRelease: (e, { dx }) => {
                this.savedPositon = this.positionX._value;
            }
        })
    }

    animationHandler(x, dx) {
        //if slide gesture > slider maximum length
        if (x <= 0 && dx < 0) {
            if (Math.abs(x + dx) >= this.maxSlideLenght) {
                return -this.maxSlideLenght;
            };
        }
        //if slide gesture < 0
        if (x + dx < 0) {
            return x + dx;
        }
        return 0;
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View
                    onLayout={(event) => {
                        this.sliderWidth = event.nativeEvent.layout.width;
                        this.maxSlideLenght = this.sliderWidth - Dimensions.get('screen').width;
                    }}
                    {...this._panResponder.panHandlers}
                    style={[styles.slider, {
                        transform: [{
                            translateX: this.positionX
                        }]
                    }]}>
                    <ProducerItem imgSource="http://gaosach58.vn/wp-content/uploads/2016/06/logo-gao-sach.png" />
                    <ProducerItem imgSource="http://gaosach58.vn/wp-content/uploads/2016/06/logo-hat-ngoc-troi.png" />
                    <ProducerItem imgSource="http://gaosach58.vn/wp-content/uploads/2016/06/logo-hoa-lua.png" />
                    <ProducerItem imgSource="http://gaosach58.vn/wp-content/uploads/2017/08/hp2-680x238.jpg" />
                </Animated.View>
            </View>
        );
    }
}

const ProducerItem = (props) => (
    <TouchableWithoutFeedback>
        <View style={styles.producerItem}>
            <Image style={styles.producerImg} source={{ uri: props.imgSource }} />
        </View>
    </TouchableWithoutFeedback>
);



const SpinnerIndicator = (props) => (
    <View style={styles.actIndicator}>
        <ActivityIndicator size="large" color={ui.colors.highlight} />
    </View>
)

const styles = StyleSheet.create({
    container: {
        height: 120,
        width: '100%'
    },
    slider: {
        minWidth: "100%",
        alignSelf: 'flex-start',
        height: "100%",
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        //borderWidth: 1,
        flexDirection: 'row'
    },
    producerItem: {
        padding: 12,
        height: 100,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginLeft: 12,
        marginRight: 12,
        borderRadius: 8,
        elevation: 2
    },
    actIndicator: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    producerImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    }
})
