import React from 'react';
import { View, StyleSheet } from 'react-native';
import ui from '../../../share/ui.constant';
import { connect } from 'react-redux';
import { FecthData } from '../../../components';
import StoreList from './StoreList';


export default class StoreProduct extends React.PureComponent {
    constructor(props) {
        super(props);
        this.query = `
        {
            products {
                _id
                name
                type
                img
                price
                weight
              }
        }
        `;
    }


    onAddToCartHander = () => {

    }

    showScreen = () => {
        return this.props.show ?
            { opacity: 1, zIndex: 1, } : { opacity: 0, zIndex: 0, }
    }

    render() {
        return (
            <View
                style={[styles.container, this.showScreen()]}>
                {
                    FecthData(this.query, "products", this.props, StoreList)
                    //<LoadedContent {...this.props} />
                }
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        top: 100,
        bottom: 0,
        backgroundColor: ui.colors.white,
        position: 'absolute',
    },
})