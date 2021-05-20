import * as tf from '@tensorflow/tfjs';
import { boxCoxInvTransform, boxCoxTransform } from '../utils';

// Test runings
// Define simple time series
const timeseries = tf.tensor1d([1, 2, 4, 6, 8, 5, 4, 5, 3, 9, 7, 5, 1]);
tf.print(`Input series: ${timeseries}`);

// compute logarithm transform. Evaluate the base case of the boxcox transform
const t0 = performance.now();
let boxcoxOut = boxCoxTransform(timeseries, 0);
const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);

// evaluate the common case of the boxcox transform
console.log('------------------------');
console.log('Boxcox power transform unit test.');
boxcoxOut = boxCoxTransform(timeseries, 1);
let error = tf.abs(tf.sub(boxcoxOut, tf.sub(timeseries, 1)));

const tolerance = 0.00001;
let condition = tf.min(tf.less(error, tolerance)).dataSync();
if (condition === 1) {
  console.log('%c V - Passed! ', 'color: green');
} else {
  console.log('X - Failed!');
}

// ---------------------------------------------------------------------
console.log('------------------------');
console.log('inv boxcox transform unit test.');

const data_inv_boxcox_test = tf.tensor1d([1, 4, 10]);
const lambda_ = 1.4;

const boxcox_out = boxCoxTransform(data_inv_boxcox_test, lambda_);
const invboxcox_out = boxCoxInvTransform(boxcox_out, lambda_);

error = tf.abs(tf.sub(invboxcox_out, data_inv_boxcox_test));
condition = tf.min(tf.less(error, tolerance)).dataSync();

if (condition === 1) {
  console.log('%c V - Passed! ', 'color: green');
} else {
  console.log('X - Failed!');
  console.log(data_inv_boxcox_test.dataSync());
  console.log(invboxcox_out.dataSync());
}
