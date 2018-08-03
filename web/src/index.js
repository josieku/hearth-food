import React from 'react';
import ReactDOM from 'react-dom';
import MapContainer from './components/maps/MapContainer'
import App from './components/general/App';
import './../public/index.css';

ReactDOM.render(
  <div style={{height: '100vh', width: '100vw'}}>
    <MapContainer />
  </div>,
  document.getElementById('root')
);
