import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, Animated, PanResponder, Button } from 'react-native';
import ui from '../../share/ui.constant';
import { SearchInput, NavbarTab, CartButton, ProductItem, PayButton } from '../../components';
import StoreProduct from './storeProduct/StoreProduct';
import StoreNoti from './storeNoti/StoreNoti';
import StoreContact from './storeContact/StoreContact';
import Icon from 'react-native-vector-icons/MaterialIcons'

class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelection: 1,
            pageMounted: false,
            checkCart: false,
            dimmerAnim: new Animated.Value(0),
            onProductRemove:false,
            productArr: ["http://gaosach58.vn/wp-content/uploads/2017/08/BotNem_NguBang.jpg","http://gaosach58.vn/wp-content/uploads/2018/02/Gao-dan-toc-gao-ong-tung-gao-sach-58-gao-cha-doi-gao-xay-doi-gao-nguyen-cam.jpg","http://gaosach58.vn/wp-content/uploads/2017/07/tn-300x300.jpg"]
        };
    
        this.onCheckCart = this.onCheckCartHandler.bind(this);
    }

    onSelectTab(tab) {
        console.log('triger');
        this.setState({ tabSelection: tab })
    }


    onCheckCartHandler() {
        this.setState(prev => ({ checkCart: !prev.checkCart }))
    }
    //temp
    onRemoveProductFromCart(content){
        this.setState({
            productArr: this.state.productArr.filter((item,i) => content != item)
        })
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
                {this.state.checkCart ? <View style={styles.dimmer}><Icon size={80} name="highlight-off" color="white" /></View> : null}
                <CartButton checkCart={this.onCheckCart} quantity={this.state.productArr.length}/>
                {this.state.productArr.map((item,i) => {
                    return (
                        <ProductItem 
                            removeProduct={this.onRemoveProductFromCart.bind(this,item)} 
                            key={item} source={item} 
                            translateY={-70 - (i*70)} 
                            show={this.state.checkCart}/>)
                })}
                <PayButton show={this.state.checkCart}/>
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
        backgroundColor: 'white'
    },
    navbarInput: {
        width: '100%',
        height: 64,
        alignItems: 'center',
        justifyContent:'center',
    },
    searchInput: {
        backgroundColor: 'transparent',
        height: 37,
        width: '90%'
    },
    navbarTab: {
        flex: 1,
    },
    dimmer: {
        position: 'absolute',
        height: _height,
        width: _width,
        zIndex: 2,
        backgroundColor: 'black',
        opacity: 0.6,
        alignItems:'center',
        justifyContent:'center',
    }

})
export default Store;