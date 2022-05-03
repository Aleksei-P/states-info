import './App.css';
import { useState, useEffect } from 'react';
import { states } from './components/Flags.js'

function App() {

  const [info, setInfo] = useState([]);
  const [state, setState] = useState(0)
  const [flag, setFlag] = useState("");

  useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch("https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest");
          const json = await response.json();
          setInfo(json.data);
        } catch (e) {
          console.error(e);
        }
      }
      fetchData();
    }, []);

     function randomState(data) {
       setState([Math.floor(Math.random() * data.length)]);
    }

    useEffect(() => {
      const blurClass =  document.getElementById("blurring");
      let load = 100;
      if (info[state]) {
        let int = setInterval(blurring, 25);
        function blurring() {
          load--;
          if (load < 1) {
            clearInterval(int);
          }
          blurClass.style.filter = `grayscale(${load}%)`;
        }
        // const scale = (num, in_min, in_max, out_min, out_max) => {
        //   return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
        // };
      }
    }, [state, info]);

  useEffect(() => {
    if (info[state]) {
    function findState(data) {
        let stateName = states.find((el) => el.name === data["ID State"]);
        setFlag(stateName.image);
      }
      findState(info[state]);
    }
  }, [state, info]);

  return (
    <div className="App">
      {Object.keys(info).length !== 0 ? (
        <div className="state-info">
          <p> State - {info[state].State} </p>
          <p> Population (people) - {new Intl.NumberFormat("en-GB").format(info[state].Population)} </p>
          <p> Year - {info[state].Year} </p>
          <button className="button" onClick={() => randomState(info)}>
            Next Random State
          </button>
        </div>
      ) : (
        "Loading"
      )}
      <div className="flag" id="blurring" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${flag})` }}></div>
    </div>
  );
}

export default App;