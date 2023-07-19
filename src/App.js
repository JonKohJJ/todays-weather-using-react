import './App.css';
import axios from 'axios';
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import sun from './images/sun.png';

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

      console.log("country: ", res.data.weather);

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

      <div className='container'>


          <div className='search'>
            
            <form onSubmit={(e) => {onSubmit(e, refCountry.current.value)}}>

              <div className='search-input-div'>
                <p className='caption'>Country</p>
                <input 
                  className='country-input'
                  type='text'
                  ref={refCountry}
                >
                </input>
              </div>
              
              <button type='submit' className='btn-submit'>
                  <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#ffffff",}}/>
              </button>

            </form>
          </div>

          <div className='content'>
            <img className='sun-icon' src={sun} />
            <p className='title'>Today's Weather</p>
            {
              notFound ? <p className='not-found'>Not Found</p> :
              result.map(res => {
                return(
                  
                  <div className='flex-div result' key={res.coor}>

                    <div className='left'>
                        <p className='result-temp'>{Math.round(res.main.temp)}&deg;</p>

                        <div className='flex-div'>
                            <p className='result-high'>H: {Math.round(res.main.temp_max)}&deg;</p>
                            <p className='result-low'>L: {Math.round(res.main.temp_min)}&deg;</p>
                        </div>

                        <p className='result-location'>{res.name}, {res.sys.country}</p>
                    </div>


                    <div className='right'>
                        <p className='result-clouds'>{res.weather[0].main}</p>
                        <p className='result-humidity'>Humidity: {res.main.humidity}%</p>
                        <p className='result-timestamp'>{res.search_timestamp}</p>
                    </div>


                  </div>
                )
              })
            }


            <div className='previous-searches'>
              <p className='title'>Search History</p>
              <ul>
                {
                  searches.map((search, index) => {
                    return(
                      <li key={index}>

                        <div className='li-left'>
                          <p>{search.name}, {search.sys.country}</p>
                          <p className='previous-searches-smaller'>{search.search_timestamp}</p>
                        </div>
                        
                        <div>
                          <button value={search.name} onClick={(e) => {onSubmit(e, e.target.getAttribute("value"))}}>
                              <FontAwesomeIcon value={search.name} icon={faMagnifyingGlass} style={{color: "#6d6d6d",}}/>
                          </button>

                          <button onClick={() => {
                            onDelete(index)
                          }}>
                            <FontAwesomeIcon icon={faTrashCan} style={{color: "#6d6d6d",}}/>
                          </button>

                          
                        </div>




                        
                      </li>
                    )
                  })
                }
              </ul>
            </div>

          </div>

      </div>

      

    </div>
  );
}

export default App;
