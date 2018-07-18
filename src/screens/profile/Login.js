import React from 'react';
import {
    StyleSheet, View, Text, Image, TouchableOpacity, TouchableNativeFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import FBDSK, {
    AccessToken,
    LoginManager
} from 'react-native-fbsdk';

import { trySaveLocalCustomer } from '../../store/actions';
import ui from '../../share/ui.constant';
import { Input, UButton, Form, Noti, FlatButton } from '../../components';
import { FecthData } from '../../components';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchData: false,
            oauthFailed: false
        }
        this.query = null;
    }

    onLogin = () => {
        const email = this.refs.loginForm.getInputValue("email_input_01");
        const pass = this.refs.loginForm.getInputValue("password_input_01");
        this.query = `
        {
            authenticatedCustomer(email:"${email}",pass:"${pass}") {
                _id email name img phone
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
        }
        `;
        console.log(this.query);
        this.setState({ fetchData: true })

    };

    loadedDataHandler = (props) => {
        let customer = props.data;
        //console.log(customer);
        this.props.trySaveLocalCustomer(customer);
        return null;
    };

    fbOauth = () => {
        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
            (result) => {
                if (result.isCancelled) {
                    this.setState({ oauthFailed: true }, () => {
                        setTimeout(() => this.setState({ oauthFailed: false }), 5000)
                    });
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                           // console.log(data.accessToken.toString())
                            this.props.navigation.navigate('FbSignUp', {
                                accessToken: data.accessToken,
                            })
                        }
                    )
                }
            },
            (error) => {
                this.setState({ oauthFailed: true }, () => {
                    setTimeout(() => this.setState({ oauthFailed: false }), 5000)
                });
                console.log('Login fail with error: ' + error);
            }
        );
    };

    render() {
        return (
            <View style={styles.container}>
                {/* <UButton top={32} onPress={this.onLogin} txt="Đăng nhập" iconName="done" /> */}
                <View style={styles.logoSegment}>
                    <Image style={styles.logo} source={require('../../share/images/ugao_logo.png')} />
                    <View style={styles.txtSegment}>
                        <Text style={styles.welcomeTxt}>Welcome to</Text>
                        <Image style={styles.logoTxt} source={require('../../share/images/logo_txt_2.png')} />
                    </View>
                </View>
                <View
                    style={styles.loginSegment}>
                    {this.state.fetchData && FecthData(this.query, "authenticatedCustomer", null, this.loadedDataHandler, "Tài khoản không tồn tại")}
                    {
                        this.props.notiTxt &&
                        <Noti message={this.props.notiTxt.message} />
                    }
                    {
                        this.state.oauthFailed &&
                        <Noti message={"Không thể kết nối facebook"} />
                    }
                    <Form
                        ref="loginForm"
                        style={styles.loginForm}>
                        <Input
                            hint="vd test@gmail.com"
                            id="email_input_01"
                            ref="emailInput"
                            config={{ keyboardType: "email-address" }}
                            type='text'
                            label="Email"
                            controlType="email"
                            btnEvent={() => {
                            }}
                        />
                        <Input
                            ionicon
                            id="password_input_01"
                            ref="passwordInput"
                            type={'text'}
                            label={"Password"}
                            controlType="password"
                            hint=""
                            btnEvent={() => {
                            }}
                        />
                        <FlatButton width="90%" invert  top={32} onPress={this.onLogin} title="Đăng nhập" />
                        {/* <UButton color={ui.colors.highlight} top={32} onPress={this.onLogin} txt="Đăng nhập" iconName="done" /> */}
                    </Form>
                    <View style={styles.oauthSegment}>
                        <View style={styles.fbButtonHolder}>
                            <TouchableNativeFeedback onPress={this.fbOauth}
                                background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.3)", true)}>
                                <View style={styles.fbButton}>
                                    <Icon name="logo-facebook" size={28} color="#44609D" />
                                    <Text style={styles.fbTxt}>Facebook</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <FlatButton 
                            color="black"
                            onPress={() => this.props.navigation.navigate('Register')} 
                            width='30%' title="Đăng ký"/>
                        {/* <TouchableOpacity style={styles.registerBtn} onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={styles.oauthTxt}>Đăng ký</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoSegment: {
        height: '30%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logo: {
        height: 120,
        width: 120,
        resizeMode: 'contain'
    },
    welcomeTxt: {
        fontFamily: ui.fonts.thin,
        fontSize: ui.fontSize.massive,
        color: 'black'
    },
    logoTxt: {
        height: 30,
        width: 50,
        marginLeft: 4,
        resizeMode: 'contain'
    },
    txtSegment: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    loginSegment: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginForm: {
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    oauthSegment: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop:8.0
    },
    oauthTxt: {
        fontFamily: ui.fonts.thin,
        fontSize: ui.fontSize.normal,
        color: 'black',
    },
    btnContainer: {
        marginTop: 32
    },
    notiContent: {
        width: '70%',
        height: 20,
        backgroundColor: ui.colors.yellow,
        justifyContent: "center",
        alignItems: "center"
    },
    notiTxt: {
        color: 'white',
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.semiTiny
    },
    fbButtonHolder: {
        height: 40,
        width: '40%',
        borderRadius: 6.0
    },
    fbButton: {
        width: "100%",
        height: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#44609D',
        borderRadius: 4
    },
    fbTxt: {
        paddingLeft: 12.0,
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.normal,
        color: '#44609D'
    },
    registerBtn: {
        width: '30%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapDispatchToProps = dispatch => {
    return {
        trySaveLocalCustomer: (customer) => dispatch(trySaveLocalCustomer(customer))
    }
};

export default connect(null, mapDispatchToProps)(Login);