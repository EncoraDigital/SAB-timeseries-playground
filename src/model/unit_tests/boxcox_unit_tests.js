import {
  tensor1d, print, abs, sub, min, less,
} from '@tensorflow/tfjs-core';
import { boxCoxInvTransform, boxCoxTransform } from '../utils';

// Test runings
// Define simple time series
const timeseries = tensor1d([1, 2, 4, 6, 8, 5, 4, 5, 3, 9, 7, 5, 1]);
print(timeseries);

// compute logarithm transform. Evaluate the base case of the boxcox transform
const t0 = performance.now();
let boxcoxOut = boxCoxTransform(timeseries, 0);
const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);

// evaluate the common case of the boxcox transform
console.log('------------------------');
console.log('Boxcox power transform unit test.');
boxcoxOut = boxCoxTransform(timeseries, 1);
let error = abs(sub(boxcoxOut, sub(timeseries, 1)));

const tolerance = 0.00001;
let condition = min(less(error, tolerance)).dataSync();
if (condition === 1) {
  console.log('%c V - Passed! ', 'color: green');
} else {
  console.log('X - Failed!');
}

// ---------------------------------------------------------------------
console.log('------------------------');
console.log('inv boxcox transform unit test.');

const dataInvBoxcoxTest = tensor1d([1, 4, 10]);
const lambda = 1.4;

const invBoxcoxOut = boxCoxInvTransform(boxCoxTransform(dataInvBoxcoxTest, lambda), lambda);

error = abs(sub(invBoxcoxOut, dataInvBoxcoxTest));
condition = min(less(error, tolerance)).dataSync();

if (condition === 1) {
  console.log('%c V - Passed! ', 'color: green');
} else {
  console.log('X - Failed!');
  console.log(dataInvBoxcoxTest.dataSync());
  console.log(invBoxcoxOut.dataSync());
}
