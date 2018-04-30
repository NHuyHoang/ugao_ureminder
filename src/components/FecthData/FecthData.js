import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Button, ScrollView, RefreshControl, Dimensions, NetInfo } from 'react-native';
import { gql, graphql } from 'react-apollo';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ui from '../../share/ui.constant'

export default (query, type, props, LoadedContent, error) => {
    const configQuery = gql`${query}`;
    const Fetch = graphql(configQuery)(({ ownProps, data }) => {
        if (data.error) console.log(data.error);
        if (data.loading) return <Spinner />
        if (data.networkStatus === 8) return <NetworkError refetch={data.refetch} />
        else if (!data[type]) return <FecthDataFailed error={error} />
        return <LoadedContent {...ownProps} data={data[type]} />
    })

    return <Fetch ownProps={{ ...props }} />
}

class NetworkError extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tryConnect: false
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
    }


    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
    }

    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
            this.setState({
                tryConnect: true
            }, () => {
                //refetchHandler(this.props.refetch);
                this.props.refetch()
                    .catch(err => this.setState({ tryConnect: false }))
            })

        }

    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.tryConnect ?
                        <Spinner /> :
                        <FecthDataFailed error="Vui lòng kiểm tra kết nối" />
                }
            </View>
        )
    }
}

FecthDataFailed = (props) => {
    return (
        <View style={{
            width: '100%',
            height: 20,
            backgroundColor: "#F2D200",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Text
                style={{
                    color: 'white',
                    fontFamily: ui.fonts.bold,
                    fontSize: ui.fontSize.semiTiny
                }}>{props.error ? props.error : "Đã xảy ra lỗi"}</Text>
        </View>
    )
}


const refetchHandler = (funct) => {
    return funct().catch(err => console.log('network err'))
}

const Spinner = () => (
    <View style={styles.container}>
        <View style={styles.center}>
            <ActivityIndicator size={22} color="#000000" />
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 30
    }
})