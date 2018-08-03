import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MapContainer from './components/maps/MapContainer'

ReactDOM.render(
  <div style={{height: '100vh', width: '100vw'}}>
    <MapContainer />
  </div>,
  document.getElementById('root')
);
