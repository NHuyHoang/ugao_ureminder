import React from 'react';
import { Text, View, StyleSheet, TouchableNativeFeedback, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ui from '../../../share/ui.constant'

export default class StoreContact extends React.Component {
    showScreen = () => {
        return this.props.show ?
            { opacity: 1, zIndex: 1, } : { opacity: 0, zIndex: 0, }
    }
    render() {
        return (

            <View style={[styles.container, this.showScreen()]}>
                <FlatList
                    data={templateData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <ContactItem data={item} />}
                    refreshing={false}
                    onRefresh={() => { }}
                />
            </View>

        );

    }
}

const templateData = [
    {
        _id: Math.random(),
        name: "Cửa hàng GaoSach58.vn",
        address: "Số 58 đường 24A, Khu phố 5, Phường An Phú, Quận 2, TP.HCM",
        phone: "0902 36 48 58",
        email: "cskh@gaosach58.vn"
    },
    {
        _id: Math.random(),
        name: "Cửa hàng GaoSach58.vn",
        address: "Số 58 đường 24A, Khu phố 5, Phường An Phú, Quận 2, TP.HCM",
        phone: "0902 36 48 58",
        email: "cskh@gaosach58.vn"
    },
    {
        _id: Math.random(),
        name: "Cửa hàng GaoSach58.vn",
        address: "Số 58 đường 24A, Khu phố 5, Phường An Phú, Quận 2, TP.HCM",
        phone: "0902 36 48 58",
        email: "cskh@gaosach58.vn"
    },
    {
        _id: Math.random(),
        name: "Cửa hàng GaoSach58.vn",
        address: "Số 58 đường 24A, Khu phố 5, Phường An Phú, Quận 2, TP.HCM",
        phone: "0902 36 48 58",
        email: "cskh@gaosach58.vn"
    },
    {
        _id: Math.random(),
        name: "Cửa hàng GaoSach58.vn",
        address: "Số 58 đường 24A, Khu phố 5, Phường An Phú, Quận 2, TP.HCM",
        phone: "0902 36 48 58",
        email: "cskh@gaosach58.vn"
    },
    {
        _id: Math.random(),
        name: "Cửa hàng GaoSach58.vn",
        address: "Số 58 đường 24A, Khu phố 5, Phường An Phú, Quận 2, TP.HCM",
        phone: "0902 36 48 58",
        email: "cskh@gaosach58.vn"
    },
    {
        _id: Math.random(),
        name: "Cửa hàng GaoSach58.vn",
        address: "Số 58 đường 24A, Khu phố 5, Phường An Phú, Quận 2, TP.HCM",
        phone: "0902 36 48 58",
        email: "cskh@gaosach58.vn"
    },
    {
        _id: Math.random(),
        name: "Cửa hàng GaoSach58.vn",
        address: "Số 58 đường 24A, Khu phố 5, Phường An Phú, Quận 2, TP.HCM",
        phone: "0902 36 48 58",
        email: "cskh@gaosach58.vn"
    },
    {
        _id: Math.random(),
        name: "Cửa hàng GaoSach58.vn",
        address: "Số 58 đường 24A, Khu phố 5, Phường An Phú, Quận 2, TP.HCM",
        phone: "0902 36 48 58",
        email: "cskh@gaosach58.vn"
    },
]

const ContactItem = (props) => {
    let { name, address, phone, email } = props.data
    return (
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple()}>
            <View style={styles.contactPanel}>
                <Text style={styles.titleTxt}>{name}</Text>
                <View style={styles.contactItem}>
                    <Icon name="place" size={12} color="black" />
                    <Text style={styles.contactTxt}>{address}</Text>
                </View>
                <View style={styles.contactItem}>
                    <Icon name="call" size={12} color="black" />
                    <Text style={styles.contactTxt}>{phone}</Text>
                </View>
                <View style={styles.contactItem}>
                    <Icon name="markunread" size={12} color="black" />
                    <Text style={styles.contactTxt}>{email}</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        top: 100,
        bottom: 0,
        position: 'absolute',
    },
    contactPanel: {
        width: "100%",
        height: 120,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomWidth: 0.3,
        borderBottomColor: ui.colors.light_gray
    },
    contactItem: {
        width: '100%',
        flexDirection: 'row'
    },
    titleTxt: {
        color: 'black',
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.semiTiny,
    },
    contactTxt: {
        color: 'black',
        marginLeft: 8,
        fontFamily: ui.fonts.default,
        fontSize: ui.fontSize.tiny,
    }
})

