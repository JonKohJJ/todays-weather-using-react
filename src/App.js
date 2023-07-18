import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState, useRef } from 'react';

function App() {

  // store user input as a ref
  const refCountry = useRef();

  // store user input in a state
  const [result, setResult] = useState([]);
  const [notFound, setNotFound] = useState(false);
  
  // function to fetch weather data once user submits the country or searches the country again
  async function onSubmit(e, country){
    e.preventDefault();
    try{

      const res = await axios.get("https://api.openweathermap.org/data/2.5/weather?q="+ country +"&APPID=0fdc955e122adf4cc662101c34f94847&units=metric");
      setNotFound(false);

      // get timestamp
      const date = new Date();
      const time = formatAMPM(date);
      let new_date = ("0" + date.getDate()).slice(-0,2) 
                      + "-" + ("0" + date.getMonth()).slice(-0,2) 
                      + "-" + date.getFullYear()
                      + " " + time;

      setResult([{...res.data, search_timestamp:new_date}]);
      // add result to the previous searches
      setSearches([...searches, {...res.data, search_timestamp:new_date}])

    }catch(err){
      console.log("err: ", err);
      setNotFound(true);
    }
  }

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  // store previous user input in a state 
  const [searches, setSearches] = useState([]);

  // function to delete search
  function onDelete(index){
    setSearches(prev => {
      return prev.filter((item, currentIndex) => currentIndex !== index)
    })

  }
  
  return (
    <div className="App">

      <p>Today's Weather</p>

      <div className='search'>
        <form onSubmit={(e) => {onSubmit(e, refCountry.current.value)}}>

          <input 
            type='text' 
            placeholder='Country' 
            ref={refCountry}
          >
          </input>

          <input type='submit'>
          </input>

        </form>
      </div>

      <div className='content'>

        {
          notFound ? <p>Not Found</p> :
          result.map(res => {
            return(
              <div className='result' key={res.coor}>
                <p className='temp'>Temp:{res.main.temp}</p>
                <p className='temp'>High:{res.main.temp_max}</p>
                <p className='temp'>Low:{res.main.temp_min}</p>
                <p className='temp'>Location:{res.name}, {res.sys.country}</p>
                <p className='temp'>Timestamp:{res.search_timestamp}</p>
                <p className='temp'>Humidity:{res.main.humidity}</p>
                <p className='temp'>Clouds:{res.weather[0].description}</p>
              </div>
            )
          })
        }


        <div className='previous-searches'>
          <p>Search History</p>
          <ul>
            {
              searches.map((search, index) => {
                return(
                  <li key={index}>
                    <p>{index} / {search.name}, {search.sys.country}</p>
                    <p>{search.search_timestamp}</p>

                    <button value={search.name} onClick={(e) => {onSubmit(e, e.target.value)}}>Search</button>

                    <button onClick={() => {
                      onDelete(index)
                    }}>Delete</button>
                    
                  </li>
                )
              })
            }
          </ul>
        </div>

      </div>

    </div>
  );
}

export default App;
