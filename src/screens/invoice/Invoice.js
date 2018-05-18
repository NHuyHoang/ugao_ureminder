import React from 'react';
import {
    StyleSheet,
    Text, ScrollView,
    View, Image,
    KeyboardAvoidingView,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FCM, { scheduleLocalNotification } from 'react-native-fcm';
import { connect } from 'react-redux';
import ui from '../../share/ui.constant'
import { Header, Input, UButton, Slider, Noti } from '../../components';
import { tryMakeOrder } from '../../store/actions';


class Invoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            orderStatus: "READY",
        }
        this.tempPickerData = [{ key: 'Thanh toán trực tiếp' }, { key: 'VISA' }, { key: 'Internet banking' }];
    }

    onPaidHandler = () => {
        if (!this.props.customer._id)
            this.props.navigation.navigate('Profile', { message: "Vui lòng đăng nhập để đặt hàng" });
        else {
            this.setState({ isLoading: true, orderStatus: "ORDERING" }, () => {
                this.props.tryMakeOrder(this.makeOrderCallback);
            })
        }

    }

    makeOrderCallback = (success) => {
        this.setState({ isLoading: false }, () => {
            if (success && this.props.showNoti) {
                this.setState({ orderStatus: "SUCCESS" });
                FCM.scheduleLocalNotification({
                    id: 'testnotif',
                    opened_from_tray: 1,
                    title: "UReminder",
                    fire_date: new Date().getTime() + this.calculateOrderDate(),
                    vibrate: 300,
                    body: 'Gạo của bạn sắp hết',
                    priority: "high",
                    large_icon: "ic_launcher",                           // Android only
                    icon: "ic_launcher",
                    show_in_foreground: true,
                    targetScreen: "Reminder"
                });

            }
            else this.setState({ orderStatus: "FAILED" });
        });
    }

    calculateOrderDate = () => {
        let data = [...this.props.customer.invoices];
        if (data.length < 2) return null;
        return new Date(data[data.length - 1].order_date).getTime() -
            new Date(data[data.length - 2].order_date).getTime();
    }

    componentWillReceiveProps(props) {
        if (this.state.orderStatus !== "READY" && props.cart.length !== 0) {
            this.setState({ orderStatus: "READY" })
        }
    }

    render() {
        let address = this.props.customer._id ? this.props.customer.location.address : null;
        let orderBtn;
        switch (this.state.orderStatus) {
            case ("READY"):
            case ("FAILED"):
            case ("SUCCESS"):
                orderBtn = (<UButton
                    onPress={this.onPaidHandler}
                    disabled={this.props.cart.length === 0}
                    txt="Thanh toán" iconName="done" />)
                break;
            case ("ORDERING"):
                orderBtn = <ActivityIndicator size="small" color="black" />
                break;/* 
            case ("SUCCESS"):
                orderBtn = <Noti success message="Đặt hàng thành công" />
                break; */
        }
        return (
            <ScrollView style={styles.container}>
                <Header />
                <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}> Hóa đơn mua hàng</Text>
                    </View>
                    {/*  <HorizonSlider  products={this.props.cart}/> */}
                    <Slider success={this.state.orderStatus === "SUCCESS"} products={this.props.cart} />
                    <View style={{ marginTop: 8 }}>
                        {
                            this.state.orderStatus === "FAILED"
                            && <Noti message="Đã xảy ra lỗi" />
                        }
                    </View>
                    <View style={styles.formContainer}>
                        {/*  <Input type='picker' config={{ data: this.tempPickerData }} label={"Thanh toán"} /> */}
                        <Input
                            iconBtn={{ name: "place" }}
                            value={address}
                            type='text'
                            label="Nơi nhận"
                            btnEvent={() => this.props.navigation.navigate('Location', {
                                customerLocation: this.props.customer.location,
                                storeLocation: this.props.store.location
                            })} />
                        <Input config={{ editable: false, value: `${this.props.totalPrice}.000 VND` }} type={'text'} label={"Tổng cộng"} />
                    </View>
                    <View style={styles.submitButton}>
                        {orderBtn}
                    </View>
                </KeyboardAvoidingView>

            </ScrollView>

        )
    }
}

const _width = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: 'white',
    },

    formContainer: {
        width: _width,
        marginTop: 20,
        justifyContent: 'flex-start'
    },
    submitButton: {
        width: _width,
        alignItems: 'center',
        marginTop: 50
    },
    titleContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 6
    },
    title: {
        fontFamily: ui.fonts.decor,
        fontSize: 42,
        color: 'black'
    }

})

const mapStateToProp = state => {
    return {
        cart: state.cart.products,
        totalPrice: state.cart.totalPrice,
        customer: state.customer.info,
        showNoti: state.customer.showNoti,
        store: state.customer.store
    }
}

const mapDispatchToProp = dispatch => {
    return {
        tryMakeOrder: (callback) => dispatch(tryMakeOrder(callback))
    }
}

export default connect(mapStateToProp, mapDispatchToProp)(Invoice);