import React from 'react';
import {
    View, Text, NetInfo,
    StyleSheet, TouchableOpacity,
    Image, ActivityIndicator,
    Dimensions, TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Callout } from 'react-native-maps';
import { connect } from 'react-redux';

import { Header, Noti } from '../../components';
import { tryUpdateCustomerInfo } from '../../store/actions';
import ui from '../../share/ui.constant';
import global_const from '../../store/constant';

const SelectType = Object.freeze({ inputEntering: "inputEntering", mapTouching: "mapTouching" });
class Location extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            location: {
                address: this.props.customerLocation && this.props.customerLocation.address,
                latitude: this.props.customerLocation ? this.props.customerLocation.lat : 1.0,
                longitude: this.props.customerLocation ? this.props.customerLocation.lng : 1.0,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0421,
            },
            updateStatus: "READY",
            findingStatus: "READY"
        };
        this.selectType = SelectType.mapTouching;
        if (!this.props.customerLocation)
            this.getCurrentLocationHandler();
    }

    onLocationChange = (e) => {
        const coords = e.nativeEvent.coordinate;
        this.map.animateToRegion({
            ...this.state.location,
            latitude: coords.latitude,
            longitude: coords.longitude
        }, 700);
        this.setState(prevState => ({
            location: {
                ...prevState.location,
                latitude: coords.latitude,
                longitude: coords.longitude
            },
        }))
    };

    getCurrentLocationHandler = () => {
        navigator.geolocation.getCurrentPosition(pos => {
            const callback = () => {
                const coordsEvent = {
                    nativeEvent: {
                        coordinate: {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                        }
                    }
                };
                this.onLocationChange(coordsEvent);
            }
            this._getLocationAddress(pos.coords, callback);
        }, err => {
            alert('Failed to fetching position');
        })
    };

    updateCustomerLocation = async () => {
        const callback = (success) => {
            if (success) {
                this.setState({ updateStatus: "SUCCESS" })
            } else {
                this.setState({ updateStatus: "FAILED" })
            }
            this.timer = setTimeout(() => {
                this.setState({ updateStatus: "READY" })
            }, 3000)
        };
        this.setState({ updateStatus: "UPDATING" });

        const updateLocation = () => {
            this.props.tryUpdateCustomerInfo({
                coordinate: {
                    address: this.state.location.address,
                    lat: this.state.location.latitude,
                    lng: this.state.location.longitude,
                }
            }, callback);
        };
        //if user touch to select the location
        //get the place's name before save
        if (this.props.customer._id) {
            if (this.selectType == SelectType.mapTouching) {
                //get address name by coordinate
                this._getLocationAddress(this.state.location, updateLocation);

            } else {
                updateLocation();
            }
        }
        //if user isn't signed in then just update the address
        else if (this.selectType == SelectType.mapTouching) {
            //get address name by coordinate
            this._getLocationAddress(this.state.location, () => { this.setState({ updateStatus: "READY" }) });

        }


    };

    _getLocationAddress = async (coordinate, callback) => {
        const uri = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${global_const.GMAP_API_KEY}`;
        let address = await fetch(uri)
            .then(result => result.json())
            .then(result => {
                console.log(result);
                if (result.status !== "OK")
                    return null;
                return result.results[0].formatted_address;
            });
        if (address !== null)
            this.setState({
                location: {
                    ...this.state.location,
                    address
                }
            }, () => { if (callback) callback() });
        else if (callback) callback();
    }

    componentWillUnmount() {
        if (this.timer)
            clearTimeout(this.timer);
    }

    onFindLocation = async () => {
        const address = this.refs.placeInput._lastNativeText;
        this.selectType = SelectType.inputEntering;
        const uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${global_const.GMAP_API_KEY}`;
        let response;
        try {
            this.setState({ findingStatus: "FINDING" });
            response = await fetch(uri).then(result => result.json());
            this.setState({ findingStatus: "READY" });
            let response = response.results[0];
            console.log(response);
            const coordsEvent = {
                nativeEvent: {
                    coordinate: {
                        latitude: response.geometry.location.lat,
                        longitude: response.geometry.location.lng
                    }
                }
            };
            this.onLocationChange(coordsEvent);
            this.setState({
                location: {
                    ...this.state.location,
                    address: response.formatted_address
                }
            })
        } catch (err) {
            console.log(err)
        }

    };

    _checkConnection = async (callback) => {
        const isConnected = await NetInfo.isConnected.fetch().then(isConnected => isConnected);
        if (!isConnected) alert("Vui lòng kiểm tra kết nối");
        else callback();

    }

    _onBackWithCallback = () => {
        const callback = this.props.navigation.state.params.getLocation;
        if (callback) {
            const { address, latitude, longitude } = this.state.location;
            callback({ address, latitude, longitude });
        }
        this.props.navigation.goBack();
    }


    render() {
        let storeMarker = this.props.store.location && (
            <MapView.Marker
                coordinate={{
                    latitude: this.props.store.location.lat,
                    longitude: this.props.store.location.lng,
                    latitudeDelta: 0.0122,
                    longitudeDelta: 0.0421,
                }}>
                <Image onLoad={() => this.forceUpdate()}
                    style={{ width: 52, height: 52 }}
                    source={require('../../share/images/store_marker_2.png')} />
            </MapView.Marker>
        );
        return (
            <View style={styles.container}>
                <Header data={[
                    { name: 'my-location', onPress: () => this._checkConnection(this.getCurrentLocationHandler), color: 'black' },
                    { name: 'check', onPress: () => this._checkConnection(this.updateCustomerLocation), color: 'green' },
                    { name: 'clear', onPress: this._onBackWithCallback, color: 'red' },
                ]} />

                <MapView
                    style={{ flex: 1 }}
                    ref={ref => this.map = ref}
                    initialRegion={this.state.location}
                    onPress={(e) => {
                        this.selectType = SelectType.mapTouching;
                        this.onLocationChange(e);
                    }}>
                    {
                        this.state.location.latitude &&
                        < React.Fragment>
                            <MapView.Marker
                                coordinate={this.state.location}>
                                <Callout />
                            </MapView.Marker>
                            {storeMarker}
                        </React.Fragment>
                    }
                </MapView>
                <View style={styles.inputContainer}>
                    {
                        this.state.findingStatus === "FINDING" ?
                            <View style={styles.actIndicatorContainer}>
                                <ActivityIndicator size="small" color="black" />
                            </View> :
                            <React.Fragment>
                                <TextInput
                                    ref="placeInput"
                                    placeholder={this.state.location.address}
                                    style={styles.inputStyle}
                                    underlineColorAndroid="transparent" />
                                <TouchableOpacity style={styles.searchBtn}
                                    onPress={this.onFindLocation}>
                                    <Icon name="search" size={22} color="black" />
                                </TouchableOpacity>
                            </React.Fragment>
                    }
                </View>
                {
                    this.state.updateStatus === "UPDATING" &&
                    <View style={styles.dimmer}>
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

const _width = Dimensions.get('window').width;

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
        top: "auto",
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        position: "absolute",
        flexDirection: 'row',
        backgroundColor: "white",
        height: 46,
        width: _width * 0.9,
        zIndex: 1,
        top: 52,
        elevation: 3,
        borderRadius: 6,
        left: _width * 0.05,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingLeft: 12.0,
        paddingRight: 12.0
    },
    inputStyle: {
        width: '90%',
        fontFamily: ui.fonts.light,
        fontSize: ui.fontSize.semiTiny
    },
    searchBtn: {
        width: "10%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    actIndicatorContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = state => {
    return {
        store: state.customer.store,
        customerLocation: state.customer.info.location,
        customer: state.customer.info
    }
};

const mapDispatchToprops = dispatch => {
    return {
        tryUpdateCustomerInfo: (info, callback) => dispatch(tryUpdateCustomerInfo(info, callback)),
    }
};
export default connect(mapStateToProps, mapDispatchToprops)(Location);