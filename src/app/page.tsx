"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { format,parseISO } from 'date-fns';
import Container from "@/components/Container";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
// https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56
export default function Home() {
    const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
      queryFn: async () => {

        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=lahore&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=2`);
        return data;
      }
      ,
  })
  // console.log(data);
  // if (isPending) return 'Loading...'
  const firstData = data?.list[0];
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
            </Container>
          </div>
        </section>
        {
          //7 day forcast data
        }
        <section >
          
        </section>

      </main>
    </div>
  );
  
}
