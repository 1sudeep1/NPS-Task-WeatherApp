import { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [temperature, setTemperature] = useState('');
  const [temperatureMax, setTemperatureMax] = useState('');
  const [temperatureMin, setTemperatureMin] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle input change
  const handleChange = (e) => {
    setCity(e.target.value);
  };

  // Function to calculate input width based on content length
  const calculateInputWidth = (content) => {
    const MIN_WIDTH = 50; // Minimum width for the input
    const TEXT_PADDING = 2; // Additional padding to account for text
    const contentWidth = content.length * 12; // Adjust the multiplier as needed
    return Math.max(MIN_WIDTH, contentWidth + TEXT_PADDING) + 'px';
  };

  // Calculate input width based on current city value
  const inputWidth = calculateInputWidth(city);

  const apiKey = import.meta.env.VITE_API_KEY;


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        console.log(response.data.list[0], 'sudeep')
        if (response.data && response.data.list) {
          setWeatherCondition(response.data.list[0].weather[0].main);
          setTemperature(response.data.list[0].main.temp);
          setTemperatureMax(response.data.list[0].main.temp_max);
          setTemperatureMin(response.data.list[0].main.temp_min);
          setWindSpeed(response.data.list[0].wind.speed);
          setHumidity(response.data.list[0].main.humidity);
          setPressure(response.data.list[0].main.pressure);
          // Group forecast data by day of the week
          const groupedByDayOfWeek = groupForecastByDayOfWeek(response.data.list);
          setWeeklyForecast(groupedByDayOfWeek);

        } else {
          setWeatherCondition('Unknown');
          setTemperature('Unknown');
          setTemperatureMax('Unknown');
          setTemperatureMin('Unknown');
          setWindSpeed('Unknown');
          setHumidity('Unknown');
          setPressure('Unknown');
          setWeeklyForecast([]);

        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherCondition('Unknown');
        setTemperature('Unknown');
        setTemperatureMax('Unknown');
        setTemperatureMin('Unknown');
        setWindSpeed('Unknown');
        setHumidity('Unknown');
        setPressure('Unknown');
        setWeeklyForecast([]);

      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchData();
    }
  }, [city]);

  // Function to render weather icon based on weather condition
  const renderWeatherIcon = () => {
    switch (weatherCondition.toLowerCase()) {
      case 'sunny':
        return <img className='w-[100px] md:w-[150px]' src="/sunny.png" alt="Sunny" />;
      case 'clear':
        return <img className='w-[100px] md:w-[150px]' src="/clear.png" alt="Clear" />;
      case 'clouds':
        return <img className='w-[100px] md:w-[150px]' src="/clouds.png" alt="Clear" />;
      case 'haze':
        return <img className='w-[100px] md:w-[150px]' src="/haze.png" alt="Clear" />;
      case 'rainy':
        return <img className='w-[100px] md:w-[150px]' src="/rainy.jpg" alt="Clear" />;
      default:
        return null;
    }
  };

  // Function to group forecast data by day of the week
  const groupForecastByDayOfWeek = (forecastData) => {
    return forecastData.reduce((acc, forecast) => {
      const date = new Date(forecast.dt_txt);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (!acc[dayOfWeek]) {
        acc[dayOfWeek] = [];
      }
      acc[dayOfWeek].push(forecast);
      return acc;
    }, {});
  };

  // Function to get the day name for the next day
  const getNextDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const tomorrow = (today + 1) % 7;
    return days[tomorrow];
  };
  // Function to get the maximum temperature from an array of forecast data
  const getMaxTemperature = (forecasts) => {
    return Math.max(...forecasts.map((forecast) => forecast.main.temp_max));
  };

  // Function to get the minimum temperature from an array of forecast data
  const getMinTemperature = (forecasts) => {
    return Math.min(...forecasts.map((forecast) => forecast.main.temp_min));
  };
  return (
    <>
      <section className='bg-[#4DBFD9] w-full lg:h-[830px] md:h-[730px] sm:h-[50rem] xsm:h-[62rem] h-[62rem] rounded relative'>
        <div className='bg-white md:w-[70%] lg:h-[550px] md:h-[530px] sm:w-[75%] sm:h-[40rem] xsm:w-[70%] xsm:h-[55rem] w-[70%] h-[56rem] top-[3rem] left-[3rem] xsm:left-[3.7rem] xsm:top-[3.7rem] lg:left-[11.2rem] lg:top-[9rem] md:left-[6.5rem] sm:left-[5rem] sm:top-[5rem] absolute md:top-[6rem]  rounded-t'>
          <div className='absolute w-full h-10 bg-[#515151] rounded-t'>
            <ul className='flex gap-2 items-center mt-3 ms-3'>
              <li className='w-3 h-3 bg-white rounded-full'></li>
              <li className='w-3 h-3 bg-white rounded-full'></li>
              <li className='w-3 h-3 bg-white rounded-full'></li>
            </ul>
            <p className='mt-10 lg:mt-32 md:mt-20 text-lg font-normal'>
              Right now in{' '}
              <input
                className='font-semibold w-auto px-1 bg-gray-200 rounded'
                placeholder='Input'
                style={{ width: inputWidth }}
                value={city}
                onChange={handleChange}
              />{' '}
              the weather condition is {loading ? 'loading...' : weatherCondition}.
            </p>
            <div className='lg:my-5 md:my-3 my-5 md:px-3 lg:p-0 flex md:flex-row flex-col items-center justify-center gap-8'>
              {renderWeatherIcon()}
              <div>
                {temperature ?
                  <h1 className='text-3xl'>{temperature}° Celsius</h1>
                  : null}
                <div className='flex justify-between gap-3'>
                  {temperatureMax ?
                    <h1 className='text-base'>Max-Temp: &nbsp;{temperatureMax}°c</h1>
                    : null}
                  {temperatureMin ?
                    <h1 className='text-base'>Min-Temp: &nbsp;{temperatureMin}°c</h1>
                    : null}

                </div>
              </div>
              <div>
                {windSpeed ?
                  <p className='text-base'>Wind: &nbsp;{windSpeed}mph</p>
                  : null}
                {humidity ?
                  <p className='text-base'>Humidity: &nbsp;{humidity}grams/m3</p>
                  : null}
                {pressure ?
                  <p className='text-base'>Pressure: &nbsp;{pressure}pa</p>
                  : null}
              </div>
            </div>
            <div className='my-10'>
              <div className='flex md:flex-row lg:justify-between md:justify-around justify-center lg:flex-nowrap flex-wrap items-center text-sm gap-y-5'>
                {Object.entries(weeklyForecast).map(([dayOfWeek, forecasts]) => (
                  <div key={dayOfWeek} className='lg:w-[12%] md:w-[20%] lg:mx-3 md:mx-5 mx-5'>
                    <h2>
                      {dayOfWeek === new Date().toLocaleDateString('en-US', { weekday: 'short' }) ? 'Today' :
                        dayOfWeek === getNextDayName() ? 'Tomorrow' : dayOfWeek}
                    </h2>                   
                    <div className='flex justify-between items-center gap-2'>
                      <p>Max: {getMaxTemperature(forecasts)}°C</p>
                      <p>Min: {getMinTemperature(forecasts)}°C</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
