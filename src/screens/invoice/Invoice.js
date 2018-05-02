import React from 'react';
import { StyleSheet, Text, ScrollView, View, Image, KeyboardAvoidingView, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ui from '../../share/ui.constant'
import { Header, Input, UButton, Slider } from '../../components';
class Invoice extends React.Component {
    constructor(props) {
        super(props);
        this.tempPickerData = [{ key: 'Thanh toán trực tiếp' }, { key: 'VISA' }, { key: 'Internet banking' }];
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Header />
                <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}> Hóa đơn mua hàng</Text>
                    </View>
                    {/*  <HorizonSlider  products={this.props.cart}/> */}
                    <Slider style={styles.slider} productItem products={this.props.cart} />
                    <View style={styles.formContainer}>
                        {/* <Input type='picker' config={{ data: this.tempPickerData }} label={"Thanh toán"} /> */}
                        <Input
                            iconBtn={{ name: "place" }}
                            value="Số 1 Võ Văn Ngân,Q.Thủ Đức"
                            type='text'
                            label="Nơi nhận"
                            btnEvent={() => this.props.navigation.navigate('Location')} />
                        <Input config={{ editable: false, value: '97.000 VND' }} type={'text'} label={"Tổng cộng"} />
                    </View>
                    <View style={styles.submitButton}>
                        <UButton txt="Thanh toán" iconName="done" />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

const _width = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: 'white',
    },
    slider: {
        marginTop: 6
    },
    formContainer: {
        width: _width,
        marginTop: 20,
        justifyContent: 'flex-start'
    },
    submitButton: {
        width: _width,
        alignItems: 'center',
        marginTop: 50
    },
    titleContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 6
    },
    title: {
        fontFamily: ui.fonts.decor,
        fontSize: 42,
        color: 'black'
    }

})

const mapStateToProp = state => {
    return {
        cart: state.cart
    }
}

export default connect(mapStateToProp)(Invoice);