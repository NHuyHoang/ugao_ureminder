import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons'

export default IconButton = (props) => {
    return (
        <View style={[{
            height: props.size,
            width: props.size,


        }]}>
            <TouchableHighlight
                onLongPress={props.onLongPress}
                onPressOut={props.onPressOut}
                onPress={props.onPress}
                underlayColor={'rgba(0,0,0,0.1)'}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: props.size * 0.2,
                    flex: 1,
                }}>
                {
                    props.ionicon ?
                        <Ionicon name={props.name} size={props.size * 0.6} color={props.color ? props.color : 'black'} /> :
                        <Icon name={props.name} size={props.size * 0.6} color={props.color ? props.color : 'black'} />
                }

            </TouchableHighlight>
        </View>
    )
}

/* const styles = StyleSheet.create({
    container: {

    }
}) */