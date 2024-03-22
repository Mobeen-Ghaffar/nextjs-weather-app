"use client";
/** @format */
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { format,fromUnixTime,parseISO } from 'date-fns';
import Container from "@/components/Container";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayorNightIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56
export default function Home() {
    const { isLoading, error, data } = useQuery<WeatherData>({
    queryKey: ['repoData'],
      queryFn: async () => {
        // `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
     

        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=lahore&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`);
        return data;
      }
      ,
  })
  // console.log(data);
  // if (isPending) return 'Loading...'
  const firstData = data?.list[0];
  console.log("data", data);
  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];
  
  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    // Filter entries for the current date
    const entriesForDate = data?.list.filter((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    })??[];

    // If there are entries for the date, return the earliest one
    if (entriesForDate?.length > 0) {
      return entriesForDate?.[0];
    }
  });
  const filteredFirstDataForEachDate = firstDataForEachDate.filter((entry) => entry !== undefined);

  if (isLoading) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {
          // today data
        }
        <section className="space-y-4">
          <div  className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end ">
              <p>{format(parseISO(firstData?.dt_txt ?? ""),"EEEE")}</p>
              <p className="text-lg">({format(parseISO(firstData?.dt_txt ?? ""),"dd-MM-yyyy")})</p>
            </h2>

            <Container className="gap-10 px-6 items-center">
              {/* temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feel like</span>
                  <span>{convertKelvinToCelsius(firstData?.main.feels_like ?? 296.37)}°</span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓{" "}
                  </span>
                  <span>
                    {" "}
                    {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
                  </span>
                </p>
              </div>
              {/* time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d,i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt),"h:mm a")}
                    </p>
                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon,d.dt_txt)} />
                    <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4 ">
            {/* left  */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center"> { firstData?.weather[0]?.description } </p>
              <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? "",firstData?.dt_txt?? "")} />
                    
            </Container>
            <Container className="bg-yellow-300/80 px-6 gp-4 justify-between overflow-x-auto">
              <WeatherDetails
                airPressure={`${firstData?.main.pressure}hp`}
                visibility={metersToKilometers(firstData?.visibility ?? 10000)}
                humidity={`${firstData?.main.humidity}%`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452),"HH:mm")}
                sunset={format(fromUnixTime(data?.city.sunset ?? 1702517657), "HH:mm")}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
              />
                
            </Container>
            {/* right  */}

          </div>
        </section >

        {/* {7 day forcast data} */}
        <section className="flex w-full flex-col gap-4">
          
          <p className="text-2xl">Forcast (7 days)</p>
          {filteredFirstDataForEachDate.map((d, i) => (
            <ForecastWeatherDetail
              key={i}
              description={d?.weather[0].description ?? ""}
              weatherIcon={d?.weather[0].icon ?? "01d"}
              date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
              day={d ? format(parseISO(d.dt_txt), "dd.MM") : "EEEE"}
              feels_like={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              airPressure={`${d?.main.pressure} hPa `}
              humidity={`${d?.main.humidity}% `}
              sunrise={format(
                fromUnixTime(data?.city.sunrise ?? 1702517657),
                "H:mm"
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1702517657),
                "H:mm"
              )}
              visibility={`${metersToKilometers(d?.visibility ?? 10000)} `}
              windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
            />
          ))}

          {/* */}
        </section>

      </main>
    </div>
  );
  
}
