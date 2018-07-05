import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Animated,
    ActivityIndicator,
    TouchableOpacity,
    NetInfo,
    KeyboardAvoidingView,
    TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux'

import { Input, Noti, FlatButton, Form, RoundedIconButton } from '../../components';
import ui from '../../share/ui.constant';
import globalConstant from '../../store/constant';

import { tryRegisterCustomer } from '../../store/actions';


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: register_procedure.checkExistEmail,
            compState: ComponentState.idle,
            notiMessage: "Failed message"
        };
        this.animation = {
            screenPosition: new Animated.Value(0)
        }
    }

    _changeProcedureScreen = (step, isBack, callback) => {
        //go to the next step
        this.setState({ step }, () => {
            let stepNumb = 0;
            switch (this.state.step) {
                case register_procedure.checkExistEmail:
                    stepNumb = 0;
                    break;
                case register_procedure.verifyEmail:
                    stepNumb = 1;
                    break;
                case register_procedure.assignInfomation:
                    stepNumb = 2;
                    break;
            }
            //if isBack === true go to previous step
            Animated.timing(this.animation.screenPosition, {
                toValue: isBack ? _width * stepNumb : -1 * _width * stepNumb,
                duration: 300,
            }).start(() => {
                if (callback)
                    callback();
            });
        })
    };

    _onTransitVerifyEmail = async (successHandler, errorHandler) => {
        const response = await this._onSendVerificationCode();
        if (response.success) {
            this.refs.VerifyEmailScreen._onCountdown(60);
            this._changeProcedureScreen(register_procedure.verifyEmail, false, successHandler);

        }
        else errorHandler();
    }

    _onTransitCheckExistEmail = () => {
        this._changeProcedureScreen(register_procedure.checkExistEmail, true)
        //clear the countdown timer
        this.refs.VerifyEmailScreen._clearInterVal();
    }

    //generate verification code
    _generateCode = () => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    //send email with verification code
    _onSendVerificationCode = () => {
        const uri = `${globalConstant.API_URI}gapis/email/verification`;
        const email = this.refs.CheckExistEmail._onGetInputValue();
        this.verificationCode = this._generateCode();
        const body = {
            receipient: email,
            verificationCode: this.verificationCode
        }
        return fetch(uri, {
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        }).then(response => response.json());
    }

    _onCheckVerificationCode = (code) => {
        return this.verificationCode === code;
    }

    _onTryRegisterCustomer = (info, callback) => {
        const { name, phone, coordinate, pass } = info;
        const customer = {
            email: this.refs.CheckExistEmail._onGetInputValue(),
            name, img: null, phone, coordinate, pass
        }
        this.props.tryRegisterCustomer(customer, callback);
    }

    componentWillUnmount() {
        this.verificationCode = null;
    }

    _onShowNoti = (state, message) => {
        this.setState({ compState: state, notiMessage: message }, () => {
            setTimeout(() => this.setState({ compState: ComponentState.idle, notiMessage: "" }), 3000);
        })
    };


    render() {
        const screenTransition = {
            transform: [{ translateX: this.animation.screenPosition }]
        };
        return (
            <View>
                <Animated.View style={[styles.container, screenTransition]}>

                    <CheckExistEmail
                        ref="CheckExistEmail"
                        onNext={this._onTransitVerifyEmail}
                        onShowNoti={this._onShowNoti}
                    />
                    <VerifyEmail
                        onNext={() => this._changeProcedureScreen(register_procedure.assignInfomation)}
                        onBack={this._onTransitCheckExistEmail}
                        ref="VerifyEmailScreen"
                        checkCode={this._onCheckVerificationCode}
                        sendCode={this._onSendVerificationCode}
                        onShowNoti={this._onShowNoti}
                    />
                    <AssignInformation
                        navigation={{ ...this.props.navigation }}
                        onRegister={this._onTryRegisterCustomer}
                        onShowNoti={this._onShowNoti}
                    />

                </Animated.View>
                <TouchableOpacity
                    style={styles.exitBtn}
                    onPress={() => this.props.navigation.goBack()}>
                    <Icon name="clear" size={20} color="red" />
                </TouchableOpacity>
                {
                    (this.state.compState === ComponentState.failed || this.state.compState === ComponentState.success)
                    && <View style={styles.notiContainer}>
                        <Noti
                            success={this.state.compState === ComponentState.success}
                            message={this.state.notiMessage} />
                    </View>
                }
            </View >
        )
    }
}
const ExitButton = (props) => (
    <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.3)", false)}
        onPress={() => { }}>
        <View style={styles.exitBtn}>
            <Icon name="clear" size={20} color="red" />
        </View>
    </TouchableNativeFeedback>
);

class CheckExistEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compState: ComponentState.idle,
            notiMessage: ""
        }
    }

    _onGetInputValue = () => this.refs.emailInput.getValue();
    _onGetInputValid = () => this.refs.emailInput.getValid();

    _onCheck = async () => {
        const inputValue = this._onGetInputValue();
        if (inputValue === "") {
            alert("Email không được để trống");
            return;
        }
        if (!this._onGetInputValid()) {
            alert("Vui lòng nhập đúng định dạng email");
            return;
        }
        //check connection
        const isConnected = await NetInfo.isConnected.fetch().then(isConnected => isConnected);
        if (!isConnected) {
            alert("Vui lòng kiểm tra kết nối");
            return;
        }
        this.setState({ compState: ComponentState.loading });
        //get the customer
        const query = `{OAuthCustomer(email: "${inputValue}") {_id} }`;
        const response = await fetch(`${globalConstant.DB_URI}?query=${query}`).then(data => data.json());
        if (response.data.OAuthCustomer !== null) {
            this.props.onShowNoti(ComponentState.failed, "Email đã được đăng ký");
            this.setState({ compState: ComponentState.idle });
        } else {
            const errorHandler = () => {
                this.props.onShowNoti(ComponentState.failed, "Không gửi được email");
                this.setState({ compState: ComponentState.idle });
            };
            const successHandler = () => {
                this.setState({ compState: ComponentState.idle });
            };
            this.props.onNext(successHandler, errorHandler);
        }
    };



    render() {
        return (
            <View style={styles.screenView}>
                <View style={{ width: '90%' }}>

                    <Input
                        id="email_input_01"
                        ref="emailInput"
                        config={{ keyboardType: "email-address" }}
                        type='text'
                        label="Email"
                        controlType="email"
                        btnEvent={() => {
                        }}
                    />
                </View>
                <View style={{ height: 15.0 }} />

                <View style={{ height: 15.0 }} />
                <View style={styles.btnContainer}>
                    {
                        this.state.compState === ComponentState.loading
                        && <ActivityIndicator size="small" color="black" />

                    }
                    {
                        this.state.compState !== ComponentState.loading
                        &&
                        <FlatButton invert width="100%" title="Tiếp tục" onPress={this._onCheck} />
                    }
                </View>
                {
                    this.state.compState === ComponentState.failed
                    && <View style={styles.notiContainer}>
                        <Noti message={this.state.notiMessage} />
                    </View>
                }
            </View>
        )
    }
}

class VerifyEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
            resendState: ComponentState.idle
        };
    }

    _clearInterVal = () => {
        clearInterval(this.interval);
        this.setState({ timer: null });
    }

    _onCountdown = (duration) => {
        if (!duration) return;
        let timer = duration, minutes, seconds;
        this.interval = setInterval(() => {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            if (--timer < 0) {
                timer = duration;
            }
            if (minutes == 0 && seconds == 0) {
                this._clearInterVal();
                this.setState({ timer: 0 })
            } else {
                this.setState({ timer: minutes + ":" + seconds })
            }

        }, 1000);
    }

    //check the verification code
    _onCheckVerificationCode = () => {
        const isValidCode = this.props.checkCode(this.refs.codeInput.getValue());
        if (isValidCode) {
            this.props.onNext();
        } else {
            this.props.onShowNoti(ComponentState.failed, "Code không hợp lệ");
        }
    }

    _onReSendVerificationCode = () => {
        this.setState({ resendState: ComponentState.loading });
        this.props.sendCode()
            .then(_ => {
                this._clearInterVal();
                this.setState({ resendState: ComponentState.idle }, () => {
                    this._onCountdown(60);
                });
            }).catch(_ => {
                this._clearInterVal();
                //TODO: show noti panel
            })
    }

    componentWillUnmount() {
        this._clearInterVal();
    }

    render() {
        return (
            <View style={styles.screenView}>
                <Text style={styles.title}>Mã xác nhận đã được gửi qua email</Text>
                <Text style={styles.subTitle}>Vui lòng nhập mã để tiếp tục đăng ký </Text>
                {/*<Button title="next" onPress={this.props.onNext}/>*/}
                <View style={{ width: '90%' }}>
                    <Input
                        ref="codeInput"
                        type='text'
                        config={{ maxLength: 5 }}
                        btnEvent={() => {
                        }}
                    />
                </View>
                <View style={{ height: 12.0 }} />
                {
                    this.state.timer !== 0
                        ? (
                            <Text style={[styles.subTitle, { fontSize: 14.0 }]}>Mã xác nhận có hiệu lực trong <Text
                                style={[styles.title, { fontSize: 14.0 }]}>{this.state.timer} giây</Text>
                            </Text>
                        )
                        : <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Text style={[styles.subTitle, { fontSize: 12.0, width: 'auto' }]}>Không nhận được mã.
                            </Text>
                            <View style={{ width: 4 }} />
                            <TouchableOpacity onPress={this._onReSendVerificationCode}>
                                {
                                    this.state.resendState === ComponentState.idle
                                        ? <Text
                                            style={[styles.title, { fontSize: 14.0, width: 'auto', color: ui.colors.highlight }]}>Gửi lại</Text>
                                        : <ActivityIndicator size="small" color={ui.colors.highlight} />
                                }
                            </TouchableOpacity>
                        </View>
                }
                <View style={styles.groupBtn}>
                    <FlatButton width="40%" title="Quay lại" onPress={this.props.onBack} />
                    <View style={{ width: 12.0 }} />
                    <FlatButton invert width="40%" title="Tiếp tục" onPress={this._onCheckVerificationCode} />
                </View>
            </View>
        )
    }
}

class AssignInformation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            compState: ComponentState.idle,
            notiMessage: "Erorr founded",
            location: {
                address: "",
                latitude: null,
                longitude: null,
            }
        }
    }

    _onPreparedForRegister = async () => {
        const isConnected = await NetInfo.isConnected.fetch().then(isConnected => isConnected);
        if (!isConnected) {
            alert("Vui lòng kiểm tra kết nối");
            return;
        }
        const coordinate = {
            address: this.state.location.address,
            lat: this.state.location.latitude,
            lng: this.state.location.longitude
        }
        const info = {
            name: this.refs.nameInput.getValue(),
            phone: this.refs.phoneInput.getValue(),
            pass: this.refs.passwordInput.getValue(),
            coordinate
        }
        this.setState({ compState: ComponentState.loading });
        const callback = (isSuccess) => {
            if (isSuccess) {
               // this.props.onShowNoti(ComponentState.success, "Đăng ký thành công");
                this.props.navigation.goBack();
            }
            else {
                this.props.onShowNoti(ComponentState.failed, "Đã xảy ra lỗi");
            }
            this.setState({ compState: ComponentState.idle, })
        }
        this.props.onRegister(info, callback);

    }

    _onGetLocation = (location) => {
        //this is solution for form validation
        //because address input is neither editable
        //nor checking validity in onChangeText
        this.refs.addressInput.onChangeTextHandler(location.address);
        this.setState({
            location: { ...location },

        });
    }

    render() {
        return (
            <View style={[styles.screenView, { justifyContent: 'flex-start' }]}>
                <View style={styles.titlePanel}>
                    <Text style={[styles.title, { fontSize: 42.0, width: 'auto' }]}>HOÀN TẤT</Text>
                    <Text style={[styles.subTitle, { fontSize: 26.0, width: 'auto' }]}>THÔNG TIN CỦA BẠN</Text>
                </View>
                <View style={{ width: '100%', justifyContent: 'center' }}>
                    <KeyboardAvoidingView behavior="padding" >
                        <Form style={{
                            width: "100%", alignItems: 'center'
                        }}>
                            <Input
                                id="name-input"
                                ref="nameInput"
                                type={'text'}
                                label={"Họ & tên"} />
                            <Input
                                ionicon
                                id="password-input"
                                ref="passwordInput"
                                type={'text'}
                                label={"Password"}
                                controlType="password"
                                hint=""
                                btnEvent={() => {
                                }}
                            />
                            <Input
                                id="phone-input"
                                ref="phoneInput"
                                config={{ keyboardType: 'numeric' }}
                                type={'text'}
                                label={"Điện thoại"} />
                            <Input
                                id="address-input"
                                ref="addressInput"
                                type={'text'}
                                label={"Địa chỉ"}
                                config={{ editable: false }}
                                iconBtn={{ name: "place" }}
                                btnEvent={() => this.props.navigation.navigate('Location', {
                                    getLocation: this._onGetLocation
                                })}
                            />
                            {
                                this.state.compState !== ComponentState.loading
                                    ? <FlatButton top={22} title="Đăng ký" invert width="80%" onPress={this._onPreparedForRegister} />
                                    : <React.Fragment />
                            }
                        </Form>
                        {
                            this.state.compState === ComponentState.loading
                            && <View style={{ marginTop: 22.0 }}><ActivityIndicator size="small" color="black" /></View>
                        }

                    </KeyboardAvoidingView>
                </View>
                {
                    this.state.compState === ComponentState.failed
                    && <View style={styles.notiContainer}>
                        <Noti message={this.state.notiMessage} />
                    </View>
                }
                {
                    this.state.compState === ComponentState.success
                    && <View style={styles.notiContainer}>
                        <Noti success message={this.state.notiMessage} />
                    </View>
                }
            </View >
        )
    }
}

const _width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        width: _width * 3,
        height: '100%',
        flexDirection: 'row',
    },
    exitBtn: {
        zIndex: 1,
        position: "absolute",
        top: 8,
        left: _width * 0.9,
        right: 30,
        height: 50.0,
        width: 50.0,
    },
    screenView: {
        width: _width,
        height: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnContainer: {
        width: '80%',
        height: 40.0,

    },
    nextButton: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTxt: {
        fontSize: ui.fontSize.massive,
        fontFamily: ui.fonts.light,
        color: 'grey'
    },
    notiContainer: {
        position: "absolute",
        height: 22,
        width: '100%',
        zIndex: 1,
        top: "auto",
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.massive,
        color: ui.colors.black,
        width: '80%'
    },
    subTitle: {
        fontFamily: ui.fonts.thin,
        fontSize: ui.fontSize.normal,
        textAlign: "left",
        color: ui.colors.black,
        width: '80%'
    },
    groupBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 22.0
    },
    titlePanel: {
        paddingLeft: 12.0,
        marginTop: 22.0,
        marginBottom: 22.0,
        width: '100%',
        alignItems: 'flex-start'
    }
});

const register_procedure = Object.freeze({
    checkExistEmail: "checkExistEmail",
    verifyEmail: "verifyEmail",
    assignInfomation: "assignInfomation",
});

const ComponentState = Object.freeze({
    idle: "idle",
    loading: "loading",
    success: "success",
    failed: "failed"
});

const mapDispatchToProps = dispatch => {
    return {
        tryRegisterCustomer: (info, callback) => dispatch(tryRegisterCustomer(info, callback))
    }
}

export default connect(null, mapDispatchToProps)(Register);