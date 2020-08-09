import { Type, Props, Node } from '../types';
import createTextElement from '../createTextElement';

export default function (type: Type, props?: Props, ...children: Node[]): Node {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}
