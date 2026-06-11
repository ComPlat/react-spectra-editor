const { TextDecoder, TextEncoder } = require('util');

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

const Enzyme = require('enzyme');
const AdapterModule = require('@wojtekmaj/enzyme-adapter-react-17');
const Adapter = AdapterModule.default || AdapterModule;

Enzyme.configure({ adapter: new Adapter() });
