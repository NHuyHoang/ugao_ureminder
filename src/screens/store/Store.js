import React from 'react';
import { StyleSheet, View, Dimensions, TouchableWithoutFeedback, Animated, Image, DatePickerAndroid, TimePickerAndroid } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux';
import FCM from 'react-native-fcm';

import StoreProduct from './storeProduct/StoreProduct';
import StoreNoti from './storeNoti/StoreNoti';
import StoreContact from './storeContact/StoreContact';
import ui from '../../share/ui.constant';
import { SearchInput, NavbarTab, CartButton, ProductItem, PayButton } from '../../components';
import { removeFromCart } from '../../store/actions'

class Store extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tabSelection: 1,
            pageMounted: false,
            checkCart: false,
            dimmerAnim: new Animated.Value(0),
            addingProduct: false,
        };
    }

    componentDidMount() {
    }



    onSelectTabHandler = (tab) => {
        this.setState({ tabSelection: tab })
    };

    onCheckCartHandler = () => {
        if (this.state.addingProduct) return;
        this.setState(prev => ({ checkCart: !prev.checkCart }))
    };

    onStopCheckCartHandler = () => {
        this.setState(prev => ({ checkCart: false }))
    };
    //temp
    onRemoveProductFromCart = (id) => {
        this.props.removeFromCart(id);
    };

    scheduleLocalNotification = () => {
        FCM.scheduleLocalNotification({
            id: 'testnotif',
            opened_from_tray: 1,
            title: "UReminder",
            fire_date: new Date().getTime() + 2000,
            vibrate: 300,
            body: 'Gạo của bạn sắp hết',
            priority: "high",
            large_icon: "ic_launcher",                           // Android only
            icon: "ic_launcher",
            show_in_foreground: false,
            targetScreen: "Reminder"
        });
    };

    showDatePicker = async () => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: new Date(2020, 4, 25),
                mode: 'calendar'
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                try {
                    const { action, hour, minute } = await TimePickerAndroid.open({
                        hour: 14,
                        minute: 0,
                        is24Hour: false, // Will display '2 PM'
                    });
                    if (action !== TimePickerAndroid.dismissedAction) {
                        // Selected hour (0-23), minute (0-59)
                    }
                } catch ({ code, message }) {
                    console.warn('Cannot open time picker', message);
                }
                console.log(month, day, year);
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    };

    cancelNoti = () => {
        console.log("trigger");
        //FCM.getScheduledLocalNotifications().then(obj => console.log(obj))
        FCM.cancelAllLocalNotifications();
    };

    render() {
        return (
            <View style={styles.container}>
                {/*  <Button title="push noti" onPress={this.cancelNoti} color="red" /> 
                <Button title="push noti" onPress={this.scheduleLocalNotification} />*/}
                <View style={styles.navbarContainer}>
                    <View style={styles.navbarInput}>
                        <View style={styles.searchInput}>
                            <SearchInput />
                        </View>
                    </View>
                    <View style={styles.navbarTab}>
                        <NavbarTab iconSize={22} selectTab={(tab) => this.onSelectTabHandler(tab)} />
                    </View>


                </View>

                <StoreProduct /* addToCart={this.onAddToCartHandler} */ show={this.state.tabSelection === 1} />
                {this.state.tabSelection === 2 && <StoreNoti />}
                {this.state.tabSelection === 3 && <StoreContact />}
                {
                    this.state.checkCart &&
                    <DimmerComponent onPress={this.onStopCheckCartHandler} />
                }
                <CartButton checkCart={this.onCheckCartHandler} quantity={this.props.cart.length} />
                {this.props.cart.map((item, i) => {
                    if (i >= 4) {
                        return (
                            <ProductItem
                                opacity={i > 4 ? 0 : 1}
                                zIndex={i}
                                initPosition={{ x: 30, y: 30 }}
                                removeProduct={null}
                                key={item._id}
                                quantity={"+" + (this.props.cart.length - i).toString()}
                                translateY={-70 - (4 * 70)}
                                show={this.state.checkCart} />
                        );
                    }
                    return (
                        <ProductItem
                            initPosition={{ x: 30, y: 30 }}
                            removeProduct={() => this.onRemoveProductFromCart(item._id)}
                            key={item._id} source={item.img}
                            translateY={-70 - (i * 70)}
                            show={this.state.checkCart} />
                    )
                })}
                {<PayButton onPress={() => this.props.navigation.navigate('Invoice')} show={this.state.checkCart} />}
                {/*  <AditionalProduct stopAddingProduct={() => this.setState({ addingProduct: false })} addingProduct={this.state.addingProduct} /> */}

            </View>
        )
    }
}

class AditionalProduct extends React.Component {
    constructor(props) {
        super(props);
        this.postion = _height - 300;
        this.anim = new Animated.Value(this.postion);
        this.scaleAnim = new Animated.Value(0.01);
        this.state = {
            added: false
        }
    }

    componentWillReceiveProps(props) {
        if (props.addingProduct && !this.state.added) {

            Animated.sequence([
                Animated.timing(this.scaleAnim, {
                    toValue: 1,
                    duration: 200,
                }),
                Animated.timing(this.anim, {
                    toValue: 30,
                    duration: 400,
                    delay: 100,
                })
            ]).start(() => {
                this.anim.setValue(this.postion),
                    this.scaleAnim.setValue(0.01);
                this.state.added = true;
                this.props.stopAddingProduct();
            })
        } else {
            this.setState({ added: false })
        }
    }
    render() {
        let animTransform = {
            bottom: this.anim,
            transform: [{
                scale: this.scaleAnim,
            }]
        };
        return (
            <Animated.View style={[styles.aditionalProduct, animTransform]}>
                <Image style={styles.additionalProductImg} source={{ uri: "http://gaosach58.vn/wp-content/uploads/2016/07/bac-dau.jpg" }} />
            </Animated.View>
        )
    }
}

const DimmerComponent = (props) => {
    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={styles.dimmer}>
                <Ionicon size={80} name="ios-close-circle-outline" color="white" />
            </View>
        </TouchableWithoutFeedback>
    )
};

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    navbarContainer: {
        height: 100,
        width: '100%',
        backgroundColor: 'white'
    },
    navbarInput: {
        width: '100%',
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInput: {
        backgroundColor: 'transparent',
        height: 37,
        width: '90%'
    },
    navbarTab: {
        flex: 1,
    },
    dimmer: {
        position: 'absolute',
        height: _height,
        width: _width,
        zIndex: 4,
        backgroundColor: 'black',
        opacity: 0.6,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1
    },
    aditionalProduct: {
        position: 'absolute',
        height: 50,
        width: 50,
        zIndex: 3,
        backgroundColor: 'white',
        right: 30,
        borderRadius: 25,
        borderWidth: 0.5,
        elevation: 1,
        borderColor: ui.colors.light_gray,
        transform: [
            { scale: 0.01 }
        ],
        justifyContent: 'center',
        alignItems: 'center'
    },
    additionalProductImg: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    }
});

const mapStateToProps = state => {
    return {
        cart: state.cart.products,
        showNoti: state.customer.showNoti
    }
};

const mapDispatchToProps = dispatch => {
    return {
        removeFromCart: (_id) => dispatch(removeFromCart(_id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Store);