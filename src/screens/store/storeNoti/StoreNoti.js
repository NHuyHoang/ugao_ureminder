import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableNativeFeedback } from 'react-native';
import ui from '../../../share/ui.constant'

export default class StoreNoti extends React.Component {
/*     showScreen = () => {
        return this.props.show ?
            { opacity: 1, zIndex: 1, } : { opacity: 0, zIndex: 0, }
    } */
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={templateData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <NotiItem data={item} />}
                    refreshing={false}
                    onRefresh={() => {}}
                />
            </View>
        );

    }
}

const templateData = [
    {
        _id:Math.random(),
        title: "Hưởng ứng U23 VN gạo lúa mùa giảm giá 10%",
        body: "U23 Việt Nam vừa viết tiếp điều thần kỳ khi giành vé vào chung kết giải U23  châu Á 2018, nổi bật trong đợt chiến thắng này là anh... ",
    },
    {
        _id:Math.random(),
        title: "Mua gạo online tặng hạt nêm thiên nhiên ngưu báng",
        body: "Khách hàng mua >= 10 kg gạo trắng (5kg/túi) Hoặc mua >= 5 kg gạo lứt đỏ hữu cơ, gạo mầm dinh dưỡng, sẽ được tặng...",
    },
    {
        _id:Math.random(),
        title: "Ngày 20-11 đến, bạn tặng quà gì",
        body: "Ngày Nhà giáo Việt Nam 20/11 đang đến gần, bạn đã chọn được món quà gì tặng Thầy Cô giáo chưa?GẠO là món quà thiết...",
    }
]

const NotiItem = (props) => {
    const textEllipsis = (string, isTitle) => {
        if (isTitle && string.length > 50)
            return string.substring(0, 50) + '...';
        else if (!isTitle && string.length > 250)
            return string.substring(0, 250) + '...';
        return string;
    }

    let { title, body } = {
        title: textEllipsis(props.data.title, true),
        body: textEllipsis(props.data.body)
    }
    return (
        <TouchableNativeFeedback onPress={() => { }}
            background={TouchableNativeFeedback.Ripple()}>
            <View style={styles.notiPanel}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{body}</Text>
            </View>
        </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    notiPanel: {
        width: '100%',
        height: 82,
        justifyContent: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        borderBottomWidth:0.2,
        borderBottomColor:ui.colors.light_gray
    },
    infoContainer: {
        width: "80%",
        height: "100%",
        justifyContent: 'center',
        paddingLeft: 5
    },
    btnContainer: {
        width: "20%",
        height: "100%",
        backgroundColor: 'green',
    },
    title: {
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.tiny,
        color: 'black',
        textDecorationLine: "underline"
    },
    body: {
        fontFamily: ui.fonts.default,
        fontSize: ui.fontSize.tiny,
        color: 'black'
    }
})