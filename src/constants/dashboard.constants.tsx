import {
  CountryIcon,
  ProducerIconNew,
  VarientalIconNew,
  RegionIconNew,
  SubRegionIconNew,
  CountryIconNew,
  AppellationIconNew,
  VintageIconNew,
} from '../assets/svgIcons';
import Photos from '../assets/photos';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type TabType = {
  title: string;
  requestTitle: string;
  icon: any;
  bgImage: any;
  headerIcon?: any;
};

//List of tabs on Dashboard
export const bottomTabData = [
  {
    title: 'Producer',
    requestTitle: 'producer',
    icon: (height, width, active) => (
      <ProducerIconNew isActive={active} height={height === 0 ? 60 : height} width={width === 0 ? 68 : width} />
    ),
    bgImage: Photos.producer,
  },
  {
    title: 'Varietal',
    requestTitle: 'varietal',
    icon: (height, width, active) => (
      <VarientalIconNew isActive={active} height={height === 0 ? 60 : height} width={width === 0 ? 60 : width} />
    ),
    bgImage: Photos.varietal,
  },
  {
    title: 'Country',
    requestTitle: 'country',
    icon: (height, width, active) => (
      <CountryIconNew isActive={active} height={height === 0 ? 60 : height} width={width === 0 ? 60 : width} />
    ),
    bgImage: Photos.country,
  },
  {
    title: 'Region',
    requestTitle: 'region',
    icon: (height, width, active) => (
      <RegionIconNew isActive={active} height={height === 0 ? 60 : height} width={width === 0 ? 60 : width} />
    ),
    headerIcon: (height, width) => <CountryIcon height={height} width={width} />,
    bgImage: Photos.region,
  },
  {
    title: 'Subregion',
    requestTitle: 'subregion',
    icon: (height, width, active) => (
      <SubRegionIconNew isActive={active} height={height === 0 ? 60 : height} width={width === 0 ? 70 : width} />
    ),
    headerIcon: () => null,
    bgImage: Photos.subregion,
  },
  {
    title: 'Appellation',
    requestTitle: 'appellation',
    icon: (height, width, active) => (
      <AppellationIconNew isActive={active} height={height === 0 ? 60 : height} width={width === 0 ? 38 : width} />
    ),
    headerIcon: (height, width) => <SubRegionIconNew isActive={false} height={height} width={width} />,
    bgImage: Photos.appellation,
  },
  {
    title: 'Vintage',
    requestTitle: 'vintage',
    icon: (height, width, active) => (
      <VintageIconNew isActive={active} height={height === 0 ? 60 : height} width={width === 0 ? 37 : width} />
    ),
    bgImage: Photos.vintage,
  },
];

const priceTab = {
  title: 'Price',
  requestTitle: 'price',
  icon: (height, width, active) => (
    <FontAwesome name="dollar" size={42} color={active ? 'rgba(228, 117, 36, 1)' : '#fff'} />
  ),
  bgImage: Photos.vintage,
};

export const inventoryTabData: TabType[] = [...bottomTabData, priceTab];

export const EMPTY_SYNC_DASHBOARD_ERROR =
  'We noticed you have an empty and lonely cellar. You can also sync your inventory from Cellar Tracker';

export const EMPTY_DASHBOARD_ERROR =
  "Hey, you don't have any wine, consider adding wine manually or from Community inventory";
