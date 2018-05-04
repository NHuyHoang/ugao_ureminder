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
import Noti from '../Noti/Noti';
import ui from '../../share/ui.constant';
import ProductItem from './ProductItem';

export default class ProducerSlider extends React.Component {
    constructor(props) {
        super(props);
        this.savedPositon = 0;
        this.sliderWidth = 0;
        this.maxSlideLenght = 0;
        this.positionX = new Animated.Value(0);
        this._width = Dimensions.get('window').width;
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => gestureState.dx >= 10 || gestureState.dx <= -10,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => gestureState.dx >= 10 || gestureState.dx <= -10,
            onPanResponderMove: (e, gt) => {
                if (this.maxSlideLenght == 0) return;
                if (this.sliderWidth <= this._width) {
                    this.positionX.setValue(0);
                    return
                };
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

    componentWillReceiveProps(props) {
        //if there are some additonal or removal product from cart
        //reset the position of slider
        if (this.props.products &&
            (this.props.products.length > props.products.length)) {
            Animated.timing(this.positionX, {
                toValue: 0,
                duration: 300,
            }).start(() => this.savedPositon = 0)

        }

    }

    //prepare for showing product info panel
    //if the product panel is near the right of screen
    //the product panel will auto translate to match the panel width
    rearrangeSlider = (x) => {
        const centerdX = this._width / 2;
        //230 is the max width when product item panel expand
        if (this._width - x >= 230) return;
        const dx = this.positionX._value - (230 - (this._width - x));
        console.log(dx);
        Animated.timing(this.positionX, {
            toValue: dx,
            duration: 200
        }).start(() => this.savedPositon = this.positionX._value);

    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
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
                    {
                        this.props.products ?
                            <View style={{ flexDirection: 'row' }}>

                                {
                                    this.props.products.length === 0 ?
                                        <View style={styles.sliderTxtPlaceHolder}>
                                            <Noti message="Bạn chưa chọn mua sản phẩm" />{/* 
                                            <Text style={styles.sliderTxt}></Text> */}
                                        </View>
                                        :
                                        this.props.products.map((product, index) => (
                                            <ProductItem
                                                key={product._id}
                                                product={product}
                                                arrange={this.rearrangeSlider} />
                                        ))
                                }
                            </View> :
                            <View style={{ flexDirection: 'row' }}>
                                <ProducerItem imgSource="http://gaosach58.vn/wp-content/uploads/2016/06/logo-gao-sach.png" />
                                <ProducerItem imgSource="http://gaosach58.vn/wp-content/uploads/2016/06/logo-hat-ngoc-troi.png" />
                                <ProducerItem imgSource="http://gaosach58.vn/wp-content/uploads/2016/06/logo-hoa-lua.png" />
                                <ProducerItem imgSource="http://gaosach58.vn/wp-content/uploads/2017/08/hp2-680x238.jpg" />
                            </View>
                    }

                </Animated.View>
            </View>
        );
    }
}

const ProducerItem = (props) => (
    <TouchableWithoutFeedback >
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

    },
    slider: {
        //minWidth: "100%",
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
        borderWidth: 1,
        borderColor: ui.colors.light_gray
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
    },
    sliderTxtPlaceHolder: {
        width: '100%',
        height: '100%',
        //justifyContent: 'center',
        alignItems: 'center',
    },
    sliderTxt: {
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.normal,
        color: 'black'
    }
})
