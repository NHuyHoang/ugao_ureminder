import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions, Animated } from 'react-native';
import ui from '../../share/ui.constant';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class NavbarTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onFocus: 1,
            //indicatorAnim: new Animated.Value(0)
        }
        this.indicatorAnim = new Animated.Value(0);
        this.tabWidth = Dimensions.get('window').width / 3;
    }

    onSelectTab(tab) {
        this.setState({onFocus:tab});
        Animated.timing(this.indicatorAnim,{
            toValue: ( tab - 1) * this.tabWidth,
            duration:100,
            useNativeDriver:true
        }).start(() => this.props.selectTab(tab))
    }


    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={this.onSelectTab.bind(this,1)} >
                    <View style={styles.tabItem}>
                        <Icon
                            size={this.props.iconSize}
                            name="shopping-cart"
                            color={this.state.onFocus === 1 ? ui.colors.black : ui.colors.light_gray} />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={this.onSelectTab.bind(this,2)}>
                    <View style={styles.tabItem}>
                        <Icon
                            size={this.props.iconSize}
                            name="notifications"
                            color={this.state.onFocus === 2 ? ui.colors.black : ui.colors.light_gray} />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={this.onSelectTab.bind(this,3)}>
                    <View style={styles.tabItem}>
                        <Icon
                            size={this.props.iconSize}
                            name="call"
                            color={this.state.onFocus === 3 ? ui.colors.black : ui.colors.light_gray} />
                    </View>
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.indicator,{
                    transform:[{
                        translateX:this.indicatorAnim
                    }]
                }]}></Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    tabItem: {
        height: '100%',
        width: (100 / 3).toString() + "%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicator:{
        height:2,
        borderRadius:1,
        backgroundColor:ui.colors.black,
        position:'absolute',
        width: (100 / 3).toString() + "%",
        bottom:0
    }
})