import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Header, InvoiceItem, FecthData, Noti } from '../../components';

class History extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header />
                {this.props.invoices ?

                    <FlatList
                        onRefresh={() => { }}
                        refreshing={false}
                        data={this.props.invoices.reverse()}
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
        invoices: state.customer.info.invoices
    }
}

export default connect(mapStateToProps)(History);