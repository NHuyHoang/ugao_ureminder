import React from 'react';
import { StyleSheet, View, Text, TextInput, Picker, TouchableWithoutFeedback, TouchableOpacity, Animated, FlatList, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ui from '../../share/ui.constant'

export default class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentMetod: 'Thanh toán trực tiếp',
            focus: false
        }
        this.onFocus = () => this.setState(prevState => ({ focus: !prevState.focus }))
    }

    render() {
        let inputType = null;
        let borderStyle = {
            borderBottomColor: this.state.focus ? ui.colors.highlight : "black",
            borderBottomWidth: this.state.focus ? 2 : 0.3,
        }
        switch (this.props.type) {
            case ('picker'): {
                inputType = (
                    <CustomPicker setFocus={this.onFocus} {...this.props.config} />
                )
            }; break;
            case ('text'): {
                inputType = (
                    <TextInput
                        {...this.props.config}
                        onFocus={() => this.onFocus()}
                        onBlur={() => this.onFocus()}
                        //defaultValue="Số 1 Võ Văn Ngân, Q.Thủ Đức, TP.HCM"
                        style={styles.txtInput}
                        underlineColorAndroid="transparent"
                    />
                )
            }; break;
            default: inputType = null; break;
        }
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{this.props.label}</Text>
                <View style={[styles.inputContainer, borderStyle]}>
                    {inputType}
                    {
                        this.props.iconBtn &&
                        <TouchableOpacity onPress={this.props.btnEvent}>
                            <Icon name={this.props.iconBtn.name} size={20} color="black" />
                        </TouchableOpacity>
                    }
                </View>

            </View>
        )
    }
}

class CustomPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showItem: false,
            selectedItem: this.props.data[0]
        }
        this.itemPanelAnim = new Animated.Value(0);
        this.showItem = this.showItemHandler.bind(this);
        this.onSelectItem = (item) => (this.onSelectItemHandler.bind(this, item));
        this.itemList = (
            <FlatList
                style={{ maxHeight: 120, width: '100%' }}
                data={this.props.data}
                renderItem={({ item }) => (
                    <TouchableOpacity style={pickerStyles.pickerItem} onPress={this.onSelectItem(item)}>
                        <Text style={pickerStyles.itemTxt}>{item.key}</Text>
                    </TouchableOpacity>
                )}
            />
        )
    }
    showItemHandler() {

        if (!this.state.showItem) {

            //if showItem is false then show item panel
            Animated.timing(this.itemPanelAnim, {
                toValue: 120,
                duration: 300,
            }).start(() => this.props.setFocus());
            this.setState({ showItem: true })
        }
        else {
            Animated.timing(this.itemPanelAnim, {
                toValue: 0,
                duration: 300,
            }).start(() => this.props.setFocus());
            this.setState({ showItem: false })
        }
    }

    onSelectItemHandler(item) {
        this.setState({ selectedItem: { ...item } })
    }

    render() {
        let panelItemAnim = {
            height: this.itemPanelAnim
        }
        let chervonTransform = {
            transform: [{
                rotateZ: this.itemPanelAnim.interpolate({
                    inputRange: [0, 120],
                    outputRange: ['0deg', '-180deg']
                })
            }]
        }
        return (
            <View style={pickerStyles.container}>
                <TouchableWithoutFeedback onPress={this.showItem}>
                    <View style={pickerStyles.displayContainer}>
                        <Text style={pickerStyles.selectedItem}>{this.state.selectedItem.key}</Text>
                        <Animated.View style={chervonTransform}>
                            <Icon name="expand-less" size={20} color={'black'} />
                        </Animated.View>
                    </View>

                </TouchableWithoutFeedback>
                <View style={pickerStyles.itemContainer}>
                    <Animated.View style={[pickerStyles.itemPanel, panelItemAnim]}>
                        {this.itemList}
                    </Animated.View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 8
    },
    label: {
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.normal,
        color: 'black'
    },
    inputContainer: {
        width: '100%',
        minHeight: 40,
        alignSelf: 'flex-start',
        //borderBottomWidth: 0.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    txtInput: {
        width: "80%",
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.small,
        color: ui.colors.black,
    }

})

const pickerStyles = StyleSheet.create({
    container: {
        width: '100%',
    },
    displayContainer: {
        width: '100%',
        height: 40,
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
        top: 0,
        left: 0,
        flexDirection: 'row'
    },
    selectedItem: {
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.small,
        color: ui.colors.black,
        width: '90%'
    },
    itemContainer: {
        width: '100%',
        top: 0,
        left: 0,
    },
    itemPanel: {
        marginTop: 50,
        height: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pickerItem: {
        height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderColor: ui.colors.smoke
    },
    itemTxt: {
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.small,
    }
})