import Treact, { render } from 'treact';

const container = document.getElementById('root');

function updateValue(e) {
  renderer(e.target.value);
}

const Hello = ({ name }) => <h2>Hello {name}</h2>;

function renderer(value) {
  const elem = (
    <div>
      <input onInput={updateValue} value={value} />
      <Hello name={value} />
    </div>
  );

  render(elem, container);
}

renderer('World');
