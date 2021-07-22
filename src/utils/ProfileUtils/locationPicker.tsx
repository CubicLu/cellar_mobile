import axios from 'axios';
import Config from 'react-native-config';

export const fetchPrettyLocation = async ({latitude, longitude}) => {
  const {
    data: {
      results: [response],
    },
  } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${Config.MAP_API_KEY}`,
  );

  return response ? getPrettyLocation(response) : null;
};

const getPrettyLocation = response => {
  let prettyLocation = {
    city: '',
    country: '',
    subdivision: '',
    stateAbbreviation: '',
    prettyLocationName: '',
    longitude: '',
    latitude: '',
  };

  if (response && response.geometry.location_type === 'APPROXIMATE') {
    return prettyLocation;
  }

  response.address_components.map(component => {
    if (component.types[0] === 'locality') {
      prettyLocation.city = component.long_name;
    }
    if (!prettyLocation.city && component.types[0] === 'administrative_area_level_2') {
      prettyLocation.city = component.long_name;
    }
    if (component.types[0] === 'administrative_area_level_1') {
      prettyLocation.stateAbbreviation = component.short_name;
      prettyLocation.subdivision = component.long_name;
    }
    if (component.types[0] === 'country') {
      prettyLocation.country = component.long_name;
    }
  });
  prettyLocation.prettyLocationName = `${prettyLocation.city}, ${prettyLocation.stateAbbreviation}, ${
    prettyLocation.country
  }`;

  prettyLocation.latitude = response.geometry.location.lat;
  prettyLocation.longitude = response.geometry.location.lng;

  return prettyLocation;
};
