import React from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import ui from '../../../share/ui.constant';
import { ProducerSlider, ProductPanel } from '../../../components'

export default class StoreProduct extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            templateArr: [1, 2, 3, 4],
            isLoading: false,
        }
        this.templateArr = [1, 2, 3, 4];
    }

    componentWillUnmount(){
        console.log('unmounted')
    }

    render() {
        return (
            <ScrollView
                onScroll={(e) => {
                    let windowHeight = Dimensions.get('window').height - 150,
                        height = e.nativeEvent.contentSize.height,
                        offset = e.nativeEvent.contentOffset.y;
                    if (windowHeight + offset >= height) {
                        if (this.state.isLoading === true) return;
                        this.setState({isLoading:true})
                        setTimeout(() => {
                            this.setState(prevState => {
                                let arr = [...prevState.templateArr];
                                arr.push(5);
                                return { templateArr: arr, isLoading: false }
                            })
                        }, 5000)
                    }
                }}
                style={[styles.container,{ opacity:this.props.show ? 1 : 0 }]}>
                <Text style={styles.title} >Nhà cung cấp</Text>
                <View style={styles.sliderContainer}>
                    <ProducerSlider />
                </View>
                <Text style={styles.title}>Sản phẩm</Text>
                {this.state.templateArr.map((item, i) => {
                    return (
                        <View key={i} style={styles.productContainer}>
                            <ProductPanel />
                            <ProductPanel />
                        </View>
                    );
                })}
                <View style={styles.actIndiContainer}>
                    <ActivityIndicator size="small" color={ui.colors.highlight} />
                </View>
            </ScrollView>
        );

    }
}


const _height = Dimensions.get('window').height
const styles = StyleSheet.create({
    container: {
        width: '100%',
        top:100,
        bottom:0,
        backgroundColor: ui.colors.white,
        alignSelf: 'flex-start',
        position:'absolute',
        zIndex:1
    },
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