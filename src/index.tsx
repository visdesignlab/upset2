import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Upset } from './Upset';
import whyDidYouRender from '@welldone-software/why-did-you-render';

if (process.env.NODE_ENV !== 'production') {
  whyDidYouRender(React);
}

ReactDOM.render(<Upset />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
