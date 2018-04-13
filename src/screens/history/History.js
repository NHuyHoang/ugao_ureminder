import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Header, InvoiceItem } from '../../components'

class History extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header />
                <FlatList
                    onRefresh={() => { }}
                    refreshing={false}
                    data={templateData.reverse()}
                    keyExtractor={(item, index)  => item._id }
                    renderItem={({ item }) => <InvoiceItem data={item} />}
                />
            </View>
        )
    }
}

const templateData = [
    {
        _id:Math.random(),
        recieved_date: "12-03-18",
        delivered_date: "12-03-18",
        price: "93.000 VND",
        paid: true,
        product: []
    },
    {
        _id:Math.random(),
        recieved_date: "01-03-18",
        delivered_date: "02-03-18",
        price: "89.000 VND",
        paid: false,
        product: [],
    },
    {
        _id:Math.random(),
        recieved_date: "12-03-18",
        delivered_date: "12-03-18",
        price: "93.000 VND",
        paid: true,
        product: []
    },
    {
        _id:Math.random(),
        recieved_date: "12-03-18",
        delivered_date: "12-03-18",
        price: "93.000 VND",
        paid: false,
        product: []
    },
    {
        _id:Math.random(),
        recieved_date: "12-03-18",
        delivered_date: "12-03-18",
        price: "93.000 VND",
        paid: false,
        product: []
    },

]

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})
export default History;