import React from 'react';
import { StyleSheet, View, Text, Image, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconicon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { Slider, Header, UButton } from '../../components';
import ui from '../../share/ui.constant';
class Reminder extends React.PureComponent {
    constructor(props) {
        super(props);
        this.products = null;
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
                <Header />
                <View style={styles.mainContent}>
                    <View style={styles.titleContent}>
                        <Icon name="notifications-none" size={42} color="black" />
                        <Text style={styles.titleStyle}>Huy Hoàng, gạo của bạn sắp hết</Text>
                        <Text style={styles.subTitle}>Đặt hàng nhanh theo hóa đơn trước</Text>
                    </View>
                    <View style={{ width: "100%", marginTop: 12, marginBottom: 12 }}><Slider products={this.products} /></View>
                    <Text style={styles.titleStyle}>89.000 VND</Text>
                    <View style={styles.btnContent}>
                        <UButton txt="Đặt hàng ngay" onPress={() => { }} />
                        <View style={styles.btnRow}>
                            <TouchableOpacity style={styles.iconBtn} >
                                <Iconicon name="ios-cart" size={32} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} >
                                <Iconicon name="ios-alarm" size={32} color="black" />
                            </TouchableOpacity>
                        </View>
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
        invoice: latestInvoice
    }
}


export default connect(mapStateToProps)(Reminder);