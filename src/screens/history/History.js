import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Header, InvoiceItem, FecthData, Noti } from '../../components';

class History extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    componentWillMount(props) {
        this.setState({ data: this.props.info.invoices })
    }

    render() {
        return (
            <View style={styles.container}>
                <Header />
                {
                    this.state.data ?
                        <FlatList
                            onRefresh={() => { }}
                            refreshing={false}
                            data={this.state.data.reverse()}
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