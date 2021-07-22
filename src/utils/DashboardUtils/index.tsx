import AsyncStorage from '@react-native-community/async-storage';
import {Animated} from 'react-native';

export class DashboardUtils {
  applyConditionFilters = (title, key, item, index, sectionTitle) => {
    if (title !== '') {
      const local = [
        {
          title,
          data: {
            field: key,
            values: [item.title],
          },
          country: {
            title: sectionTitle,
            selectedArr: [index],
          },
        },
      ];
      return {
        listData: {
          __typename: 'List',
          list: JSON.stringify(local),
        },
      };
    } else {
      const local = [
        {
          title: key.replace(/^\w/, c => c.toUpperCase()),
          data: {field: key, values: [item.title]},
          selectedArr: [index],
        },
      ];
      return {
        listData: {
          __typename: 'List',
          list: JSON.stringify(local),
        },
      };
    }
  };

  static onFocusSync = async loadDashboard => {
    const syncString = await AsyncStorage.getItem('Dashboard');
    if (syncString) {
      const sync = JSON.parse(syncString);
      if (sync.sync) {
        loadDashboard();
        await AsyncStorage.setItem('Dashboard', JSON.stringify({sync: false}));
      }
    }
  };

  static fadeAnimation = (animation, scrollRef, localData) => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0,
        duration: 0,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 750,
      }),
    ]).start();

    if (!scrollRef.current) {
      return;
    }

    if (localData[0].data.length !== 0) {
      scrollRef.current.scrollToLocation &&
        scrollRef.current.scrollToLocation({
          sectionIndex: 0,
          itemIndex: 0,
          animated: false,
          viewOffset: 300,
        });

      scrollRef.current.scrollToIndex &&
        scrollRef.current.scrollToIndex({
          index: 0,
          animated: false,
          viewPosition: 1,
        });
    }
  };

  handleOneLevelData = filterTab => {
    let filterArr = [];
    filterArr.push({
      title: '',
      data: filterTab,
    });
    return filterArr;
  };

  handleTwoLevelData = regions => {
    const countries = Object.keys(regions);
    let filterArr = [];
    for (let i = 0; i < countries.length; i++) {
      filterArr.push({
        title: countries[i],
        data: regions[countries[i]],
      });
    }
    return filterArr;
  };

  onSelectTab = (data, selectedTab, setLocalData) => {
    if (data && data.filters.producer.length !== 0) {
      switch (selectedTab.requestTitle) {
        case 'subregion':
          setLocalData(this.handleTwoLevelData(data.filters.subregion));
          break;
        case 'region':
          setLocalData(this.handleTwoLevelData(data.filters.region));
          break;
        case 'appellation':
          setLocalData(this.handleTwoLevelData(data.filters.appellation));
          break;
        default:
          setLocalData(this.handleOneLevelData(data.filters[selectedTab.requestTitle]));
      }
    }
  };

  onSelectCommunityTab = (data, selectedTab, setLocalData) => {
    if (data && data.filtersCommunity.producer.length !== 0) {
      switch (selectedTab.requestTitle) {
        case 'subregion':
          setLocalData(this.handleTwoLevelData(data.filtersCommunity.subregion));
          break;
        case 'region':
          setLocalData(this.handleTwoLevelData(data.filtersCommunity.region));
          break;
        case 'appellation':
          setLocalData(this.handleTwoLevelData(data.filtersCommunity.appellation));
          break;
        default:
          setLocalData(this.handleOneLevelData(data.filtersCommunity[selectedTab.requestTitle]));
      }
    }
  };

  onSelectWishlistTab = (data, selectedTab, setLocalData) => {
    if (data && data.filtersWishlist.producer.length !== 0) {
      switch (selectedTab.requestTitle) {
        case 'subregion':
          setLocalData(this.handleTwoLevelData(data.filtersWishlist.subregion));
          break;
        case 'region':
          setLocalData(this.handleTwoLevelData(data.filtersWishlist.region));
          break;
        case 'appellation':
          setLocalData(this.handleTwoLevelData(data.filtersWishlist.appellation));
          break;
        default:
          setLocalData(this.handleOneLevelData(data.filtersWishlist[selectedTab.requestTitle]));
      }
    }
  };

  scrollToIndex = (letter: string, localData: any, scrollRef) => {
    try {
      if (letter === '#') {
        scrollRef.current.scrollToIndex({animated: false, index: 0});
        return;
      }

      let index = (localData[0].data as []).findIndex(el => el.title.charAt(0) === letter);
      if (index >= 0) {
        scrollRef.current.scrollToIndex({animated: false, index: index, sectionIndex: 0});
      }
    } catch (error) {
      console.log(error);
    }
  };
}
