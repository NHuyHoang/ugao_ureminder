import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Button, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { Header, Input, FecthData } from '../../components';
import Login from './Login';
import ui from '../../share/ui.constant';

import { tryGetLocalCustomer, logout } from '../../store/actions'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.props.tryGetLocalCustomer()
    }

    componentWillMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.customer._id && <Header data={[
                        { name: 'done', onPress: () => alert('done'), color: 'black' },
                        { name: 'power-settings-new', onPress: this.props.logout, color: 'red' },
                    ]} />
                }
                {
                    this.props.customer._id ?
                        //FecthData(this.query, "authenticatedCustomer", this.props, LoadedContent) :
                        <LoadedContent {...this.props} data={this.props.customer} /> :
                        <Login />
                }
            </View>
        )
    }
}



const LoadedContent = (props) => {

    const { email, img, location, name, phone } = props.data;
    return (
        <ScrollView>
            <KeyboardAvoidingView behavior="position" >
                <View style={styles.mainInfoContent}>
                    <View style={styles.avatarContainer} >
                        <Image style={styles.avatar} source={{ uri: img }} />
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.nameTxt}>{name}</Text>
                        <Text style={styles.emailTxt}>{email}</Text>
                    </View>
                </View>
                <Input
                    value={name}
                    type={'text'}
                    label={"Họ & tên"} />
                <Input
                    config={{ keyboardType: 'email-address' }}
                    value={email}
                    type={'text'}
                    label={"Email"} />
                <Input
                    config={{ keyboardType: 'numeric' }}
                    value={phone}
                    type={'text'}
                    label={"Điện thoại"} />
                <Input
                    value={location.address}
                    type={'text'}
                    label={"Địa chỉ"}
                    iconBtn={{ name: "place" }}
                    btnEvent={() => props.navigation.navigate('Location')} />
                <View style={{ height: 50, width: "100%", backgroundColor: 'transparent' }}></View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
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
        customer: state.customer.info
    }
}

const mapDispatchToProps = dispatch => {
    return {
        tryGetLocalCustomer: () => dispatch(tryGetLocalCustomer()),
        logout: () => dispatch(logout())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);