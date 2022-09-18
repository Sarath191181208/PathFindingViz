const { useState, useEffect, useCallback, useRef } = React;
const { createRoot } = ReactDOM;


const root = createRoot(document.getElementById("root"));
root.render(<Main />);

function Main() {
  return (
    <Conway/>
  );
}
