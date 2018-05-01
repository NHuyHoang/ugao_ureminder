import React from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableWithoutFeedback, SectionList } from 'react-native';
import ui from '../../../share/ui.constant';
import { connect } from 'react-redux';
import { Slider, ProductPanel, FecthData } from '../../../components';
import { trySaveProducts } from '../../../store/actions';

class StoreList extends React.Component {
    constructor(props) {
        super(props);
        this.props.trySaveProducts(this.props.data);
    }


    render() {
        let templateArr = [];
        if (this.props.products)
            templateArr = this.props.products;
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
                    { data: templateArr },
                ]}
                renderItem={(items) => {
                    console.log(items);
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
                onEndReachedThreshold={0.05}
                onEndReached={(info) => console.log(info)}
                onRefresh={() => { }}
                refreshing={false}
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