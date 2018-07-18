import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux';

import { Input, UButton, Noti } from '../../components'
import ui from '../../share/ui.constant';
import globalConst from '../../store/constant';
import { tryRegisterCustomer, OAuthCustomerLogin } from '../../store/actions';

class FbSignUp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            phone: "",
            status: 'LOADING',
            registering: false,
            registerFailed: false,
        }
        this.getUserInfo(this.props.navigation.state.params.accessToken);
    }

    getUserInfo = async (token) => {
        let userInfo
        try {
            userInfo = await fetch(`https://graph.facebook.com/me?fields=email,name&access_token=${token}`)
                .then(info => info.json());
            const query = `${globalConst.DB_URI}?query={
                OAuthCustomer(email:"${userInfo.email}") {
                    _id email name img phone token
                    location{
                        address
                        lat
                        lng
                    }
                    invoices {
                        _id
                        order_date
                        tasks { receipt_date }
                        price
                        paid
                        shipper{ _id }
                        store { name owner { email phone token } }
                        products {  product { _id name img price weight} quantity }
                    }
                }
            }`
            console.log(query);
            let customer = await fetch(query)
                .then(data => data.json());
            if (customer.data.OAuthCustomer) {
                //account exist -> save to local
                this.props.OAuthCustomerLogin(customer.data.OAuthCustomer, () => {
                    this.props.navigation.goBack();
                });
            } else {
                //regist account
                this.setState({
                    info: {
                        email: userInfo.email,
                        name: userInfo.name,
                        img: `https://graph.facebook.com/${userInfo.id}/picture?height=250&width=250`
                    },
                    status: 'SUCCESS'
                })
            }
        } catch (err) {
            this.setState({ status: 'FAILED' });
            console.log(err)
        }
    }

    onRegisterCustomer = () => {
        this.setState({
            registering: true, info: {
                ...this.state.info,
                phone: this.state.phone
            }
        }, () => {
            this.props.tryRegisterCustomer(this.state.info, (success) => {
                if (success)
                    this.props.navigation.goBack();
                else {
                    this.setState({ registerFailed: true, registering: false }, () => {
                        setTimeout(() => this.setState({ registerFailed: false }), 5000)
                    })
                }
            });
        });
    }

    onChangeText = (text) => {
        this.setState({ phone: text });
    }

    render() {
        let displayContent;
        switch (this.state.status) {
            case ('LOADING'):
                displayContent = <ActivityIndicator size="large" color="black" />
                break;
            case ('SUCCESS'):
                displayContent = (
                    <React.Fragment>
                        <View style={styles.avatarContainer}>
                            <Image style={styles.avatar} source={{ uri: this.state.info.img }} />
                        </View>
                        <Text style={styles.decorateTxt}>
                            Xin chào,
                        </Text>
                        <Text style={styles.decorateTxt2}>
                            {this.state.info.name}
                        </Text>
                        <Text style={styles.decorateTxt3}>
                            {this.state.info.email}
                        </Text>
                        <View style={styles.phoneInput}>
                            <Icon size={22} name="call" color="black" />
                            <TextInput
                                onChangeText={(text) => this.onChangeText(text)}
                                placeholder="Số điện thoại của bạn"
                                value={this.state.phone}
                                style={styles.inputStyle}
                                keyboardType='numeric' />
                        </View>
                        {
                            this.state.registerFailed &&
                            <React.Fragment>
                                <View style={{ height: 8 }} />
                                <Noti message="Đã xảy ra lỗi, vui lòng thử lại" />
                            </React.Fragment>
                        }
                        {
                            !this.state.registering
                                ? <UButton disabled={this.state.phone === ""} top={32} onPress={this.onLogin} txt="Đăng ký" iconName="done" onPress={this.onRegisterCustomer} />
                                : <ActivityIndicator style={{ marginTop: 8 }} size="small" color="black" />
                        }
                    </React.Fragment>
                )
                break;
            case ('FAILED'):
                displayContent = <Noti message="Đã xảy ra lỗi" />
                break;
        }
        return (
            <View style={[styles.container, { justifyContent: this.state.status !== "FAILED" ? 'center' : 'flex-start' }]}>
                {displayContent}
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
        resizeMode: 'contain',
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
        fontFamily: ui.fonts.light_italic,
        color: 'black',
        paddingLeft: 8,
        paddingRight: 8,
        textDecorationLine: 'underline'
    },
    phoneInput: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputStyle: {
        width: "50%",
        fontFamily: ui.fonts.light,
        color: 'black',
        textAlign: 'center'
    }
})

const mapDispatchToProps = dispatch => {
    return {
        OAuthCustomerLogin: (customer, done) => dispatch(OAuthCustomerLogin(customer, done)),
        tryRegisterCustomer: (info, callback) => dispatch(tryRegisterCustomer(info, callback))
    }
}

export default connect(null, mapDispatchToProps)(FbSignUp);