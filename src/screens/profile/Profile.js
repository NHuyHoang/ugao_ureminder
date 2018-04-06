import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Header, Input } from '../../components';
import ui from '../../share/ui.constant';

class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.headerBtn}>
                            <Icon name="done" size={20} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerBtn}>
                            <Icon name="power-settings-new" size={20} color={ui.colors.red} />
                        </TouchableOpacity>
                    </View>
                </Header>
                <ScrollView>
                    <KeyboardAvoidingView behavior="position" >
                        <View style={styles.mainInfoContent}>
                            <View style={styles.avatarContainer} >
                                <Image style={styles.avatar} source={require('../../share/images/avatar_edited.png')} />
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.nameTxt}>LiLy CoLlins</Text>
                                <Text style={styles.emailTxt}>lilycollins@yahoo.com.vn</Text>
                            </View>
                        </View>
                        <Input
                            config={{ defaultValue: "Lily Collins" }}
                            type={'text'}
                            label={"Họ & tên"} />
                        <Input
                            config={{keyboardType:'email-address', defaultValue: "lilycollins@yahoo.com.vn" }}
                            type={'text'}
                            label={"Email"} /> 
                        <Input
                            config={{keyboardType:'numeric', defaultValue: "0123456789" }}
                            type={'text'}
                            label={"Điện thoại"} />
                        <Input
                            config={{ defaultValue: "Số 1 Võ Văn Ngân, TP.HCM" }}
                            type={'text'}
                            label={"Địa chỉ"}
                            iconBtn={{ name: "place" }} />
                        <View style={{ height: 50, width: "100%", backgroundColor:'transparent' }}></View>
                    </KeyboardAvoidingView>
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex:1
    },
    btnContainer: {
        flexDirection: 'row'
    },
    headerBtn: {
        marginRight: 18
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
        fontFamily: ui.fonts.light_italic,
        fontSize: ui.fontSize.small,
        color: ui.colors.black,
        textDecorationLine: 'underline'
    },
    specificInfoContainer: {
        paddingTop: 15,
    },
})
export default Profile;