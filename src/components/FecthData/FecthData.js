import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Button, ScrollView, RefreshControl, Dimensions, NetInfo } from 'react-native';
import { gql, graphql } from 'react-apollo';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ui from '../../share/ui.constant'

export default (query, type, props, LoadedContent) => {
    const configQuery = gql`${query}`;
    const Fetch = graphql(configQuery)(({ ownProps, data }) => {
        if (data.error) console.log(data.error);
        if (data.loading) return <Spinner />
        if (data.networkStatus === 8) return <NetworkError refetch={data.refetch} />
        else if (!data[type]) return <Text>Failed to fetch data...</Text>
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
                        <View style={styles.center}>
                            <Text style={styles.sadMeme}>: (</Text>
                            <Text style={styles.notiText}>Vui lòng kiểm tra kết nối</Text>
                        </View>
                }
            </View>
        )
    }
}


const refetchHandler = (funct) => {
    return funct().catch(err => console.log('network err'))
}

const Spinner = () => (
    <View style={styles.container}>
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#000000" />
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    notiText: {
        fontFamily: ui.fonts.light,
        fontSize: 18,
        marginLeft: 6,
        color: 'black',
    },
    center: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    sadMeme: {
        fontSize: 60,
        transform: [{ rotate: '90deg' }],
        color: 'black',
        alignSelf: 'center'
    }
})