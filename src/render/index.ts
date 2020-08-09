import { Node } from '../types';

const IGNORE_PROPS = ['children'];

export default function render(element: Node, container: HTMLElement | Text) {
  let domElement: HTMLElement | Text;

  switch (element.type) {
    case 'TEXT_ELEMENT':
      domElement = document.createTextNode('');
      break;
    default:
      domElement = document.createElement(element.type);
  }

  Object.keys(element.props)
    .filter((k) => !IGNORE_PROPS.includes(k))
    .forEach((name) => {
      domElement[name] = element.props[name];
    });

  element.props.children.forEach((child) => {
    render(child, domElement);
  });

  container.appendChild(domElement);
}
