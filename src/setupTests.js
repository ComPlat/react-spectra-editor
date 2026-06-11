const Enzyme = require('enzyme');
const AdapterModule = require('@wojtekmaj/enzyme-adapter-react-17');
const Adapter = AdapterModule.default || AdapterModule;

Enzyme.configure({ adapter: new Adapter() });
