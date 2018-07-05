import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Header, InvoiceItem, FecthData, Noti, FlatButton } from '../../components';
import ui from '../../share/ui.constant';
class History extends React.Component {
    constructor(props) {
        super(props);
        this.invoicesLength = this.props.info.invoices.length;
        this.state = {
            loading: false,
            data: [...this.props.info.invoices].splice(0, 10)
        }
    }

    componentWillReceiveProps(props) {
        //update the list if new invoice added
        if (this.invoicesLength < props.info.invoices.length) {
            console.log([...props.info.invoices].splice(0, 10));
            this.invoicesLength = props.info.invoices.length;
            this.setState({
                data: [...props.info.invoices].splice(0, 10)
            })
        }
    }

    onAddListProduct = () => {
        setTimeout(
            () => {
                if (this.invoicesLength > this.state.data.length) {
                    this.setState({
                        data: [... this.props.info.invoices].splice(0, this.state.data.length + 10),
                        loading: false
                    })
                }
                else this.setState({ loading: false });
            }, 1000
        )
    }

    _onLoadMorePressed = () => {
        this.setState({ loading: true });
        this.onAddListProduct();
    }

    render() {
        let footerComponent = <FlatButton title="Tải thêm" onPress={this._onLoadMorePressed} />;
        if (this.state.loading) footerComponent = <ActivityIndicator size="small" color={ui.colors.highlight} />;
        if (this.invoicesLength <= this.state.data.length) footerComponent = null;
        //display 10 latest invoices
        //let data = [...this.props.info.invoices.splice(invoicesLength - 11, invoicesLength - 1)];
        return (
            <View style={styles.container}>
                <Header />
                {
                    this.state.data.length != 0 ?
                        <FlatList
                            ListFooterComponent={footerComponent}
                            data={this.state.data}
                            keyExtractor={(item, index) => item._id}
                            renderItem={({ item }) => <InvoiceItem navigation={{ ...this.props.navigation }} data={item} />}
                        /*  onEndReachedThreshold={0.1}
                         onEndReached={() => {
                             if (!this.state.loading) {
                                 this.setState({ loading: true }, this.onAddListProduct);
                             }
                         }} */
                        /> :
                        <Noti message="Không tồn tại lịch sử giao dịch" />
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