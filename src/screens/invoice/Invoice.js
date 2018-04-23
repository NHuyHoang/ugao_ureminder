import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Slider from '../../components/Slider/Slider'
import ui from '../../share/ui.constant'
import { Header, Input, UButton } from '../../components/index';
class Invoice extends React.Component {
    constructor(props) {
        super(props);
        this.tempPickerData = [{ key: 'Thanh toán trực tiếp' }, { key: 'VISA' }, { key: 'Internet banking' }];
    }

    render() {
        return (
            <View style={styles.container}>
                <Header />
                <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
                    <Slider style={styles.slider} productItem={true} />
                    <View style={styles.formContainer}>
                        {/* <Input type='picker' config={{ data: this.tempPickerData }} label={"Thanh toán"} /> */}
                         <Input
                            iconBtn={{ name: "place" }}
                            value = "Số 1 Võ Văn Ngân,Q.Thủ Đức"
                            type='text'
                            label="Nơi nhận"
                            btnEvent={() => this.props.navigation.navigate('Location')} />
                        <Input config={{ editable: false, value: '97.000 VND' }} type={'text'} label={"Tổng cộng"} /> 
                    </View>
                    <View style={styles.submitButton}>
                        <UButton txt="Thanh toán" iconName="done" />
                    </View>
                </KeyboardAvoidingView>
            </View>
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
        marginTop: 10
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
    }
})
export default Invoice;