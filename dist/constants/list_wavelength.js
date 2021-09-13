'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CuKalpha = {
  name: 'CuKalpha',
  value: 0.15406,
  label: 'Cu K-alpha',
  unit: 'nm'
};

var Fe = {
  name: 'Fe',
  value: 0.19373,
  label: 'Fe',
  unit: 'nm'
};

var Co = {
  name: 'Co',
  value: 0.17902,
  label: 'Co',
  unit: 'nm'
};

var MoKalpha = {
  name: 'MoKalpha',
  value: 0.07107,
  label: 'Mo K-alpha',
  unit: 'nm'
};

var LIST_WAVE_LENGTH = [CuKalpha, Fe, Co, MoKalpha];

exports.LIST_WAVE_LENGTH = LIST_WAVE_LENGTH;