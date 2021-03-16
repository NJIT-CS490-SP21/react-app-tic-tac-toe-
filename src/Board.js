import React from 'react';
// import PropTypes from 'prop-types';

export function Board(props) {
  const foo = props;

  return (
    <div
      role="button"
      tabIndex={0}
      className="box"
      onClick={foo.name}
      onKeyDown={null}
    >
      {foo.value}
    </div>
  );
}
