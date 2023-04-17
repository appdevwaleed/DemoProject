import React, {Fragment} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {height, moderateScale, textScale} from '../styles/responsiveSize';

export default function CustomDrawerContent({
  state,
  descriptors,
  navigation,
  progress,
  ...props
}) {
  const insets = useSafeAreaInsets();
  const currentTheme = useSelector((state) => state.initBoot);
  const {themeColors, themeLayouts, appStyle} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;

  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <Animated.View
      style={{transform: [{translateX}]}}
      style={{
        height: height,
        marginTop: moderateScale(100),
      }}
      colors={[themeColors.primary_color, themeColors.primary_color]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          options.drawerLabel !== undefined
            ? options.drawerLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const onPress = () => {
          const event = navigation.emit({
            type: 'drawerItemPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Fragment key={route.name}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              // onLongPress={onLongPress}
              style={{
                margin: moderateScale(10),
                // alignItems: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {options.drawerIcon({focused: isFocused})}
              <Text
                style={{
                  paddingLeft: moderateScale(20),
                  fontSize: textScale(14),
                  fontFamily: fontFamily?.bold,
                  ...props.labelStyle,
                  color: isFocused ? colors.white : colors.whiteOpacity5,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          </Fragment>
        );
      })}
    </Animated.View>
  );
}
