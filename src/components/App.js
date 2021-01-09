import React from "react";
import Top from "./Top";
import Bottom from "./Bottom";
import Main from "./Main";

function App(){

  return(
    <>
    <div className="top-container">
      <Top />
      <Main />
    </div>
    <Bottom />
  </>
  );
}

export default App;
