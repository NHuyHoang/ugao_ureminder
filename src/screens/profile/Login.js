import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import ui from '../../share/ui.constant';
import { Input, UButton } from '../../components';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validForm: false
        }
        this.input = { email: false, password: false };
    }
    checkValidity = (type, value) => {
        this.input[type] = value;
        if (value === false && this.state.validForm === true)
            this.setState({ validForm: false })
        for (key in this.input) {
            if (this.input[key] === false) return;
        }
        this.setState({ validForm: true })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoSegment}>
                    <Image style={styles.logo} source={require('../../share/images/ugao_logo.png')} />
                    <View style={styles.txtSegment}>
                        <Text style={styles.welcomeTxt}>Welcome to</Text>
                        <Image style={styles.logoTxt} source={require('../../share/images/logo_txt_2.png')} />
                    </View>
                </View>
                <View
                    style={styles.loginSegment}>
                    <Input
                        config={{keyboardType:"email-address"}}
                        type='text'
                        label="Email"
                        controlType="email"
                        btnEvent={() => { }}
                        checkValidity={this.checkValidity} />
                    <Input
                        ionicon
                        type={'text'}
                        label={"Password"}
                        controlType="password"
                        btnEvent={() => { }}
                        checkValidity={this.checkValidity} />
                    <View style={styles.btnContainer}>
                        <UButton disabled={!this.state.validForm} txt="Đăng nhập" iconName="done" />
                    </View>
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
            </View>
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
        backgroundColor: ui.colors.smoke,
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
        backgroundColor: ui.colors.smoke,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginForm: {
        height: '90%',
        width: '95%',
        borderRadius: 12,
        elevation: 5,
        backgroundColor: 'white',
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
    }
})