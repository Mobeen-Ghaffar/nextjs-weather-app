import { cn } from '@/utils/cn';
import React from 'react'
import { FaSearch } from "react-icons/fa";

type Props = {
    className?:string,
    value: string,
    onChange:React.ChangeEventHandler<HTMLInputElement>|undefined,
    onSubmit:React.FormEventHandler<HTMLFormElement> | undefined,
}

interface WeatherResponse {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecast[];
  city: City;
}

interface WeatherForecast {
  dt: number;
  main: MainWeatherInfo;
  weather: WeatherDetail[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: SystemInfo;
  dt_txt: string;
}

interface MainWeatherInfo {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface WeatherDetail {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface SystemInfo {
  pod: string;
}

interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export default function SearchBox(props: Props) {
    return (
        <form onSubmit={props.onSubmit}
            className={cn('flex relative items-center justify-center h-10',
                props.className
            )}
        > 
            
            <input
                type='text'
                onChange={props.onChange}
                value={props.value}
                placeholder='Search location...'
                className='px-4 py-2 w-[230px] border 
                broder-gray-300 rounded-l-md focus:outline-none
                focus:border-blue-500 h-full
                '
            ></input>
            <button className='px-4 py-[9px] bg-blue-500
            text-white rounded-r-md focus:outline-none hover:bg-blue-600
            h-full' >
                <FaSearch className=''/>

            </button>
        </form>
    )
}

