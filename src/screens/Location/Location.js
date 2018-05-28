import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Callout } from 'react-native-maps';
import { connect } from 'react-redux';
import { Header, Noti } from '../../components';

import { tryUpdateCustomerInfo } from '../../store/actions';

class Location extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            location: {
                latitude: this.props.navigation.state.params.customerLocation.lat,
                longitude: this.props.navigation.state.params.customerLocation.lng,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0421,
            },
            updateStatus: "READY"
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

    updateCustomerLocation = () => {
        const callback = (success) => {
            if (success) {
                this.setState({ updateStatus: "SUCCESS" })
            } else {
                this.setState({ updateStatus: "FAILED" })
            }
            this.timer = setTimeout(() => {
                this.setState({ updateStatus: "READY" })
            }, 3000)
        }
        this.setState({ updateStatus: "UPDATING" })
        this.props.tryUpdateCustomerInfo({
            coordinate: {
                lat: this.state.location.latitude,
                lng: this.state.location.longitude,
            }
        }, callback)
    }

    componentWillUnmount() {
        if (this.timer)
            clearTimeout(this.timer);
    }

    render() {
        let storeMarker = (
            <MapView.Marker
                coordinate={{
                    latitude: this.props.store.location.lat,
                    longitude: this.props.store.location.lng,
                    latitudeDelta: 0.0122,
                    longitudeDelta: 0.0421,
                }} >
                <Image onLoad={() => this.forceUpdate()}
                    style={{ width: 52, height: 52 }}
                    source={require('../../share/images/store_marker_2.png')} />
            </MapView.Marker>
        );
        return (
            <View style={styles.container}>
                <Header data={[
                    { name: 'check', onPress: this.updateCustomerLocation, color: 'green' },
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
                    {storeMarker}
                </MapView>
                {
                    this.state.updateStatus === "UPDATING" &&
                    <View style={styles.dimmer} >
                        <ActivityIndicator size="large" color="white" />
                    </View>
                }
                {
                    this.state.updateStatus === "SUCCESS" &&
                    <View style={styles.notiContainer}>
                        <Noti message="Cập nhật thành công" success />
                    </View>
                }
                {
                    this.state.updateStatus === "FAILED" &&
                    <View style={styles.notiContainer}>
                        <Noti message="Cập nhật thất bại" />
                    </View>
                }
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
    },
    dimmer: {
        height: '100%',
        width: '100%',
        position: "absolute",
        zIndex: 1,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    notiContainer: {
        position: "absolute",
        height: 22,
        width: '100%',
        zIndex: 1,
        top: 42,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = state => {
    return {
        store: state.customer.store,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        tryUpdateCustomerInfo: (info, callback) => dispatch(tryUpdateCustomerInfo(info, callback)),
    }
}
export default connect(mapStateToProps, mapDispatchToprops)(Location);