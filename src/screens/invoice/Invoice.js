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
import { connect } from 'react-redux';
import ui from '../../share/ui.constant'
import { Header, Input, UButton, Slider, Noti, FlatButton } from '../../components';
import { tryMakeOrder } from '../../store/actions';


class Invoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            orderStatus: "READY",
            setDefaultInvoice: false,
            setSubscriptionDate: true
        }
        this.tempPickerData = [{ key: 'Thanh toán trực tiếp' }, { key: 'VISA' }, { key: 'Internet banking' }];
    }

    onPaidHandler = () => {
        if (!this.props.customer._id)
            this.props.navigation.navigate('Profile', { message: "Vui lòng đăng nhập để đặt hàng" });
        //if set this invoice to the subscription invoice
        //you must set the subscription date
        else if (this.state.setDefaultInvoice) {
            if (this.refs.subscriptionOrder.getValue() === "") {
                this.setState({ setSubscriptionDate: false });
                return;
            }
            else {
                this.setState({ setSubscriptionDate: true, isLoading: true, orderStatus: "ORDERING" }, () => {
                    this.props.tryMakeOrder(this.makeOrderCallback, null, parseInt(this.refs.subscriptionOrder.getValue()));
                });
                return;
            }
        }
        else {
            this.setState({ isLoading: true, orderStatus: "ORDERING" }, () => {
                this.props.tryMakeOrder(this.makeOrderCallback);
            })
        }

    }

    makeOrderCallback = (success) => {
        this.setState({ isLoading: false }, () => {
            if (success) {
                this.setState({ orderStatus: "SUCCESS", setDefaultInvoice: false });
            }
            else this.setState({ orderStatus: "FAILED" });
        });
    }

    componentWillReceiveProps(props) {
        if (this.state.orderStatus !== "READY" && props.cart.length !== 0) {
            this.setState({ orderStatus: "READY" })
        }
    }

    onSetDefaultInvoice = () => {
        this.setState(prev => {
            return { setDefaultInvoice: !prev.setDefaultInvoice }
        })
    }

    truncate = (string) => {
        if (!string) return "";
        if (string.length > 50)
            return string.substring(0, 30) + '...';
        else
            return string;
    }

    isValidForm = () => {
        if (this.props.cart.length === 0) return false;

        return true;
    }

    render() {
        let address = this.props.customer._id ? this.props.customer.location.address : null;
        let orderBtn;
        switch (this.state.orderStatus) {
            case ("READY"):
            case ("FAILED"):
            case ("SUCCESS"):
                

                orderBtn = (<FlatButton
                width="80%"
                    onPress={this.onPaidHandler}
                    disabled={this.props.cart.length === 0}
                    title="Đặt hàng" invert />)

                break;
            case ("ORDERING"):
                orderBtn = <ActivityIndicator size="small" color="black" />
                break;
        }
        return (
            <React.Fragment>

                <ScrollView style={styles.container}>
                    <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}> Hóa đơn mua hàng</Text>
                        </View>
                        {/*  <HorizonSlider  products={this.props.cart}/> */}
                        <Slider success={this.state.orderStatus === "SUCCESS"} products={this.props.cart} />
                        {
                            this.state.orderStatus === "FAILED"
                            &&
                            <View style={{ marginTop: 8 }}>
                                <Noti message="Đã xảy ra lỗi" />

                            </View>
                        }
                        <View style={styles.formContainer}>
                            {/*  <Input type='picker' config={{ data: this.tempPickerData }} label={"Thanh toán"} /> */}
                            <Input
                                iconBtn={{ name: "place" }}
                                value={this.truncate(address)}
                                type='text'
                                label="Nơi nhận"
                                btnEvent={() => this.props.navigation.navigate('Location', {
                                    customerLocation: this.props.customer.location,

                                })} />
                            <Input config={{ editable: false, value: `${this.props.totalPrice.toFixed(3)} VND` }} type={'text'} label={"Tổng cộng"} />
                            <Input
                                type='checkbox'
                                disabled={this.state.orderStatus === "SUCCESS"}
                                checked={this.state.setDefaultInvoice}
                                onToogle={this.onSetDefaultInvoice}
                                title="Đặt làm hóa đơn định kỳ"
                            />
                            {
                                this.state.setDefaultInvoice &&
                                < Input
                                    type='text'
                                    size="small"
                                    ref="subscriptionOrder"
                                    label="Số ngày đặt hàng định kỳ"
                                    config={{ keyboardType: 'numeric' }}
                                    textPostFix="ngày"
                                    error={!this.state.setSubscriptionDate}
                                    hint={!this.state.setSubscriptionDate && "Thông tin bắt buộc"}
                                    btnEvent={() => this.props.navigation.navigate('Location', {
                                        customerLocation: this.props.customer.location,
                                    })} />
                            }
                        </View>
                        <View style={styles.submitButton}>
                            {orderBtn}
                        </View>
                    </KeyboardAvoidingView>

                </ScrollView>
            </React.Fragment>
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
        marginTop: 10,
        justifyContent: 'flex-start'
    },
    submitButton: {
        width: _width,
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 20
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
    }
}

const mapDispatchToProp = dispatch => {
    return {
        tryMakeOrder: (callback, preparedInvoice, date) => dispatch(tryMakeOrder(callback, preparedInvoice, date))
    }
}

export default connect(mapStateToProp, mapDispatchToProp)(Invoice);