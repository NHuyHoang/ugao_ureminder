import React from 'react';
import {
    StyleSheet, Text,
    View,
    Image, KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { Header, Input, AltAvatar, Noti } from '../../components';
import Login from './Login';
import ui from '../../share/ui.constant';

import { logout, onTrySetShowNoti, tryUpdateCustomerInfo } from '../../store/actions'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateStatus: "READY",
        }
    }

    updateCustomerInfo = () => {
        let newInput = this.refs.loadedContent.getCustomerInput();
        const callback = (success) => {
            if (success) {
                this.setState({
                    updateStatus: "SUCCESS"
                })
            }
            else {
                this.setState({
                    updateStatus: "FAILED"
                })
            }
            setTimeout(() => {
                this.setState({ updateStatus: "READY" })
            }, 5000)
        };
        if (newInput) {
            this.setState({ updateStatus: "UPDATING" })
            this.props.tryUpdateCustomerInfo(newInput, callback);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.customer._id && <Header data={[
                        { name: 'done', onPress: this.updateCustomerInfo, color: 'black' },
                        { name: 'power-settings-new', onPress: this.props.logout, color: 'red' },
                    ]} />
                }
                {
                    this.props.customer._id ?
                        //FecthData(this.query, "authenticatedCustomer", this.props, LoadedContent) :
                        <LoadedContent
                            status={this.state.updateStatus}
                            ref="loadedContent" {...this.props}
                            data={this.props.customer} /> :
                        <Login notiTxt={this.props.navigation.state.params} {...this.props} />
                }
            </View>
        )
    }
}

class LoadedContent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            initValue: {},
            foo: true,
        }
    }

    getCustomerInput = () => {
        let newInputValue = {
            name: this.refs.nameInput.getValue(),
            email: this.refs.emailInput.getValue(),
            phone: this.refs.phoneInput.getValue(),
            address: this.refs.addressInput.getValue()
        };
        let changed = false;
        for (let key in this.state.initValue) {
            if (this.state.initValue[key] !== newInputValue[key]) {
                changed = true;
                break;
            }
        }
        if (changed) return newInputValue;
        return null;
    }

    componentDidMount() {
        this.setState({
            initValue: {
                name: this.refs.nameInput.getValue(),
                email: this.refs.emailInput.getValue(),
                phone: this.refs.phoneInput.getValue(),
                address: this.refs.addressInput.getValue()
            }
        })
    }

    componentWillReceiveProps(props) {
        if (props.status === "SUCCESS") {
            this.setState({
                initValue: {
                    name: this.refs.nameInput.getValue(),
                    email: this.refs.emailInput.getValue(),
                    phone: this.refs.phoneInput.getValue(),
                    address: this.refs.addressInput.getValue()
                }
            })
        }
    }

    truncate = (string) => {
        if (string.length > 50)
            return string.substring(0, 30) + '...';
        else
            return string;
    };


    render() {
        return (
            <ScrollView>
                <KeyboardAvoidingView behavior="position" >
                    <View style={styles.mainInfoContent}>
                        {
                            <View style={styles.avatarContainer} >
                                {
                                    this.props.data.img !== null
                                        ?
                                        <Image style={styles.avatar} source={{ uri: this.props.data.img }} />
                                        :
                                        <AltAvatar char={this.props.data.name} />
                                }
                            </View>
                        }
                        <View style={styles.infoContainer}>
                            <Text style={styles.nameTxt}>{this.props.data.name}</Text>
                            <Text style={styles.emailTxt}>{this.props.data.email}</Text>
                        </View>
                    </View>
                    {
                        this.props.status === "SUCCESS" &&
                        <Noti success message="Cập nhật thành công" />
                    }
                    {
                        this.props.status === "FAILED" &&
                        <Noti message="Đã xảy ra lỗi" />
                    }
                    {
                        this.props.status === "UPDATING" &&
                        <ActivityIndicator size="small" color="black" />
                    }
                    <Input
                        id="name-input"
                        ref="nameInput"
                        value={this.props.data.name}
                        type={'text'}
                        label={"Họ & tên"} />
                    <Input
                        id="email_input_01"
                        ref="emailInput"
                        config={{ keyboardType: "email-address", editable: false }}
                        type='text'
                        label="Email"
                        value={this.props.data.email}
                        controlType="email"
                    />
                    <Input
                        ref="phoneInput"
                        config={{ keyboardType: 'numeric' }}
                        value={this.props.data.phone}
                        type={'text'}
                        label={"Điện thoại"} />
                    <Input
                        ref="addressInput"
                        value={this.truncate(this.props.data.location.address)}
                        type={'text'}
                        label={"Địa chỉ"}
                        config={{ editable: false }}
                        iconBtn={{ name: "place" }}
                        btnEvent={() => this.props.navigation.navigate('Location', {
                            customerLocation: this.props.customer.location,
                        })} />
                    <Input
                        type='checkbox'
                        checked={this.props.showNoti}
                        onToogle={this.props.onTrySetShowNoti}
                        title="Nhận thông báo đặt hàng" />
                    <View style={{ height: 50, width: "100%", backgroundColor: 'transparent' }}></View>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}




const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    avatarContainer: {
        height: "100%",
        width: "40%",
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainInfoContainer: {
        flex: 1,
    },
    mainInfoContent: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 5,
        borderBottomWidth: 0.2,
        borderBottomColor: ui.colors.light_gray
    },
    infoContainer: {
        width: '60%',
        height: '100%',
        justifyContent: 'center',
        paddingLeft: 5
    },
    avatar: {
        height: 110,
        width: 110,
        borderRadius: 9999,
        resizeMode: 'contain',
    },
    nameTxt: {
        fontFamily: ui.fonts.decor,
        fontSize: 40,
        color: ui.colors.black,
    },
    emailTxt: {
        fontFamily: ui.fonts.thin_italic,
        fontSize: ui.fontSize.semiTiny,
        color: ui.colors.black,
        textDecorationLine: 'underline'
    },
    specificInfoContainer: {
        paddingTop: 15,
    },
})

const mapStateToProps = state => {
    return {
        customer: state.customer.info,
        showNoti: state.customer.showNoti
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
        onTrySetShowNoti: (show) => dispatch(onTrySetShowNoti(show)),
        tryUpdateCustomerInfo: (info, callback) => dispatch(tryUpdateCustomerInfo(info, callback))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);