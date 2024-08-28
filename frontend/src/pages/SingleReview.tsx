import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"
import { CustomAxiosError, Submitform } from "../types/types"
import { SingleReviewCard } from "../component/SingleReviewCard"
import { useEffect,useRef } from "react"
export function SingleReview(){
    const {spacelink,id} = useParams()
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
    console.log(spacelink,id)
    async function getdata():Promise<Submitform>{
        const response = await axios.post(`${process.env.BASE_URL}/space/getsinglereview`,{spacelink:spacelink,id:id})
        console.log(response)
        return response.data.result
    }
    const {data,isError} = useQuery<Submitform,CustomAxiosError>({
    queryKey:['singlereveiw'],
    queryFn:getdata
    })
    if(!data || isError){
        return <p className="text-red-400">Error.....</p> 
    }
    
    return (
      <div className="p-4 md:flex md:justify-center mt-1" ref={containerRef} >
        <SingleReviewCard Review={data} />
      </div>
    );

}