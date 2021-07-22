import React, {FC} from 'react';
import {View, StyleSheet, FlatList, SectionList} from 'react-native';

import {AlphabetList} from '../../';
import {SectionHeader} from '../../../new_components/';
import {HorizontalFilterPicker} from '../HorizontalFilterPicker';

type Props = {
  producer: any;
  variant: 'producer' | 'price' | string;
  data: any[];
  getItemLayout: any;
  scrollRef: any;
  renderItem: Function;
  getIcon: Function;
};

const switcher = (variant, props) => {
  switch (variant) {
    case 'producer': {
      return (
        <>
          <AlphabetList
            disabledItems={props.producer.disabledItems}
            highlight={false}
            onTextChange={symbol => props.producer.onTextChange(symbol)}
          />
          <FlatList
            data={props.data[0].data}
            style={prodList}
            ref={props.scrollRef}
            keyExtractor={(_, index) => `${index}`}
            getItemLayout={props.getItemLayout}
            indicatorStyle="white"
            renderItem={props.renderItem}
            showsVerticalScrollIndicator={true}
          />
        </>
      );
    }

    case 'price': {
      return <HorizontalFilterPicker data={props.data[0].data} renderItem={props.renderItem} />;
    }

    default: {
      return (
        <SectionList
          sections={props.data}
          style={flex1}
          ref={props.ref}
          showsVerticalScrollIndicator={true}
          indicatorStyle="white"
          contentContainerStyle={sectionListContentContainer}
          getItemLayout={props.getItemLayout}
          keyExtractor={(item, index) => item + index}
          renderItem={props.renderItem}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({section}) => {
            const index = props.data.indexOf(section);
            return (
              section.title !== '' && (
                <SectionHeader title={section.title} icon={props.getIcon(section.title)} index={index} />
              )
            );
          }}
        />
      );
    }
  }
};

export const DashboardSwitcher: FC<Props> = props => {
  return <View style={{zIndex: 1, flexGrow: 1}}>{switcher(props.variant, props)}</View>;
};

const styles = StyleSheet.create({
  sectionListContentContainer: {flexGrow: 1, paddingBottom: 40},
  flex1: {flex: 1},
  prodList: {paddingRight: 10},
});

const {sectionListContentContainer, flex1, prodList} = styles;
