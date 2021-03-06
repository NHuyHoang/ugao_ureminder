import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableNativeFeedback, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, FecthData, Noti } from '../../components';
import ui from '../../share/ui.constant';
import globalConst from '../../store/constant';

const ComponentState = Object.freeze({ idle: "idle", loading: "loading", success: "success", failed: "failed" })

export default class shipper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compState: ComponentState.loading
        }
        this.query = `
        {
            invoice(id: "${this.props.navigation.state.params.invoiceId}") {
              order_date
              paid
              tasks{
                  estimationTime
                  receipt_date
              }
              shipper {
                name
                _id
                phone
                img
              }
              store{
                _id
                name
              }
            }
          }
        `;
        this._onFetchInvoice();
        //this.fectData = FecthData(this.query, "invoice", this.props, LoadedContent);
    }

    _onFetchInvoice = async () => {
        const url = `${globalConst.DB_URI}?query=${this.query}`;
        console.log("url-----:", url);
        const response = await fetch(url)
            .then(data => data.json());
        if (!response) {
            this.setState({ compState: ComponentState.failed });
            return;
        }
        this.invoice = response.data.invoice;
        this.setState({ compState: ComponentState.success });
    }

    _onRenderContent = () => {
        switch (this.state.compState) {
            case (ComponentState.idle):
                return null;
            case (ComponentState.loading):
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
                        <ActivityIndicator size="small" color="black" />
                    </View>
                )
            case (ComponentState.success): {
                console.log(this.invoice);
                return <LoadedContent data={this.invoice} />
            }
            case (ComponentState.failed):
                return <Noti message="Đã xảy ra lỗi" />
        }
    }

    render() {
        return (
            <React.Fragment>
                <TouchableNativeFeedback
                    onPress={() => this.props.navigation.goBack()}
                    background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.7)', true)}>
                    <View style={styles.iconBtnContainer}>
                        <Icon name='clear' size={20} color='red' />
                    </View>
                </TouchableNativeFeedback>
                {this._onRenderContent()}
            </React.Fragment>
        )
    }
}

const LoadedContent = (props) => {
    const shipper = props.data.shipper;
    const store = props.data.store;
    const task = props.data.tasks;
    const paid = props.data.paid;
    console.log("-----paid", paid);
    let displayContent;
    if (!shipper) displayContent = (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Image
                style={{ resizeMode: "contain", height: 160, width: 160, marginBottom: 8 }}
                source={{ uri: "https://www.shareicon.net/data/2015/10/07/113776_packages_512x512.png" }}
            />
            <Text style={[styles.decorateTxt, { fontFamily: ui.fonts.bold }]}>
                Đơn hàng của bạn đang được xử lý !!!
            </Text>
            <Text style={styles.decorateTxt3}>
                Bạn sẽ nhận được thông báo về thời gian nhận hàng
            </Text>
        </View>
    )
    else {
        let date = new Date(parseInt(task.estimationTime));
        const displayDate = `Ngày ${date.getDate()} tháng ${date.getMonth() + 1} lúc ${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
        if (date.getHours() <= 0) displayDate = `${date.getMinutes()} phút`;
        displayContent = (
            <ScrollView style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatar} source={{ uri: shipper.img }} />
                </View>
                <Text style={styles.decorateTxt}>
                    Xin chào, tôi là
                </Text>
                <Text style={styles.decorateTxt2}>
                    {shipper.name}
                </Text>
                {
                    !paid ?
                        <React.Fragment>
                            <Text style={styles.decorateTxt3}>
                                Bạn sẽ nhận được hàng vào
                            </Text>
                            {/* <Text style={[styles.decorateTxt3,{color:ui.colors.yellow}]}>
                                <Text style={{ fontFamily: ui.fonts.bold }}>{displayDate}</Text>
                                
                            </Text> */}
                            <Noti message={displayDate} />
                        </React.Fragment>
                        :
                        <Noti success message="Đơn hàng của bạn đã được giao" />
                }
                <View style={{ height: 8 }} />
                <Input
                    id="name-input"
                    value={shipper.phone}
                    type={'text'}
                    config={{ editable: false }}
                    label={"Số điện thoại"} />
                <Input
                    id="email_input_01"
                    config={{ keyboardType: "email-address" }}
                    type='text'
                    label="Biển số xe"
                    config={{ editable: false }}
                    value={"59X1-20531"} />
                <Input
                    id="email_input_01"
                    config={{ keyboardType: "email-address" }}
                    type='text'
                    label="Cửa hàng"
                    config={{ editable: false }}
                    value={store.name} />
            </ScrollView >
        )
    }
    return (
        <React.Fragment>
            {displayContent}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    avatarContainer: {
        height: 180,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    avatar: {
        height: 150,
        width: 150,
        borderRadius: 9999,
        resizeMode: 'cover',
    },
    decorateTxt: {
        width: "100%",
        textAlign: "center",
        fontSize: 18,
        fontFamily: ui.fonts.thin_italic,
        color: 'black'
    },
    decorateTxt2: {
        width: "100%",
        textAlign: "center",
        fontSize: 43,
        fontFamily: ui.fonts.decor,
        color: 'black'
    },
    decorateTxt3: {
        width: "100%",
        textAlign: "center",
        fontSize: 15,
        fontFamily: ui.fonts.light,
        color: 'black',
        paddingLeft: 8,
        paddingRight: 8
    },
    iconBtnContainer: {
        marginRight: 14,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        position: "absolute",
        top: 4,
        right: 0,
        zIndex: 1,
    }
})