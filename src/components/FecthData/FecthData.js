import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Button, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { gql, graphql } from 'react-apollo';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ui from '../../share/ui.constant'

export default (query, type, props, LoadedContent) => {
    const configQuery = gql`${query}`;
    const Fetch = graphql(configQuery)(({ ownProps, data }) => {
        console.log(data);
        if (data.error) console.log(data.error);
        if (data.loading) return <Spinner />
        if (data.networkStatus === 8) return <NetworkError refetch={data.refetch} />
        else if (!data[type]) return <Text>Failed to fetch data...</Text>
        return <LoadedContent {...ownProps} data={data[type]} />
    })

    return <Fetch ownProps={{ ...props }} />
}

const NetworkError = (props) => (
    <ScrollView  refreshControl={
        // This enables the pull-to-refresh functionality
        <RefreshControl
            refreshing={false}
            onRefresh={() => refetchHandler(props.refetch)}
        />
    }>
        <View style={styles.container}>
            <Icon name="signal-wifi-off" size={50} color={ui.colors.dark_gray} />
            <Text style={styles.notiText}>Lỗi kết nối</Text>
            <Text style={styles.notiText}>Kéo xuống để reload</Text>
        </View>
    </ScrollView>
)

const refetchHandler = (funct) => {
    return funct().catch(err => console.log('network err'))
}

const Spinner = () => (
    <View style={styles.container}>
        <ActivityIndicator size={50} color="#000000" />
    </View>
)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Dimensions.get('window').height/2,
        justifyContent:'flex-end',
        alignItems: 'center',
    },
    notiText: {
        marginTop: 8,
        fontFamily: ui.fonts.default,
        fontSize: ui.fontSize.normal,
        color: ui.colors.dark_gray
    }
})