import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import ui from '../../share/ui.constant';
import { SearchInput, NavbarTab } from '../../components';
import StoreProduct from './storeProduct/StoreProduct';
import StoreNoti from './storeNoti/StoreNoti';
import StoreContact from './storeContact/StoreContact';

class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelection: 1,
            pageMounted: false,
            checkCart: false
        };
        this.tab = <StoreProduct />;
    }

    onSelectTab(tab) {
        this.setState({ tabSelection: tab })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.navbarContainer}>
                    <View style={styles.navbarInput}>
                        <View style={styles.searchInput}>
                            <SearchInput />
                        </View>
                    </View>
                    <View style={styles.navbarTab}>
                        <NavbarTab iconSize={22} selectTab={this.onSelectTab.bind(this)} />
                    </View>
                </View>
                <StoreProduct show={this.state.tabSelection === 1} />
                <StoreNoti show={this.state.tabSelection === 2} />
                <StoreContact show={this.state.tabSelection === 3} />
                {this.state.checkCart ? <View style={styles.dimmer}></View> : null}
            </View>
        )
    }
}

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    navbarContainer: {
        height: 100,
        width: '100%',
        elevation: 3,
        backgroundColor: 'white'
    },
    navbarInput: {
        width: '100%',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        backgroundColor: 'transparent',
        height: 37,
        width: '90%'
    },
    navbarTab: {
        flex: 1,
    },
    dimmer:{
        position:'absolute',
        height:_height,
        width:_width,
        zIndex:2,
        backgroundColor:'black',
        elevation:4,
        opacity:0
    }

})
export default Store;