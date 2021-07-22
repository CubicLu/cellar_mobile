import Colors from '../constants/colors';
import moment from 'moment';

export const costValidation = val => {
  if (!val) {
    return '';
  }

  if (!/^\d+(\.\d{1,2})?$/.test(val)) {
    return 'Price should contain only decimals';
  }

  return '';
};

export const requiredFieldsValidation = val => {
  if (!val) {
    return 'This field is required';
  }
};

export const requiredColorValidation = (val, error) => {
  if (!val || error !== '') {
    return Colors.inputError;
  }
  return Colors.inputBorderGrey;
};

export const priceValidation = val => {
  if (val === '') {
    return 'This is a required field';
  }
  if (isNaN(val)) {
    return 'Price should contain only decimals';
  }
};

export const requiredBottleScore = (score: number) => {
  if (score === null) {
    return '';
  }
  if (score > 100 || score < 1) {
    return 'Must be in range 1-100';
  }
  return '';
};

export const isDisabledButton = inventoryState =>
  !inventoryState.producer ||
  !inventoryState.displayVintage ||
  !inventoryState.displayBottleCount ||
  !inventoryState.displayBottleSize ||
  !inventoryState.country ||
  !inventoryState.varietal ||
  !inventoryState.subregion ||
  !inventoryState.appellation ||
  !inventoryState.region ||
  !inventoryState.cost;

export const isDisabledButtonWishlist = inventoryState =>
  !inventoryState.producer ||
  !inventoryState.displayVintage ||
  !inventoryState.displayBottleSize ||
  !inventoryState.varietal;

export const isDisabledButtonEdit = (inventoryState, wine) => {
  return (
    (inventoryState.producer === wine.producer &&
      inventoryState.vintage === wine.vintage &&
      inventoryState.country === wine.locale.country &&
      inventoryState.region === wine.locale.region &&
      inventoryState.subregion === wine.locale.subregion &&
      inventoryState.wineName === wine.wineName &&
      inventoryState.appellation === wine.locale.appellation &&
      inventoryState.cost.toString() === wine.price.toString() &&
      inventoryState.cellarDesignation.id === wine.cellarDesignationId &&
      inventoryState.varietal === wine.varietal &&
      compareDrinkWindows(inventoryState.drinkWindowStart, wine.drinkWindow.start) &&
      compareDrinkWindows(inventoryState.drinkWindowEnd, wine.drinkWindow.end) &&
      Number(inventoryState.bottleSize) === wine.bottleCapacity &&
      !priceValidation(inventoryState.cost) &&
      inventoryState.imageURI.uri === wine.pictureURL) ||
    !inventoryState.producer ||
    !inventoryState.country ||
    !inventoryState.region ||
    !inventoryState.subregion ||
    !inventoryState.appellation ||
    !inventoryState.cost ||
    !inventoryState.vintage ||
    !inventoryState.cellarDesignation ||
    !inventoryState.bottleSize ||
    !inventoryState.varietal ||
    !!priceValidation(inventoryState.cost) ||
    !validateDrinkWindowInput(inventoryState.drinkWindowStart, inventoryState.drinkWindowEnd)
  );
};

function validateDrinkWindowInput(start, end): boolean {
  const startWarning = drinkWindowStartValidation(start, end);
  const endWarning = drinkWindowEndValidation(start, end);

  return !(startWarning + endWarning);
}

export const drinkWindowStartValidation = (start, end) => {
  const intStart = +start;
  const intEnd = +end;

  if (start === '' && end === '') {
    return '';
  }

  if (end !== '' && start === '') {
    return 'Must be filled with End Date';
  }

  if (start === end) {
    return "Dates don't have to be the same";
  }

  if (start !== '' && end === '') {
    return '';
  }

  if (intStart > intEnd) {
    return 'End date must be greater than start date';
  }

  if (end !== '' && start !== '') {
    return '';
  }
};

export const drinkWindowEndValidation = (start, end) => {
  const intStart = +start;
  const intEnd = +end;

  if (end === '' && start === '') {
    return '';
  }

  if (start !== '' && end === '') {
    return 'Must be filled with Start Date';
  }

  if (end !== '' && start === '') {
    return '';
  }

  if (start === end) {
    return "Dates don't have to be the same";
  }

  if (intStart > intEnd) {
    return 'End date must be greater than Start Date';
  }

  if (end !== '' && start !== '') {
    return '';
  }
};

function compareDrinkWindows(stateDate: string, backendDate: string) {
  const localState = stateDate === '' ? 1000 : moment.utc(new Date(stateDate)).get('year');

  const remoteState = moment.utc(new Date(backendDate)).get('year');

  return localState === remoteState;
}
