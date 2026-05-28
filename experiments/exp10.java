import React, { useState } from 'react';
import './App.css';

const App = () => {

const [count, setCount] = useState(0);

return (

<div className="counter-box">

<h1>React Counter</h1>

<h2 className={count > 0 ? 'pos' : count < 0 ? 'neg' : ''}>
{count}
</h2>

<div className="buttons">

<button onClick={() => setCount(count + 1)}>
Increment (+)
</button>

<button onClick={() => setCount(count - 1)}>
Decrement (-)
</button>

<button onClick={() => setCount(0)}>
Reset
</button>

</div>

</div>

);

};

export default App;