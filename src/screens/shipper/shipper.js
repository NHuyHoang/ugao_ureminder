import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { Header, Input, FecthData } from '../../components';
import ui from '../../share/ui.constant';

export default class shipper extends React.Component {
    constructor(props) {
        super(props);
        this.query = `
        {
            invoice(id: "${this.props.navigation.state.params.invoiceId}") {
              shipper {
                name
                _id
                phone
              }
              store{
                _id
                name
              }
            }
          }
        `;
        this.fectData = FecthData(this.query, "invoice", this.props, LoadedContent);
    }

    render() {
        return (
            <React.Fragment>
                <Header data={[{
                    name: 'clear', onPress: () => this.props.navigation.goBack(), color: 'red'
                }]} />
                {this.fectData}
            </React.Fragment>
        )
    }
}

const LoadedContent = (props) => {
    console.log(props.data);
    return (
        <ScrollView>

            <View style={styles.avatarContainer}>
                <Image style={styles.avatar} source={{ uri: "https://s3.amazonaws.com/uifaces/faces/twitter/jonathansimmons/128.jpg" }} />
            </View>
            <Text style={styles.decorateTxt}>
                Xin chào, tôi là
                </Text>
            <Text style={styles.decorateTxt2}>
                Clark Kertzmann
                </Text>
            <Text style={styles.decorateTxt3}>
                Hàng của bạn sẽ được giao trong <Text style={{ fontFamily: ui.fonts.bold }}>15 phút</Text>
            </Text>
            <View style={{ height: 8 }} />
            <Input
                id="name-input"
                value={"01677618893"}
                type={'text'}
                label={"Số điện thoại"} />
            <Input
                id="email_input_01"
                config={{ keyboardType: "email-address" }}
                type='text'
                label="Biển số xe"
                value={"59X1-20531"} />
            <Input
                id="email_input_01"
                config={{ keyboardType: "email-address" }}
                type='text'
                label="Cửa hàng"
                value={"Ugao store 1"} />
            <Input
                id="email_input_01"
                config={{ keyboardType: "email-address" }}
                type='text'
                label="Cửa hàng"
                value={"Ugao store 1"} />
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    avatarContainer: {
        height: 180,
        width: '100%',
        justifyContent: "center",
        alignItems: "center"
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
        fontFamily: ui.fonts.light,
        color: 'black',
        paddingLeft: 8,
        paddingRight: 8
    }
})