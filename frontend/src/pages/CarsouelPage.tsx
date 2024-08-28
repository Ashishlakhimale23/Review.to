import { useParams } from "react-router-dom";
import {Carousel} from "../component/Carsouel"
import { MultipleTestiomial } from "../types/types";
import { useRef,useEffect } from "react";
import axios from "axios";
import { CustomAxiosError } from "../types/types";
import { useQuery } from "@tanstack/react-query";
export const CarouselPage = () => {
    const {spacelink} = useParams()
   const containerRef = useRef<HTMLDivElement>(null);
  
   useEffect(() => {
    const sendHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        console.log('Sending height:', height);
        window.parent.postMessage({ type: 'resize', height }, '*');
      }
    };

    const resizeObserver = new ResizeObserver(sendHeight);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Listen for height requests from the parent
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'requestHeight') {
        sendHeight();
      }
    });

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);
    console.log(spacelink)
    async function getdata():Promise<[MultipleTestiomial]>{
        const response = await axios.post(`${process.env.BASE_URL}/space/getmultiplereviews`,{spacelink:spacelink})
        return response.data.result
    }
    const {data,isError} = useQuery<[MultipleTestiomial],CustomAxiosError>({
    queryKey:['multiplereveiw'],
    queryFn:getdata
    })
    if(!data || isError){
        return <p className="text-red-400">Error.....</p> 
    }
    console.log(data)

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Customer Reviews</h1>
      <Carousel reviews={data} interval={5000} />
    </div>
  );
};

