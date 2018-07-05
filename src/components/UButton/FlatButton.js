import React from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native';

import ui from '../../share/ui.constant';

export default class FlatButton extends React.PureComponent {
    render() {
        let color = ui.colors.highlight;
        let backgroundColor = "transparent";
        if (this.props.invert) {
            color = 'white';
            if (this.props.disabled) backgroundColor = ui.colors.light_gray;
            else backgroundColor = ui.colors.highlight;
        } else {
            if (this.props.disabled)
                color = ui.colors.highlight;
        }
        return (
            <View style={[
                styles.container,
                {
                    width: !this.props.width ? '100%' : this.props.width,
                    height: !this.props.height ? 42 : this.props.height,
                    marginTop: this.props.top ? this.props.top : 0.0,
                    marginBottom: this.props.bottom ? this.props.bottom : 0.0,
                    backgroundColor,
                }]}>
                <TouchableNativeFeedback
                    disabled={this.props.disabled}
                    onPress={this.props.onPress}
                    background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.2)', true)} >
                    <View style={styles.inkwell}>
                        <Text style={
                            [styles.txt,
                            { color: this.props.color ? this.props.color : color }
                            ]}>
                            {this.props.title.toUpperCase()}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 4.0,
    },
    inkwell: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    txt: {
        fontSize: ui.fontSize.normal,
        fontFamily: ui.fonts.bold,
    }
})