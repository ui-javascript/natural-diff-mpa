import React, {useState, useLayoutEffect, useEffect} from 'react'
import ReactDOM from 'react-dom'
 

function App() {
    const [width, setWidth] = useState(0);
    
    // DOM更新马上同步调用
    useLayoutEffect(() => {
      const $title = document.querySelector("#title");
      const titleWidth = $title.getBoundingClientRect().width;
      
      console.log("useLayoutEffect");
      
      if (width !== titleWidth) {
        // setTimeout(() => {
            setWidth(titleWidth);
        // }, 2000)
      }
    });
    
    useEffect(() => {
      console.log("useEffect");
    });

    return (
      <div>
        <h1 id="title">hello</h1>
        <h2>{ width }</h2>
      </div>
    );
  }

  ReactDOM.render(<App />, document.getElementById("root"))

