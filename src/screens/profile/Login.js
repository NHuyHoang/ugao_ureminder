import React, { Fragment } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { trySaveLocalCustomer } from '../../store/actions';
import ui from '../../share/ui.constant';
import { Input, UButton, Form, Noti } from '../../components';
import { FecthData } from '../../components';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchData: false,
        }
        this.query = null;
    }

    onLogin = () => {
        /*  const email = this.refs.loginForm.getInputValue("email_input_01");
         const pass = this.refs.loginForm.getInputValue("password_input_01"); */
        const email = "bluegasus@gmail.com";
        const pass = "huyhoang3562927";
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
                    store { name owner { email phone token } }
                    products {  product { _id name img price weight} quantity }
                  }
            }
        }
        `;
        console.log(this.query);
        this.setState({ fetchData: true })

    }

    loadedDataHandler = (props) => {
        let customer = props.data;
        //console.log(customer);
        this.props.trySaveLocalCustomer(customer);
        return null;
    }






    render() {
        return (
            <View style={styles.container}>
                <UButton top={32} onPress={this.onLogin} txt="Đăng nhập" iconName="done" />
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
                            btnEvent={() => { }}
                        />
                        <Input
                            ionicon
                            id="password_input_01"
                            ref="passwordInput"
                            type={'text'}
                            label={"Password"}
                            controlType="password"
                            hint=""
                            btnEvent={() => { }}
                        />
                        <UButton top={32} onPress={this.onLogin} txt="Đăng nhập" iconName="done" />
                    </Form>
                    <View style={styles.oauthSegment}>
                        <Text style={styles.oauthTxt}>Sử dụng tài khoản</Text>
                        <TouchableOpacity style={{ marginLeft: 8, marginRight: 8 }}>
                            <Icon name="logo-facebook" size={32} color="#44609D" />
                        </TouchableOpacity>
                        <Text style={styles.oauthTxt}>hoặc</Text>
                        <TouchableOpacity style={{ marginLeft: 8, marginRight: 8 }}>
                            <Icon name="logo-googleplus" size={32} color="#EF2F1E" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        )
    }
}




const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
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
        height: '70%',
        width: '100%',
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
        height: '15%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 8
    },
    oauthTxt: {
        fontFamily: ui.fonts.thin,
        fontSize: ui.fontSize.semiTiny,
        color: 'black'
    },
    btnContainer: {
        marginTop: 32
    },
    notiContent: {
        width: '100%',
        height: 20,
        backgroundColor: ui.colors.yellow,
        justifyContent: "center",
        alignItems: "center"
    },
    notiTxt: {
        color: 'white',
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.semiTiny
    }
})

const mapDispatchToProps = dispatch => {
    return {
        trySaveLocalCustomer: (customer) => dispatch(trySaveLocalCustomer(customer))
    }
}

export default connect(null, mapDispatchToProps)(Login);