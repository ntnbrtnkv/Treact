import { Fiber, Node } from '../types';

const IGNORE_PROPS = ['children'];

let nextUnitOfWork: Fiber | null = null;
let wipRoot: Fiber | null = null;
let currentRoot: Fiber | null = null;
let deletions: Fiber[] | null = null;

const isEvent = (key: string) => key.startsWith('on');
const isProp = (key: string) => !IGNORE_PROPS.includes(key) && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);

function reconcileChildren(wipFiber: Fiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling: Fiber | null = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber: Fiber | null = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions?.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

function updateFunctionComponent(fiber: Fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  reconcileChildren(fiber, fiber.props.children);
}

function performUnitOfWork(fiber: Fiber): Fiber {
  if (fiber.type instanceof Function) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function commitRoot() {
  deletions?.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function updateDom(dom: HTMLElement, prevProps, nextProps) {
  // remove old event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((key) => {
      dom.removeEventListener(key.toLowerCase().substring(2), prevProps[key]);
    });

  // add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((key) => {
      dom.addEventListener(key.toLowerCase().substring(2), nextProps[key]);
    });

  // remove old props
  Object.keys(prevProps)
    .filter(isProp)
    .filter(isGone(prevProps, nextProps))
    .forEach((key) => {
      dom[key] = '';
    });

  // set new props
  Object.keys(nextProps)
    .filter(isProp)
    .filter(isNew(prevProps, nextProps))
    .forEach((key) => {
      dom[key] = nextProps[key];
    });
}

function commitDeletion(fiber: Fiber, domParent: HTMLElement) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function commitWork(fiber: Fiber | null) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent?.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function createDom(fiber: Node) {
  let domElement: HTMLElement | Text;

  switch (fiber.type) {
    case 'TEXT_ELEMENT':
      domElement = document.createTextNode('');
      break;
    default:
      domElement = document.createElement(fiber.type);
  }

  updateDom(domElement, {}, fiber.props);

  return domElement;
}

export default function (element: Node, container: HTMLElement | null) {
  wipRoot = {
    dom: container,
    alternate: currentRoot,
    props: {
      children: [element],
    },
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}
