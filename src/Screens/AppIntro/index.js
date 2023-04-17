import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import GradientButton from '../../Components/GradientButton';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import { setItem } from '../../utils/utils';

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'blue',
    },
    image: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        // marginVertical: 32,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    title: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
    },
    activeDotStyle: {
        backgroundColor: colors.themeColor
    }
});

export default class AppIntro extends React.Component {
    state = {
        index: 0,
        lastIndex: -1,
        slides: []
    }

    componentDidMount = () => {
        console.log("AppIntro - index.js")
        const temp = this.props.route.params.images.map((el, index) => {
            return {
                key: index + 1,
                title: '',
                text: '',
                image: {uri: `${el.file_name.image_fit}${Math.round(Dimensions.get('screen').width)}/${Math.round(Dimensions.get('screen').height)}${el.file_name.image_path}`},
                backgroundColor: '#22bcb5',
            }
        })

        this.setState({ ...this.state, slides: temp })
        setItem('firstTime', true)
    }

    _renderItem = ({ item }) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={styles.image} resizeMode={'contain'} />
            </View>
        );
    }

    _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <GradientButton btnText={strings.START} btnStyle={{ paddingHorizontal: 10 }} onPress={() => this.props.navigation.push(navigationStrings.DRAWER_ROUTES)} />
            </View>
        );
    };

    onSlideChange = (el, i) => {
    }

    onScroll = () => {
    }

    render() {
        return (
            <>
                <StatusBar translucent backgroundColor="transparent" />
                <AppIntroSlider
                    data={this.state.slides}
                    renderDoneButton={this._renderDoneButton}
                    onEndReached={(el) => console.log(el)}
                    renderItem={this._renderItem}
                    activeDotStyle={styles.activeDotStyle}
                    onSlideChange={(el, i) => this.onSlideChange(el, i)}
                    onScroll={() => this.onScroll()}
                />
            </>
        );
    }
}