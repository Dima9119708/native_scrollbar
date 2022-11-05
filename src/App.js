import logo from './logo.svg';
import './App.css';
import NativeScroll from "./virtual-scroll/NativeScroll";
import {useEffect, useState} from "react";
import SimpleBar from 'simplebar-react';

function App() {
  const [count, setCounts] = useState(0)

  useEffect(() => {
    // setInterval(() => {
    //   setCounts((prevState) => prevState + 2)
    // }, 200)
  }, [])

  return (
    <div className="App">
      <header className="App-header">

      <div style={{ height: 500 }}>
        <NativeScroll>
          <div className="wrapper">
            <div className="item">TEST 1</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            { Array.from({ length: 200 }).map((_, idx) =>  <div key={idx} className="item">TEST {idx}</div>) }

            { count && Array.from({ length: count }).map((_, idx) =>  <div key={idx} className="item">{idx}</div>) }
          </div>
        </NativeScroll>
      </div>

        <SimpleBar style={{ width: 500, height: 500 }}>
          <div className="wrapper">
            <div className="item">TEST 1</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            { Array.from({ length: 100 }).map((_, idx) =>  <div key={idx} className="item">TEST {idx}</div>) }
            { !!count && Array.from({ length: count }).map((_, idx) =>  <div key={idx} className="item">{idx}</div>) }
          </div>
        </SimpleBar>

      </header>
    </div>
  );
}

export default App;
