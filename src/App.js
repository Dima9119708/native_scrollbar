import logo from './logo.svg';
import './App.css';
import NativeScroll from "./virtual-scroll/NativeScroll";
import {useEffect, useState} from "react";
import SimpleBar from 'simplebar-react';

function App() {
  const [count, setCounts] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setCounts((prevState) => {
        if (prevState > 1000) {
          return prevState
        }

        return prevState + 2
      })
    }, 200)
  }, [])

  return (
    <div className="App">
      <header className="App-header">

        <div className="navbar">
          sadsadsadasdsa
        </div>

        <div className="navbar">
          sadsadsadasdsa
        </div>

        <div className="navbar">
          sadsadsadasdsa
        </div>

        <NativeScroll style={{ maxHeight: 500 }}>
          <div className="wrapper">
            <div className="item">TEST 1</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            <div className="item">TEST 2</div>
            { !!count && Array.from({ length: count }).map((_, idx) =>  <div key={idx} className="item">TEST {idx}</div>) }
          </div>
        </NativeScroll>

        {/*<div style={{ overflowY: 'auto', maxHeight: 500 }}>*/}
        {/*  <div className="wrapper">*/}
        {/*    <div className="item">TEST 1</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    { !!count && Array.from({ length: count }).map((_, idx) =>  <div key={idx} className="item">TEST {idx}</div>) }*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="navbar">
          sadsadsadasdsa
        </div>

        <div className="navbar">
          sadsadsadasdsa
        </div>

        <div className="navbar">
          sadsadsadasdsa
        </div>
        <div className="navbar">
          sadsadsadasdsa
        </div>

        <div className="navbar">
          sadsadsadasdsa
        </div>

        <div className="navbar">
          sadsadsadasdsa
        </div>

        {/*<SimpleBar style={{ height: 600 }}>*/}
        {/*  <div className="wrapper">*/}
        {/*    <div className="item">TEST 1</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}

        {/*    /!*{ !!count && Array.from({ length: count }).map((_, idx) =>  <div key={idx} className="item">TEST {idx}</div>) }*!/*/}
        {/*  </div>*/}
        {/*</SimpleBar>*/}

        {/*<div style={{ overflowY: 'auto', height: 500 }}>*/}
        {/*  <div className="wrapper">*/}
        {/*    <div className="item">TEST 1</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    <div className="item">TEST 2</div>*/}
        {/*    { Array.from({ length: 100 }).map((_, idx) =>  <div key={idx} className="item">TEST {idx}</div>) }*/}
        {/*    /!*{ !!count && Array.from({ length: count }).map((_, idx) =>  <div key={idx} className="item">{idx}</div>) }*!/*/}
        {/*  </div>*/}
        {/*</div>*/}

      </header>
    </div>
  );
}

export default App;
