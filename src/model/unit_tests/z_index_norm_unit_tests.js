import {
  tensor1d, print, abs, sub, min, less,
} from '@tensorflow/tfjs-core';
import { zIndexInvTransform, zIndexTransform } from '../utils';

const timeseries = tensor1d([1, 2, 4, 6, 8, 5, 4, 5, 3, 9, 7, 5, 1]);
const tolerance = 0.000001;

print(timeseries);

// ---------------------------------------------------------------------
console.log('------------------------');
console.log('z index_normalization unit test.');
const target = tensor1d([-1.50443334, -1.08831348, -0.25607376, 0.57616596, 1.40840568, 0.1600461, -0.25607376, 0.1600461, -0.67219362, 1.82452554, 0.99228582, 0.1600461, -1.50443334]);

const result = zIndexTransform(timeseries);
console.log(`mean: ${result.mean}`);
console.log(`std: ${result.std}`);
let error = abs(sub(result.data, target));
let condition = min(less(error, tolerance)).dataSync();

if (condition === 1) {
  console.log('%c V - Passed! ', 'color: green');
} else {
  console.log('X - Failed!');
}

// ---------------------------------------------------------------------
console.log('------------------------');
console.log('inv z index_normalization unit test.');

const dataDenorm = zIndexInvTransform(result.data, result.mean, result.std);

error = abs(sub(dataDenorm, timeseries));
condition = min(less(error, tolerance)).dataSync();

if (condition === 1) {
  console.log('%c V - Passed! ', 'color: green');
} else {
  console.log('X - Failed!');
}
