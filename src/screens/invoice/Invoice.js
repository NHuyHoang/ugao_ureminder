import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Slider from '../../components/Slider/Slider'
import ui from '../../share/ui.constant'
import { Header, Input } from '../../components/index';
class Invoice extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header />
                <Slider style={styles.slider} productItem={true} />
                <View style={styles.formContainer}>
                    <Input type={'picker'} label={"Phương thức:"}/>
                    <Input type={'text'} label={"Nơi nhận:"}/>
                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    slider: {
        marginTop: 10
    },
    formContainer: {
        width: '100%',
        height: 100,
        marginTop: 20,
        justifyContent:'center'
    }
})
export default Invoice;