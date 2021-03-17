import React from "react";

export function Rank(props) {
  const foo = props;
  return (
    <tr>
      <td>{foo.value}</td>
      <td>{foo.data}</td>
    </tr>
  );
}
// export default Rank;
