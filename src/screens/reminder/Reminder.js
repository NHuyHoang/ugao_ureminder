import React from 'react';
import { StyleSheet, View, Text, Image, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconicon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { Slider, Header, UButton } from '../../components';
import ui from '../../share/ui.constant';
import { tryMakeOrder } from '../../store/actions';
class Reminder extends React.PureComponent {
    constructor(props) {
        super(props);
        this.products = null;
        this.state = {
            orderStatus: "READY"
        }
        this.price = 0;
        this.products = null;
    }

    onTryMakeOrder = () => {
        const callback = (success) => {
            if (success) {
                this.products = [];
                this.setState({ orderStatus: "SUCCESS" })
            }
            else {
                this.setState({ orderStatus: "FAILED" })
            }
        }

        this.setState({ orderStatus: "ORDERING" }, () => {
            console.log({ products: [...this.products], price: this.props.invoice.price })
            this.props.tryMakeOrder(callback, { products: [...this.products], price: this.props.invoice.price });
        })
    }

    render() {
        if (this.props.invoice) {
            this.products = [...this.props.invoice.products];
            this.price = this.props.invoice.price;
            this.products = this.products.map(element => ({
                ...element.product,
                quantity: element.quantity,
                readonly: true
            }))
        }
        return (
            <View style={styles.container}>
                <Header data={[
                    { name: 'clear', onPress: () => this.props.navigation.goBack(), color: 'red' },
                ]} />
                <View style={styles.mainContent}>
                    <View style={styles.titleContent}>
                        <Icon name="notifications-none" size={42} color="black" />
                        <Text style={styles.titleStyle}>{this.props.customerName}, gạo của bạn sắp hết</Text>
                        <Text style={styles.subTitle}>Đặt hàng nhanh theo hóa đơn trước</Text>
                    </View>
                    <View style={{ width: "100%", marginTop: 12, marginBottom: 12 }}>
                        {
                            this.products &&
                            <Slider success={this.state.orderStatus === "SUCCESS"} products={this.products} />
                        }   
                    </View>
                    <Text style={styles.titleStyle}>
                        {`${this.price.toFixed(3)} VND`}
                    </Text>
                    <View style={styles.btnContent}>
                        {
                            this.state.orderStatus === "FAILED" &&
                            <View style={{ width: '100%' }}>
                                <Noti message="Đã xảy ra lỗi" />
                            </View>

                        }
                        {
                            this.state.orderStatus === "READY" ||
                                this.state.orderStatus === "FAILED" ?
                                <UButton txt="Đặt hàng ngay" onPress={this.onTryMakeOrder} /> :
                                null
                        }
                        {
                            this.state.orderStatus === "SUCCESS" &&
                            <Noti success message="Đặt hàng thành công" />
                        }
                        {
                            this.state.orderStatus === "ORDERING" &&
                            <ActivityIndicator size="small" color="black" />
                        }
                        {/* <View style={styles.btnRow}>
                            <TouchableOpacity style={styles.iconBtn} >
                                <Iconicon name="ios-cart" size={32} color="black" />
                            </TouchableOpacity> 
                            <TouchableOpacity style={styles.iconBtn} >
                                <Iconicon name="ios-close" size={42} color="red" />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    mainContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    titleContent: {
        height: 120,
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    titleStyle: {
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.normal,
        textAlign: "center",
        color: 'black'
    },
    subTitle: {
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.semiTiny,
        color: 'black',
        textAlign: "center",
    },
    btnContent: {
        height: 120,
        marginTop: 22,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    btnRow: {
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconBtn: {
        width: '40%',
        height: 62,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = state => {
    const latestInvoice = state.customer.info.invoices[state.customer.info.invoices.length - 1];
    return {
        invoice: latestInvoice,
        customerName: state.customer.info.name,

    }
}

const mapDispatchToProp = dispatch => {
    return {
        tryMakeOrder: (callback, invoice) => dispatch(tryMakeOrder(callback, invoice))
    }
}

export default connect(mapStateToProps, mapDispatchToProp)(Reminder);