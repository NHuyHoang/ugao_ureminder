import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import { Header } from '../../components'

export default class Location extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            location: {
                latitude: this.props.navigation.state.params.customerLocation.lat,
                longitude: this.props.navigation.state.params.customerLocation.lng,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0421,
            },
        }
        if (this.props.navigation.state.params.storeLocation) {
            let storeLocation = {
                latitude: this.props.navigation.state.params.storeLocation.lat,
                longitude: this.props.navigation.state.params.storeLocation.lng,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0421,
            }
            this.storeMarker = (
                <MapView.Marker
                    coordinate={storeLocation} >
                    <Image onLoad={() => this.forceUpdate()}
                        style={{ width: 52, height: 52 }}
                        source={require('../../share/images/store_marker_2.png')} />
                </MapView.Marker>
            )
        }
    }

    onLocationChange = (e) => {
        const coords = e.nativeEvent.coordinate;
        this.map.animateToRegion({
            ...this.state.location,
            latitude: coords.latitude,
            longitude: coords.longitude
        }, 700)
        this.setState(prevState => ({
            location: {
                ...prevState.location,
                latitude: coords.latitude,
                longitude: coords.longitude
            },
        }))
    }

    getCurrentLocationHandler = () => {
        navigator.geolocation.getCurrentPosition(pos => {
            const coordsEvent = {
                nativeEvent: {
                    coordinate: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                }
            }
            this.onLocationChange(coordsEvent);
        }, err => {
            alert('Failed to fetching position');
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Header data={[
                    { name: 'my-location', onPress: this.getCurrentLocationHandler, color: 'black' },
                    { name: 'clear', onPress: () => this.props.navigation.goBack(), color: 'red' },
                ]} />
                <MapView
                    style={{ flex: 1 }}
                    ref={ref => this.map = ref}
                    initialRegion={this.state.location}
                    onPress={this.onLocationChange} >
                    <MapView.Marker
                        coordinate={this.state.location} />
                    {this.storeMarker}
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBtn: {
        marginRight: 12
    }
})