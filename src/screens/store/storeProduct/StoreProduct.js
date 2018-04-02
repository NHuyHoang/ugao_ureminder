import React from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, ActivityIndicator, SectionList } from 'react-native';
import ui from '../../../share/ui.constant';
import { ProducerSlider, ProductPanel } from '../../../components'

export default class StoreProduct extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            templateArr: [1, 2, 3, 4, 5,1, 2],
            isLoading: false,
        }
        this.templateArr = [1, 2, 3, 4, 5,1, 2, 3, 4, 5,1, 2, 3, 4, 5];
    }

    componentWillUnmount() {
        console.log('unmounted')
    }

    render() {
        return (
            <SectionList
                ListHeaderComponent={() => (
                    <View>
                        <Text style={styles.title} >Nhà cung cấp</Text>
                        <View style={styles.sliderContainer}>
                            <ProducerSlider />
                        </View>
                    </View>
                )}
                style={[styles.container, { opacity: this.props.show ? 1 : 0 }]}
                renderItem={() => (
                    <View style={styles.productContainer}>
                        <ProductPanel />
                        <ProductPanel/>
                    </View>
                )}
                sections={[
                    { data: this.state.templateArr },
                ]}
                keyExtractor={() => Math.random()}
                onEndReachedThreshold = {0.05}
                onEndReached={(info) => console.log(info)}
                onRefresh={() => {}}
                refreshing={false}
            />
        );
    }
}


const _height = Dimensions.get('window').height
const styles = StyleSheet.create({
    container: {
        width: '100%',
        top: 100,
        bottom: 0,
        backgroundColor: ui.colors.white,
      
        position: 'absolute',
        zIndex: 1
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