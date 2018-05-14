import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Header, InvoiceItem, FecthData, Noti } from '../../components';

class History extends React.PureComponent {
    constructor(props) {
        super(props);

    }


    render() {
        let data = [...this.props.info.invoices];
        return (
            <View style={styles.container}>
                <Header />
                {
                    this.props.info.invoices.length != 0 ?
                        <FlatList
                            onRefresh={() => { }}
                            refreshing={false}
                            data={data.reverse()}
                            keyExtractor={(item, index) => item._id}
                            renderItem={({ item }) => <InvoiceItem data={item} />}
                        /> :
                        <Noti message="Vui lòng đăng nhập" />
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
})

const mapStateToProps = state => {
    return {
        info: state.customer.info
    }
}

export default connect(mapStateToProps)(History);