import { Node } from '../types';

const IGNORE_PROPS = ['children'];

function _render(element: Node, container: HTMLElement | Text) {
  let domElement: HTMLElement | Text;

  switch (element.type) {
    case 'TEXT_ELEMENT':
      domElement = document.createTextNode('');
      break;
    default:
      domElement = document.createElement(element.type);
  }

  Object.keys(element.props)
    .filter((prop) => !IGNORE_PROPS.includes(prop))
    .forEach((name) => {
      (domElement as any)[name] = element.props[name];
    });

  element.props.children.forEach((child) => {
    _render(child, domElement);
  });

  container.appendChild(domElement);
}

export default function (element: Node, container: HTMLElement | null) {
  if (container === null) return;
  _render(element, container);
}
