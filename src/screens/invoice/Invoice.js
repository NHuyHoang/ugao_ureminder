import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Invoice extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={styles.container}>
                <Text>
                    Invoice
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white'
    }
})
export default Invoice;