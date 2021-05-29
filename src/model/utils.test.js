import {
  tensor1d, print, abs, sub, min, less,
} from '@tensorflow/tfjs-core';
import { boxCoxInvTransform, boxCoxTransform } from './utils';

test('Boxcox power transform unit test.', () => {
  const timeseries = tensor1d([1, 2, 4, 6, 8, 5, 4, 5, 3, 9, 7, 5, 1]);
  print(timeseries);

  // compute logarithm transform. Evaluate the base case of the boxcox transform
  const t0 = performance.now();
  let boxcoxOut = boxCoxTransform(timeseries, 0);
  const t1 = performance.now();
  expect(t1 - t0).toBeLessThan(5);

  // evaluate the common case of the boxcox transform
  boxcoxOut = boxCoxTransform(timeseries, 1);
  const error = abs(sub(boxcoxOut, sub(timeseries, 1)));

  const tolerance = 0.00001;
  const condition = min(less(error, tolerance)).dataSync();
  expect(condition[0]).toBe(1);
});

test('Inv boxcox transform unit test.', () => {
  const tolerance = 0.00001;

  const dataInvBoxcoxTest = tensor1d([1, 4, 10]);
  const lambda = 1.4;

  const boxcoxOut = boxCoxTransform(dataInvBoxcoxTest, lambda);
  const invboxcoxOut = boxCoxInvTransform(boxcoxOut, lambda);

  const error = abs(sub(invboxcoxOut, dataInvBoxcoxTest));
  const condition = min(less(error, tolerance)).dataSync();

  expect(condition[0]).toBe(1);
});
