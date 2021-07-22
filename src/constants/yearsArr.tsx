//Creating array for picker
export const yearsArr = () => {
  let currentYear = new Date().getFullYear();
  let years = [];
  let startYear = 1800;

  while (startYear <= currentYear) {
    years.push(startYear++);
  }

  years = ['NV', ...years.sort((a, b) => b - a)];

  return years;
};

export const getStringYearsArr = () => {
  let currentYear = new Date().getFullYear();
  let years = [];
  let startYear = 1800;

  while (startYear <= currentYear) {
    years.push('' + startYear++);
  }

  years = ['NV', ...years.sort((a, b) => b - a)];

  return years;
};

export const getYearRange = (start, end): string[] => {
  let years = [];

  for (let i = start; i <= end; i++) {
    years.push(`${i}`);
  }

  years = years.sort((a, b) => b - a);

  return years;
};
