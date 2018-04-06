import React from 'react';
import { StyleSheet, View, Text, TextInput, Picker } from 'react-native';
import ui from '../../share/ui.constant'

export default class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentMetod: 'Thanh toán trực tiếp',
            focus:false
        }
    }

    render() {
        let inputType = null;
        switch (this.props.type) {
            case ('picker'): {
                inputType = (
                    <Picker
                        style={styles.pickerStyle}
                        itemStyle={{ fontSize: 18, color: 'white' }}
                        selectedValue={this.state.paymentMetod}
                        onValueChange={(itemValue, itemIndex) => this.setState({ paymentMetod: itemValue })}>
                        <Picker.Item label="COD" value="COD" />
                        <Picker.Item label="VISA" value="VISA" />
                    </Picker>
                )
            }; break;
            case ('text'): {
                inputType = (
                    <TextInput
                        onFocus={() => this.setState({focus:true})}
                        onBlur={() => this.setState({focus:false}) }
                        defaultValue="Số 1 Võ Văn Ngân, Q.Thủ Đức, TP.HCM"
                        style={styles.txtInput}
                        underlineColorAndroid="transparent"
                    />
                )
            }; break;
            default: inputType = null; break;
        }
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{this.props.label}</Text>
                <View style={styles.inputContainer}>
                    <View style={[styles.inputControl,{borderBottomColor:this.state.focus ? ui.colors.highlight : 'black'}]}>
                        {inputType}
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 8
    },
    label: {
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.massive,
        color: 'black'
    },
    inputContainer: {
        width: '100%',
        height:50,
    },
    inputControl: {
        borderBottomWidth: 1
    },
    txtInput: {
        width: "100%",
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.normal,
        margin: 0
    }

})