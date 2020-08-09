import { TextNode } from '../types';

export default function (text: string): TextNode {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
