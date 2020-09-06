import Treact, { render, useState } from 'treact';

const container = document.getElementById('root');

function updateValue(e) {
  renderer(e.target.value);
}

function Counter() {
  const [state, setState] = useState(0);

  return (
    <button onClick={() => setState((s) => s + 1)}>Clicks: {state}</button>
  );
}

const Hello = ({ name }) => <h2>Hello {name}</h2>;

function renderer(value) {
  const elem = (
    <div>
      <input onInput={updateValue} value={value} />
      <Hello name={value} />
      <Counter />
    </div>
  );

  render(elem, container);
}

renderer('World');
