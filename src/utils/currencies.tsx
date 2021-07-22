export const currencies = (currency: string): string => {
  const sign: any = {
    ['USD']: '$',
    ['EUR']: '€',
    ['GBP']: '£',
  };
  return sign[currency] || currency;
};

export const volumes = (volume): string => {
  if (volume === 0) {
    return 'Unknown';
  }
  if (volume < 1) {
    return volume * 1000 + 'ml';
  }
  if (volume % 1 === 0) {
    return volume && Number(volume).toFixed(1) + ' L';
  }
  return volume + ' L';
};

export const formatPrice = (price: number) => {
  if (price === 0) {
    return 0;
  }
  return price.toFixed(2);
};

export const formatAvgPrice = (price: number) => {
  if (price === 0) {
    return 'Not Available';
  }
  return '$' + price.toFixed(2);
};

export const formatInventoryValuation = (price: number): string => {
  return price
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const revertBottleVolumes = (value: string) => {
  let tempValue = parseFloat(value);
  if (tempValue > 18) {
    return tempValue / 1000;
  } else {
    if (tempValue % 1 === 0) {
      return tempValue.toFixed(1);
    }
  }
  return tempValue;
};
