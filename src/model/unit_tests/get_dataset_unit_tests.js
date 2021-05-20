/* eslint-disable no-console */
import * as tf from '@tensorflow/tfjs';
import { formatDataset } from '../utils';

// Test runings
// Define simple time series
const data = tf.tensor([10, 8, 2, 3, 4, 5, 2, 4, 2, 3, 5, 6, 7, 10]);
tf.print(`Input series: ${data}`);

function testFormatDatasetFunction(testOutputX, testOutputY, targetX, targetY) {
  const cond1 = tf.all(tf.equal(testOutputX, tf.tensor2d(targetX))).dataSync();
  const cond2 = tf.all(tf.equal(testOutputY, tf.tensor1d(targetY))).dataSync();

  if ((cond1 === true) && (cond2 === true)) {
    console.log('%c V - Passed! ', 'color: green');
  } else {
    console.log('%c X - Failed!', 'color: red');
    testOutputX.print();
    testOutputY.print();
  }
}

console.log('------------------------');
console.log('formatDataset() unit test 1.');

let batch = formatDataset(data, 2, 1, 12);
testFormatDatasetFunction(batch.X, batch.y, [[10, 5, 6], [8, 6, 7]], [7, 10]);

console.log('------------------------');
console.log('formatDataset() unit test 2.');

let p = 4;
let P = 0;
let freq = 4;
batch = formatDataset(data, p, P, freq);
testFormatDatasetFunction(batch.X, batch.y, [[10, 8, 2, 3],
  [8, 2, 3, 4],
  [2, 3, 4, 5],
  [3, 4, 5, 2],
  [4, 5, 2, 4],
  [5, 2, 4, 2],
  [2, 4, 2, 3],
  [4, 2, 3, 5],
  [2, 3, 5, 6],
  [3, 5, 6, 7]], [4, 5, 2, 4, 2, 3, 5, 6, 7, 10]);

console.log('------------------------');
console.log('formatDataset() unit test 3.');
batch = formatDataset(data, p = 1, P = 3, freq = 4);
testFormatDatasetFunction(batch.X, batch.y, [[10, 4, 2, 6], [8, 5, 3, 7]], [7, 10]);

console.log('------------------------');
console.log('formatDataset() unit test 4.');

batch = formatDataset(data, p = 10, P = 3, freq = 4);
testFormatDatasetFunction(batch.X, batch.y, [[10, 2, 3, 4, 5, 2, 4, 2, 3, 5, 6], [8, 3, 4, 5, 2, 4, 2, 3, 5, 6, 7]], [7, 10]);

console.log('------------------------');
console.log('formatDataset() unit test 5.');

batch = formatDataset(data, p = 13, P = 3, freq = 4);
testFormatDatasetFunction(batch.X, batch.y, [[10, 8, 2, 3, 4, 5, 2, 4, 2, 3, 5, 6, 7]], [10]);

console.log('------------------------');
console.log('formatDataset() unit test 6.');

batch = formatDataset(data, p = 0, P = 3, freq = 4);
testFormatDatasetFunction(batch.X, batch.y, [[10, 4, 2], [8, 5, 3]], [7, 10]);

console.log('------------------------');
console.log('formatDataset() unit test 7.');
batch = formatDataset(data, p = 1, P = 0, freq = 4);
testFormatDatasetFunction(batch.X, batch.y, [[10], [8], [2], [3], [4], [5], [2], [4], [2], [3], [5], [6], [7]], [8, 2, 3, 4, 5, 2, 4, 2, 3, 5, 6, 7, 10]);

console.log('------------------------');
console.log('formatDataset() unit test 8.');
batch = formatDataset(data, 2, 1, 4);
let targetX = [[10, 2, 3],
  [8, 3, 4],
  [2, 4, 5],
  [3, 5, 2],
  [4, 2, 4],
  [5, 4, 2],
  [2, 2, 3],
  [4, 3, 5],
  [2, 5, 6],
  [3, 6, 7]];
let targetY = [4, 5, 2, 4, 2, 3, 5, 6, 7, 10];
testFormatDatasetFunction(batch.X, batch.y, targetX, targetY);

console.log('------------------------');
console.log('formatDataset() unit test 9.');
batch = formatDataset(data, 4, 2, 4);
targetX = [[10, 4, 5, 2, 4],
  [8, 5, 2, 4, 2],
  [2, 2, 4, 2, 3],
  [3, 4, 2, 3, 5],
  [4, 2, 3, 5, 6],
  [5, 3, 5, 6, 7]];
targetY = [2, 3, 5, 6, 7, 10];
testFormatDatasetFunction(batch.X, batch.y, targetX, targetY);

console.log('------------------------');
console.log('formatDataset() unit test 10.');
batch = formatDataset(data, 4, 1, 4);

targetX = [[10, 8, 2, 3],
  [8, 2, 3, 4],
  [2, 3, 4, 5],
  [3, 4, 5, 2],
  [4, 5, 2, 4],
  [5, 2, 4, 2],
  [2, 4, 2, 3],
  [4, 2, 3, 5],
  [2, 3, 5, 6],
  [3, 5, 6, 7]];
targetY = [4, 5, 2, 4, 2, 3, 5, 6, 7, 10];
testFormatDatasetFunction(batch.X, batch.y, targetX, targetY);

console.log('------------------------');
console.log('formatDataset() unit test 11.');
batch = formatDataset(data, 2, 2, 4);
targetX = [[10, 4, 2, 4],
  [8, 5, 4, 2],
  [2, 2, 2, 3],
  [3, 4, 3, 5],
  [4, 2, 5, 6],
  [5, 3, 6, 7]];
targetY = [2, 3, 5, 6, 7, 10];
testFormatDatasetFunction(batch.X, batch.y, targetX, targetY);

console.log('------------------------');
console.log('formatDataset() unit test 12.');
batch = formatDataset(data, 6, 1, 4);
targetX = [[10, 8, 2, 3, 4, 5],
  [8, 2, 3, 4, 5, 2],
  [2, 3, 4, 5, 2, 4],
  [3, 4, 5, 2, 4, 2],
  [4, 5, 2, 4, 2, 3],
  [5, 2, 4, 2, 3, 5],
  [2, 4, 2, 3, 5, 6],
  [4, 2, 3, 5, 6, 7]];
targetY = [2, 4, 2, 3, 5, 6, 7, 10];
testFormatDatasetFunction(batch.X, batch.y, targetX, targetY);

console.log('------------------------');
console.log('formatDataset() unit test 13.');

batch = formatDataset(data, 6, 2, 4);
targetX = [[10, 2, 3, 4, 5, 2, 4],
  [8, 3, 4, 5, 2, 4, 2],
  [2, 4, 5, 2, 4, 2, 3],
  [3, 5, 2, 4, 2, 3, 5],
  [4, 2, 4, 2, 3, 5, 6],
  [5, 4, 2, 3, 5, 6, 7]];
targetY = [2, 3, 5, 6, 7, 10];
testFormatDatasetFunction(batch.X, batch.y, targetX, targetY);

console.log('------------------------');
console.log('formatDataset() unit test 14.');

batch = formatDataset(data, 3, 0, 4);
targetX = [[10, 8, 2],
  [8, 2, 3],
  [2, 3, 4],
  [3, 4, 5],
  [4, 5, 2],
  [5, 2, 4],
  [2, 4, 2],
  [4, 2, 3],
  [2, 3, 5],
  [3, 5, 6],
  [5, 6, 7]];
targetY = [3, 4, 5, 2, 4, 2, 3, 5, 6, 7, 10];
testFormatDatasetFunction(batch.X, batch.y, targetX, targetY);
