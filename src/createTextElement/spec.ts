import createTextElement from '.';

describe('createElement', () => {
  it('should create element with tag only', () => {
    expect(createTextElement('text')).toEqual({
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: 'text',
        children: [],
      },
    });
  });
});
