import React from 'react';

const Spinner = props => (
  <div className={`loader-animation ${props.alt ? 'alt' : ''}`}>
    <div className="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Spinner;
