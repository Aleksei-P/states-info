import './App.css';
import { useState, useEffect } from 'react';
import { states } from './components/Flags.js'


function App() {

  const [info, setInfo] = useState([]);
  const [flag, setFlag] = useState(" ");
  const [buttonClicked, setButtonCliked] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest");
        const json = await response.json();
        setInfo(json.data[Math.floor(Math.random() * json.data.length)]);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
    setButtonCliked(false)
  }, [buttonClicked]);

  useEffect(() => {
    async function findState(data) {
      let stateName = await states.find((el) => el.name === data["ID State"]);

      setFlag(stateName.image);
    }
    findState(info);
  }, [info]);


  return (
    <div className="App">
      {Object.keys(info).length ? (
        <div className="state-info">
          <p> State - {info.State} </p>
          <p> Population (people) - {new Intl.NumberFormat("en-GB").format(info.Population)} </p>
          <p> Year - {info.Year} </p>
          <button className="button" onClick={() => setButtonCliked(true)}>
            Next Random State
          </button>
        </div>
      ) : (
        "Loading"
        )}
        <div className="flag" style={{ backgroundImage: `url(${flag})` }}></div>
    </div>
  );
}

export default App;