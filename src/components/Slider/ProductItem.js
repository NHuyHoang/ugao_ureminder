import React from 'react';
import { StyleSheet, View, Text, Animated, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import ui from '../../share/ui.constant';
export default class ProductItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            counter: 1,
        }
        this.slideAnim = new Animated.Value(100);
        //this.onShowInfo = this.onShowInfoHandler.bind(this);

    }

    onShowInfoHandler = () => {
        // Print component dimensions to console

        this.setState(prevState => {
            this.scaleInfoPanel(!prevState.showInfo);
            return { showInfo: !prevState.showInfo }
        })
    }

    scaleInfoPanel(show) {
        const arrange = () => {
            if (show)
                this.myComponent.measure((fx, fy, width, height, px, py) => {
                    this.props.arrange(px);
                })
        }
        if (show) {
            Animated.timing(this.slideAnim, {
                toValue: 230,
                duration: 300,
            }).start(arrange)
        }
        else {
            Animated.timing(this.slideAnim, {
                toValue: 100,
                duration: 300,
            }).start(arrange)
        }
    }

    productQuantityHandler(operation) {
        switch (operation) {
            case ("+"): this.setState(prevState => {
                return { counter: prevState.counter + 1 }
            }); break;
            case ("-"): {
                if (this.state.counter <= 1) return;
                this.setState(prevState => {
                    return { counter: prevState.counter - 1 }
                });
            } break;
        }
    }


    render() {
        let infoSlideTransform = { width: this.slideAnim };
        let { _id, img, name, price, weight } = this.props.product;
        let anotation = 'kg';
        if (weight < 1) {
            weight *= 1000;
            anotation = 'g'
        };
        return (
            <View>
                {
                    this.state.counter > 1 &&
                    <View style={styles.counterContainer}>
                        <Text style={styles.counterTxt}>{this.state.counter}</Text>
                    </View>
                }
                <View ref={view => { this.myComponent = view; }} style={styles.container}>
                    <TouchableWithoutFeedback onPress={this.onShowInfoHandler}>
                        <View style={styles.productImgContainer}>
                            <Image style={styles.productImg} source={{ uri: this.props.product.img }} />
                            <View style={styles.productPrice}><Text style={styles.priceTxt}>{price}.000 VND</Text></View>
                        </View>
                    </TouchableWithoutFeedback>
                    <Animated.View style={[styles.productInfo, infoSlideTransform]}>
                        <View style={styles.productInfoContainer}>
                            <View style={styles.productNameContainer}><Text style={styles.productName}>{name}</Text></View>
                            <Text style={styles.weight}>{weight}{anotation}</Text>
                        </View>
                        <View style={styles.addjustmentBtnContainer}>
                            <TouchableOpacity onPress={this.productQuantityHandler.bind(this, "+")} style={styles.btnContainer}>
                                <Icon name="add" size={15} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.productQuantityHandler.bind(this, "-")} style={styles.btnContainer}>
                                <Icon name="remove" size={15} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnContainer}>
                                <Icon name="close" size={15} color={ui.colors.red} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        alignSelf: 'center',
        backgroundColor: 'white',
        marginLeft: 12,
        marginRight: 12,
        borderRadius: 8,
        elevation: 3
    },
    productImgContainer: {
        position: "absolute",
        width: 100,
        height: "100%",
        zIndex: 1,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    productInfo: {
        width: 230,
        height: "100%",
        borderRadius: 8
    },
    productImg: {
        height: "80%",
        width: "100%",
        resizeMode: 'contain'
    },
    productPrice: {
        height: "20%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    priceTxt: {
        color: 'black',
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.tiny
    },
    counterContainer: {
        height: 32,
        width: 32,
        borderRadius: 16,
        backgroundColor: ui.colors.highlight,
        position: 'absolute',
        top: -8,
        right: -2,
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4
    },
    counterTxt: {
        color: 'white',
        fontFamily: ui.fonts.bold,
        fontSize: 16
    },
    productInfoContainer: {
        marginLeft: 100,
        marginRight: 10,
        width: 130,
        height: "70%",
        justifyContent: 'center',
    },
    addjustmentBtnContainer: {
        width: 130,
        height: "30%",
        flexDirection: 'row',
        marginLeft: 100
    },
    productNameContainer: {
        width: 120
    },
    productName: {
        fontFamily: ui.fonts.bold,
        color: 'black'
    },
    weight: {
        fontFamily: ui.fonts.default,
        fontSize: ui.fontSize.semiTiny,
        color: 'black'
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})