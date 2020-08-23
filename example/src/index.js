import Treact, { render } from 'treact';

const container = document.getElementById('root');

function updateValue(e) {
  renderer(e.target.value);
}

function renderer(value) {
  const elem = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );

  render(elem, container);
}

renderer('World');
