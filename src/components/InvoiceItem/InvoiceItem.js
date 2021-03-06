import React from 'react';
import { StyleSheet, View, Text, Button, Animated, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Slider from '../Slider/Slider';
import ui from '../../share/ui.constant';

export default class InvoiceItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showSlider: false,
        }
        this.sliderAnim = new Animated.Value(0);

    }

    dateTimeConverter = (dateString) => {
        const d = new Date(dateString);
        const displayHandler = (time) => {
            return time < 10 ? `0${time}` : time
        }
        return `${displayHandler(d.getDate())}-${displayHandler(d.getMonth() + 1)}-${d.getFullYear()}`;
    }

    //this function for re-build the products data 
    productsDataConfig = (products) => {
        return products.map(element => {
            return {
                ...element.product,
                quantity: element.quantity,
                readonly: true
            }
        })
    }

  /*   componentWillMount() {
        let { _id, order_date, tasks, price, paid, products, shipper } = this.props.data;
        let { name, owner } = this.props.data.store;

        this.data = {
            order_date: this.dateTimeConverter(order_date),
            receipt_date: !tasks.receipt_date ? "Chưa nhận" : this.dateTimeConverter(tasks.receipt_date),
            price: `${price.toFixed(3)} VND`,
            paid,
            shipper,
            products: this.productsDataConfig(products),
            _id: _id
        };
        this.store = {
            name,
            email: owner.email,
            phone: owner.phone
        }
    } */

    _dataHandler = () => {
        let { _id, order_date, tasks, price, paid, products, shipper } = this.props.data;
        let { name, owner } = this.props.data.store;

        this.data = {
            order_date: this.dateTimeConverter(order_date),
            receipt_date: !tasks.receipt_date ? "Chưa nhận" : this.dateTimeConverter(tasks.receipt_date),
            price: `${price.toFixed(3)} VND`,
            paid,
            shipper,
            products: this.productsDataConfig(products),
            _id: _id
        };
        this.store = {
            name,
            email: owner.email,
            phone: owner.phone
        }
    }

    onShowSliderHandler = () => {
        if (!this.state.showSlider) {
            Animated.timing(this.sliderAnim, {
                toValue: 120,
                duration: 200,
            }).start(() => {
                setTimeout(() => {
                    this.setState(prevState => ({ showSlider: !prevState.showSlider }))
                }, 0)
            });
        }
        else {
            Animated.timing(this.sliderAnim, {
                toValue: 0,
                duration: 200,
            }).start(() => {
                setTimeout(() => {
                    this.setState(prevState => ({ showSlider: !prevState.showSlider }))
                }, 0)
            });
        }

    }

    _onStatusHandler = () => {
        if (!this.data.shipper) {
            return (
                <React.Fragment>
                    <Icon name="autorenew" size={30} color="grey" />
                    <Text style={styles.statusTxt}>Đang xử lý</Text>
                </React.Fragment>
            )
        } else {
            if (!this.data.paid) {
                return (
                    <React.Fragment>
                        <Icon name="motorcycle" size={30} color="grey" />
                        <Text style={styles.statusTxt}>Đang giao</Text>
                    </React.Fragment>
                )
            } else {
                return (
                    <React.Fragment>
                        <Icon name="done" size={30} color={ui.colors.highlight} />
                        <Text style={[styles.statusTxt,{color:ui.colors.highlight}]}>Đã nhận</Text>
                    </React.Fragment>
                )
            }
        }
    }

    render() {
        this._dataHandler();
        //let paidIcon = (<Icon name="close" size={20} color="black" />);
        if (this.data.paid)
            paidIcon = (<Icon name="done" size={20} color={ui.colors.highlight} />)
        return (
            <View style={styles.container}>
                <View style={styles.infoPanel} >
                    <View style={styles.storeInfo}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Shipper', { invoiceId: this.data._id })}
                            style={{ width: 70, alignItems: 'center' }}>
                            {/*  <Text style={styles.storeName}>{this.store.name}</Text>
                            <Text style={styles.storeInfoTxt}>{this.store.phone}</Text>
                            <Text style={styles.moreInfoTxt}>Click để xem chi tiết</Text> */}
                            {
                                this._onStatusHandler()
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.mainInfo}>
                        <View style={styles.txtContainer}>
                            <Icon name="call-made" size={20} color="black" />
                            <Text style={styles.dateTxt}>{this.data.order_date}</Text>
                        </View>
                        <View style={styles.txtContainer}>
                            <Icon name="call-received" size={20} color="black" />
                            <Text style={styles.dateTxt}>{this.data.receipt_date}</Text>
                        </View>
                        <View style={styles.txtContainer}>
                            {/*  {paidIcon} */}
                            <Text style={[styles.costTxt, { color: this.data.paid ? ui.colors.highlight : "black" }]}>{this.data.price}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.onShowSliderHandler} style={styles.slideHoriz}>
                        <Icon name="more-horiz" size={30} color={ui.colors.light_gray} />
                    </TouchableOpacity>
                </View>
                <Animated.View style={{ height: this.sliderAnim }}></Animated.View>
                <View style={styles.slideContainer} >
                    <Slider style={styles.slider} products={this.data.products} />
                </View>
            </View>
        )
    }
}

const _width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    slideContainer: {
        width: '100%',
    },
    infoPanel: {
        height: 120,
        width: "100%",
        position: "absolute",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
        elevation: 3,
        backgroundColor: 'white',
        borderBottomWidth: 0.2,
        borderTopWidth: 0.2,
        borderBottomColor: ui.colors.light_gray,
        borderTopColor: ui.colors.light_gray
    },
    mainInfo: {
        height: "100%",
        width: "50%",
        paddingRight: 12,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    txtContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    dateTxt: {
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.small,
        color: 'black'
    },
    costTxt: {
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.normal,
    },
    slideHoriz: {
        position: "absolute",
        left: _width / 2 - 15,
        bottom: 10
    },
    storeInfo: {
        height: "80%",
        marginLeft: 6,
        flexDirection: 'row',
        alignItems: "center"
    },
    storeInfoTxt: {
        fontFamily: ui.fonts.light,
        color: 'black',
        fontSize: ui.fontSize.tiny
    },
    storeName: {
        fontFamily: ui.fonts.bold,
        color: 'black',
        fontSize: ui.fontSize.semiTiny
    },
    moreInfoTxt: {
        fontFamily: ui.fonts.light,
        color: 'black',
        fontSize: ui.fontSize.semiTiny,
        textDecorationLine: "underline"
    },
    statusTxt: {
        fontFamily: ui.fonts.bold,
        color: 'grey',
        fontSize: ui.fontSize.semiTiny
    }
})
