const React = require('react');

function host(name) {
  function Component(props) {
    return React.createElement(name, props, props.children);
  }
  Component.displayName = name;
  return Component;
}

jest.mock('react-native/jest/mocks/Text', () => {
  const ReactInner = require('react');
  const Text = (props) => ReactInner.createElement('Text', props, props.children);
  Text.displayName = 'Text';
  return { __esModule: true, default: Text };
});

jest.mock('react-native/Libraries/Text/Text', () => {
  const ReactInner = require('react');
  const Text = (props) => ReactInner.createElement('Text', props, props.children);
  Text.displayName = 'Text';
  return { __esModule: true, default: Text };
});

module.exports = { host };
