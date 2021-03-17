import React from 'react';

export function User(props) {
  const foo = props;
  return (
    <div>
      <li>{foo.value}</li>
    </div>
  );
}
