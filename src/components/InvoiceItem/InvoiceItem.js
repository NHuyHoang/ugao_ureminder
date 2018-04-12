import React from 'react';
import { StyleSheet, View, Text, Animted, TouchableWithoutFeedback, Animated, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Slider from '../Slider/Slider';
import ui from '../../share/ui.constant';

export default class InvoiceItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSlider: false,
        }
        this.sliderAnim = new Animated.Value(0);
    }

    onShowSliderHandler = () => {
        if (!this.state.showSlider) {
            Animated.timing(this.sliderAnim, {
                toValue: 120,
                duration: 200,
            }).start(() => {
                setTimeout(() => {
                    this.setState(prevState => ({ showSlider: !prevState.showSlider }))
                }, 0)
            });
        }
        else {
            Animated.timing(this.sliderAnim, {
                toValue: 0,
                duration: 200,
            }).start(() => {
                setTimeout(() => {
                    this.setState(prevState => ({ showSlider: !prevState.showSlider }))
                }, 0)
            });
        }

    }


    render() {
        let { recieved_date, delivered_date, price, paid } = this.props.data;
        let paidIcon = (<Icon name="close" size={20} color="black" />);
        if (paid)
            paidIcon = (<Icon name="done" size={20} color={ui.colors.highlight} />)
        return (
            <View style={styles.container}>
                <View style={styles.infoPanel} >
                    <TouchableOpacity style={{ marginLeft: 22, height: 40, width: 40 }}>
                        <Icon name="call" size={30} color="black" />
                    </TouchableOpacity>
                    <View style={styles.mainInfo}>
                        <View style={styles.txtContainer}>
                            <Icon name="call-made" size={20} color="black" />
                            <Text style={styles.dateTxt}>{recieved_date}</Text>
                        </View>
                        <View style={styles.txtContainer}>
                            <Icon name="call-received" size={20} color="black" />
                            <Text style={styles.dateTxt}>{delivered_date}</Text>
                        </View>
                        <View style={styles.txtContainer}>
                            {paidIcon}
                            <Text style={[styles.costTxt, { color: paid ? ui.colors.highlight : ui.colors.black }]}>{price}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.onShowSliderHandler} style={styles.slideHoriz}>
                        <Icon name="more-horiz" size={30} color={ui.colors.light_gray} />
                    </TouchableOpacity>
                </View>
                <Animated.View style={{ height: this.sliderAnim }}></Animated.View>
                <View style={styles.slideContainer} >
                    <Slider style={styles.slider} productItem={true} />
                </View>
            </View>
        )
    }
}

const _width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    slideContainer: {
        width: '100%',
    },
    infoPanel: {
        height: 120,
        width: "100%",
        position: "absolute",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
        elevation: 3,
        backgroundColor: 'white',
        borderBottomWidth: 0.2,
        borderTopWidth: 0.2,
        borderBottomColor: ui.colors.light_gray,
        borderTopColor: ui.colors.light_gray
    },
    mainInfo: {
        height: "100%",
        width: "50%",
        paddingRight: 12,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    txtContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    dateTxt: {
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.small,
        color: 'black'
    },
    costTxt: {
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.normal,
    },
    slideHoriz: {
        position: "absolute",
        left: _width / 2 - 15,
        bottom: 10
    }
})