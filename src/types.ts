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
