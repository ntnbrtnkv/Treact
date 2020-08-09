import createElement from '.';
import { Node } from '../types';

describe('createElement', () => {
  it('should create element with tag only', () => {
    expect(createElement('div')).toEqual({
      type: 'div',
      props: {
        children: [],
      },
    });
  });

  it('should create element with props', () => {
    expect(createElement('div', { p: 1 })).toEqual({
      type: 'div',
      props: {
        children: [],
        p: 1,
      },
    });

    const obj = {};

    expect(createElement('div', { p: obj })).toEqual({
      type: 'div',
      props: {
        children: [],
        p: obj,
      },
    });
  });

  it('should create element with children', () => {
    const node: Node = {
      type: 'a',
      props: {
        children: [],
      },
    };
    expect(createElement('div', {}, node)).toEqual({
      type: 'div',
      props: {
        children: [node],
      },
    });
    expect(createElement('div', {}, node, node)).toEqual({
      type: 'div',
      props: {
        children: [node, node],
      },
    });
    expect(createElement('div', { prop: 'test' }, node)).toEqual({
      type: 'div',
      props: {
        prop: 'test',
        children: [node],
      },
    });
  });

  it('should create element with recursing createElement children', () => {
    expect(createElement('div', null, createElement('a'))).toEqual({
      type: 'div',
      props: {
        children: [
          {
            type: 'a',
            props: {
              children: [],
            },
          },
        ],
      },
    });
  });

  it('should create element with text child', () => {
    expect(createElement('div', null, 'text')).toEqual({
      type: 'div',
      props: {
        children: [
          {
            type: 'TEXT_ELEMENT',
            props: {
              children: [],
              nodeValue: 'text',
            },
          },
        ],
      },
    });
  });
});
