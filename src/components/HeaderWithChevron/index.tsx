import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, StyleProp, TextStyle, TextProps} from 'react-native';
import {withNavigation, NavigationScreenProp} from 'react-navigation';
import {ChevronLeftIcon} from '../../assets/svgIcons';
import Colors from '../../constants/colors';
import textStyle from '../../constants/Styles/textStyle';

type HeaderType = 'text' | 'logo' | 'text-button';

type Props = {
  navigation: NavigationScreenProp<any>;
  title?: string;
  customBack?: () => void;
  titleTextStyle?: StyleProp<TextStyle>;
  buttonBgColor?: string;
  titleTextProps?: TextProps;
  renderRightButton?: () => React.ReactNode;
  renderLogo?: () => React.ReactNode;
  variant?: HeaderType;
};

function selectVariant(variant: HeaderType, props: Props) {
  switch (variant) {
    case 'text-button':
    case 'text': {
      return (
        <View style={[titleWithButtonContainer]}>
          <View style={[titleContainer, !props.renderRightButton && flexCol]}>
            <Text
              numberOfLines={3}
              allowFontScaling={false}
              adjustsFontSizeToFit={true}
              style={[titleText, props.titleTextStyle]}
              {...props.titleTextProps}>
              {props.title}
            </Text>
          </View>
          {props.renderRightButton && props.renderRightButton()}
        </View>
      );
    }

    case 'logo': {
      return <View style={logoContainer}>{props.renderLogo()}</View>;
    }
  }
}

const Header: FC<Props> = props => {
  const {navigation, buttonBgColor, customBack, variant = 'text-button'} = props;

  return (
    <View style={headerContainer}>
      <View style={[arrowContainer, buttonBgColor && {backgroundColor: buttonBgColor}]}>
        <TouchableOpacity style={arrowTouchable} onPress={customBack ? customBack : () => navigation.goBack()}>
          <ChevronLeftIcon height={25} width={20} />
        </TouchableOpacity>
      </View>

      {selectVariant(variant, props)}
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    backgroundColor: Colors.dashboardRed,
  },
  flexCol: {
    flexDirection: 'column',
  },
  arrowTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
  },
  titleContainer: {
    marginLeft: 22,
    paddingRight: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    height: '100%',
  },
  titleText: {
    fontWeight: '500',
    fontSize: Dimensions.get('screen').width < 375 ? 35 : 50,
    lineHeight: 66,
    ...textStyle.mediumText,
    color: '#fff',
  },
  titleWithButtonContainer: {flexDirection: 'row', flex: 1, justifyContent: 'space-between'},
  logoContainer: {flex: 1, alignSelf: 'center', marginLeft: 10},
});

const {
  arrowContainer,
  arrowTouchable,
  headerContainer,
  titleContainer,
  titleText,
  titleWithButtonContainer,
  logoContainer,
  flexCol,
} = styles;
export const HeaderWithChevron = withNavigation(Header);
