import React from 'react';
import { Text, Button, View, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableWithoutFeedback, SectionList } from 'react-native';
import ui from '../../../share/ui.constant';
import { connect } from 'react-redux';
import { Slider, ProductPanel, FecthData } from '../../../components';
import { trySaveProducts } from '../../../store/actions';

class StoreList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.props.trySaveProducts(this.props.data);
        this.state = {
            displayedProducts: [],
            dataFetched: false,
            loading: true
        }
        this.onEndReachedCalledDuringMomentum = false;
    }

    componentWillReceiveProps(props) {
        if (props.products && !this.state.dataFetched)
            this.setState({ dataFetched: true, displayedProducts: props.products.slice(0, 10) })
    }


    render() {

        return (
            <SectionList
                ListHeaderComponent={() => (
                    <View>
                        <View>
                            <Text style={styles.title}>Nhà cung cấp</Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <Slider />
                        </View>
                    </View>
                )}
                sections={[
                    { data: this.state.displayedProducts },
                ]}
                renderItem={(items) => {

                    return (
                        <View style={styles.productContainer}>
                            {
                                items.item.map(product => (
                                    <ProductPanel key={product._id} product={product} />
                                ))
                            }
                        </View>
                    )
                }}
                keyExtractor={(item, index) => index}
                //if threshold === 0 the 2nd time endReached will not trigger
                //if threshold >0 the onEndReached will trigger twice
                onEndReachedThreshold={0.01}
                ListFooterComponent={() => {
                    return this.state.loading
                        ? <ActivityIndicator size="small" color="black" />
                        : null
                }}
                onEndReached={() => {
                    if (this.state.displayedProducts.length < this.props.products.length) {

                        this.setState({
                            displayedProducts: this.props.products.slice(0, this.state.displayedProducts.length + 10)
                        })
                    }
                    else {
                        this.setState({ loading: false })
                    }
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    title: {
        marginTop: 10,
        marginLeft: 10,
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.small,
        color: ui.colors.black
    },
    productContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 230,
        width: '100%'
    },
    actIndiContainer: {
        width: '100%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = state => {
    return {
        products: state.products
    }
}


const mapDispatchToProps = dispatch => {
    return {
        trySaveProducts: (products) => dispatch(trySaveProducts(products))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreList);