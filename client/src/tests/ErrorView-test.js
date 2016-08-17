import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import ErrorView from '../components/ErrorView';

describe('ErrorView', () => {
  it('renders without problems', function () {
    let error = TestUtils.renderIntoDocument(<ErrorView />);
    expect(error).toExist();
  });
});
