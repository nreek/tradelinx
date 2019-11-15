import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-localstorage-mock';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import translations from './src/lang';

Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.mount = mount;

// Custom function to mount a component with a defined store
global.mountWithStore = (component, store) => {
  const options = {
    context: {
      store,
      router: {
        history: new BrowserRouter().history,
        route: {
          location: {},
          match: {},
        },
      },
    },
    childContextTypes: { store: PropTypes.object.isRequired, router: PropTypes.object.isRequired },
  };
  return mount(component, options);
};

// Make window._t available.
window._t = translate(translations.en);

function translate(translations) {
  const replaceVariables = (str, variables) => {
    Object.keys(variables).forEach((prop) => {
      str = str.replace(new RegExp(`{${prop}}`, 'g'), variables[prop] || '');
    });
    return str;
  };

  return (str, translationKey, variables) => {
    const [path, key] = translationKey.split('.');
    if (translations[path] && translations[path][key]) {
      let translation = translations[path][key];
      if (translations && variables) {
        translation = replaceVariables(translation, variables);
      }
      return translation;
    }
    if (variables) {
      str = replaceVariables(str, variables);
    }
    return str;
  };
}
