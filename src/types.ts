export type Type = 'TEXT_ELEMENT' | string;

export type Props = Object;

export type Node = {
  type: Type;
  props: {
    children: Node[];
  };
};

export type TextNode = {
  type: 'TEXT_ELEMENT';
  props: {
    nodeValue: string;
    children: Node[];
  };
};
