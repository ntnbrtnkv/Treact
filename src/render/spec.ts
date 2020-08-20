/**
 * @jest-environment jsdom
 */

import { TextNode, Node } from '../types';
import render from '.';

describe('render', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('should render text node', () => {
    const node: TextNode = {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: 'test',
        children: [],
      },
    };
    render(node, document.getElementById('root'));
    expect(document.getElementById('root')?.innerHTML).toEqual('test');
  });

  it('should render regular node', () => {
    const node: Node = {
      type: 'span',
      props: {
        children: [
          {
            type: 'TEXT_ELEMENT',
            props: {
              children: [],
              nodeValue: 'test2',
            },
          },
        ],
      },
    };
    render(node, document.getElementById('root'));
    expect(document.getElementById('root')?.innerHTML).toEqual(
      '<span>test2</span>'
    );
  });

  it('should apply props as attributes', () => {
    const node: Node = {
      type: 'span',
      props: {
        children: [],
        id: '123',
      },
    };

    render(node, document.getElementById('root'));

    const expected = document.getElementById('123');
    expect(expected).toBeTruthy();
    expect(expected?.tagName).toBe('SPAN');
  });

  it('should exit correctly on null container', () => {
    const node: Node = {
      type: 'span',
      props: {
        children: [],
        id: '123',
      },
    };

    render(node, document.getElementById('__root__'));

    const expected = document.getElementById('123');
    expect(expected).toBeFalsy();
  });
});
