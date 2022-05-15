import "./App.css";
import { useState, useEffect } from "react";
import { states } from "./utils/Flags.js";

function App() {
  const [info, setInfo] = useState([]);
  const [state, setState] = useState(0);
  const [flag, setFlag] = useState("");
  const [weather, setWeather] = useState({});

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
    if (info[state]) {
      async function findState(data) {
        let stateName = await states.find((el) => el.name === data["ID State"]);
        setFlag(stateName.image);
      }

      async function findWeather() {
        try {
          const weatherAPI = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${info[state]["State"]}&units=imperial&appid=038e7afc2a1e68b9343e4467ba7853b1`);
          const weatherJson = await weatherAPI.json();
          setWeather(weatherJson);
        } catch (e) {
          console.error(e);
        }
      }
      findState(info[state]);
      findWeather();
    }
  }, [state, info]);

  return (
    <div className="App">
      {Object.keys(info).length !== 0 && Object.keys(weather).length !== 0 ? (
        <div className="state-info">
          <div className="state-info-block">
            <p> State - {info[state].State} </p>
            <p> Population (people) - {new Intl.NumberFormat("en-GB").format(info[state].Population)} </p>
            <p> Year - {info[state].Year} </p>
          </div>
          <div className="state-info-block">
            <p> Temperature - {weather.main.temp} F</p>
            <p> Humidity - {weather.main.humidity} %</p>
            <p> Wind - {weather.wind.speed} miles/hour</p>
          </div>
          <button
            className="button"
            id="buttonClick"
            disabled={false}
            onClick={() => {
              randomState(info);
              document.getElementById("buttonClick").disabled = true;
              setTimeout(function () {
                document.getElementById("buttonClick").disabled = false;
              }, 3000);
              if (!document.getElementById("blurring").classList.add("flag_filter")) {
                document.getElementById("blurring").classList.add("flag_filter");
              }
            }}
          >
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

//cloud icon
//<img src={"https://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png"}></img>
