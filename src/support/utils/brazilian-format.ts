import { format, unformat } from 'v-money3';

export const configMoneyMask = {
  debug: false,
  masked: false,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  decimal: ',',
  precision: 2,
  disableNegative: true,
  disabled: false,
  min: null,
  max: 100000,
  allowBlank: true,
  minimumNumberOfCharacters: 0,
  shouldRound: false,
  modelModifiers: {
    number: false,
  },
};

export const convertStringToNumber = (amount: string): number => {
  return +parseFloat(amount).toFixed(2);
};

export const correctVMoneyBug = (amount: number): number => {
  const value = String(amount);
  if (value.indexOf('.') === -1) {
    return amount * 100;
  }

  if (value.split('.')[1].length === 0) {
    return amount * 100;
  }

  if (value.split('.')[1].length === 1) {
    return amount * 10;
  }

  return amount;
};

export const unformatMoneyMask = (amount: string): string | number => {
  return unformat(amount, configMoneyMask);
};

export const formatMoneyMask = (amount: number | string) => {
  return format(amount, configMoneyMask);
};

export const formatToBRDate = (date: Date | string | undefined | null): string => {
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    return new Intl.DateTimeFormat('pt-br', { dateStyle: 'short', timeStyle: 'short' }).format(
      Date.parse(date)
    );
  }

  return new Intl.DateTimeFormat('pt-br', { dateStyle: 'short', timeStyle: 'short' }).format(date);
};

export const formatToBRCurrency = (value: string | number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value as number
  );
};
