export type Type = 'TEXT_ELEMENT' | string;

export type Props = Object;

export type TextNode = {
  type: 'TEXT_ELEMENT';
  props: {
    nodeValue: string;
    children: Node[];
  };
};

export type Node =
  | TextNode
  | {
      type: Type;
      props: {
        children: Node[];
        [key: string]: any;
      };
    };

export type Fiber = Node & {
  dom: HTMLElement | Text | null;
  sibling?: Fiber;
  child?: Fiber;
  parent: Fiber;
  hooks?: any[];
  alternate?: Fiber | null;
  effectTag?: 'UPDATE' | 'PLACEMENT' | 'DELETION';
  props: {
    children: Fiber[];
  };
};
