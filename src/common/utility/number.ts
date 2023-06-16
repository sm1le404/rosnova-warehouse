/**
 * @author: CHIKIRIAY
 * @created: 5/2/23
 * @Time: 1:09 AM
 */
/**
 *
 * Небольшая и быстрая библиотека JavaScript для десятичной арифметики произвольной точности.
 * https://github.com/MikeMcl/big.js/
 */
import Big, { BigSource } from 'big.js';

/**
 * Сложение 2х чисел с плавающей запятой
 * Используется для более точного вычисления
 *
 * @param x первое слагаемое
 * @param y второе слагаемое
 * @return сумма чисел x и y с большей точностью
 * Пример:
 * 0.1 + 0.2 = // JS -> 0.30000000000000004; Big -> 0.3
 */
export const plus = (x: BigSource, y: BigSource): number => {
  return new Big(x).plus(y).toNumber();
};

/**
 * Вычитание 2х чисел с плавающей запятой
 * Используется для более точного вычисления
 *
 * @param minuend Первое слагаемое (уменьшаемое)
 * @param subtrahend Второе слагаемое (вычитаемое)
 * @return Разность двух чисел с большей точностью
 * Пример:
 * 0.3 - 0.1  // JS -> 0.19999999999999998; Big -> 0.2
 */
export const minus = (minuend: BigSource, subtrahend: BigSource): number => {
  return new Big(minuend).minus(subtrahend).toNumber();
};

/**
 * Умнжение 2х чисел с плавающей запятой
 * Используется для более точного вычисления
 *
 * @param x первый множитель
 * @param y второй множитель
 * @return произведение
 */
export const multiply = (x: BigSource, y: BigSource): number => {
  return new Big(x).times(y).toNumber();
};
/**
 * Деление 2х чисел с плавающей запятой
 * Используется для более точного вычисления
 *
 * @param dividend Делимое число
 * @param divisor Делитель
 * @return Результат деления
 */
export const div = (dividend: BigSource, divisor: BigSource): number => {
  return new Big(dividend).div(divisor).toNumber();
};

/**
 * Округление чисел до (fractionDigits) знаков после запятой
 * Как метод .toFixed(...) у number, но возвращает число, а не строку
 *
 * @param x число, которое округлить
 * @param fractionDigits сколько знаков после запятой
 * @return округленное число, нули в конце после запятой просто пропадают
 */
export const toFixed = (x: number, fractionDigits?: number): number => {
  return +x.toFixed(fractionDigits);
};
