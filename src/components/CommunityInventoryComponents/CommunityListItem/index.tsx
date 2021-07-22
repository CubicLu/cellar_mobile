import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Highlighter from 'react-native-highlight-words';

import {WineListItemBody, WineListItemPhoto} from '../../../components';
import {styles, RightColProps} from '../../InventoryComponents/InventoryListItem';

const {container, h1, h2, highlight, infoContainer, producerContainer} = styles;

const CommunityItem = ({wine: {wine, quantity}, search, onItemPress}) => {
  return (
    <TouchableOpacity onPress={onItemPress} style={container}>
      <WineListItemPhoto pictureURL={wine.pictureURL} color={wine.color} />

      <View style={infoContainer}>
        <View>
          <View style={producerContainer}>
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={h1}
              searchWords={[search]}
              textToHighlight={wine.producer}
            />
          </View>
          {wine.wineName !== '' && wine.wineName && (
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={h2}
              searchWords={[search]}
              textToHighlight={wine.wineName.replace(`${wine.producer}`, '').trim()}
            />
          )}
        </View>

        <WineListItemBody
          subregion={wine.locale.subregion}
          searchWord={search}
          varietal={wine.varietal}
          vintage={wine.vintage}
          bottleCount={quantity}
        />
      </View>
    </TouchableOpacity>
  );
};
export const CommunityListItem = CommunityItem;
