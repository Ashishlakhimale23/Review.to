import { MultipleTestiomial } from '../types/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CustomAxiosError } from '../types/types';
import { useParams } from 'react-router-dom';
import { MultipleReviewsCard } from '../component/MultipleReviewsCard';
import { useEffect,useRef } from 'react';
export const MansoryPage= () => {
     const {spaceLink} = useParams()


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

    async function getdata():Promise<[MultipleTestiomial]>{
        const response = await axios.post(`${process.env.BASE_URL}/space/getmultiplereviews`,{spacelink:spaceLink})
        return response.data.result
    }
    const {data,isError,isLoading} = useQuery<[MultipleTestiomial],CustomAxiosError>({
    queryKey:['multiplereveiw'],
    queryFn:getdata
    })
    if(isLoading){
      return <div className='w-screen content-center'>Loading... </div>
    }
    if(!data || isError){
        return <p className="text-red-400">Error.....</p> 
    }
    console.log(data)

return (
  <div className={`container mx-auto p-5 space-y-4 sm:space-x-2 sm:space-y-2 ${data.length === 1 ? ' grid sm:grid-cols-4' : data.length === 2 ? 'grid sm:grid-cols-2 lg:grid-cols-4 ' : 'columns-1 sm:columns-2 lg:columns-3'}  `} ref={containerRef}>
    {
      data.map((review, index) => (
        <div className={`${data.length === 1 ? 'sm:col-start-2 sm:col-end-4' : data.length === 2 ? index === 0 ? 'lg:col-start-2 lg:col-end-3' : 'lg:col-start-3 lg:col-end-4' : ''}`}>
          <MultipleReviewsCard Review={review} key={index}/>
        </div>
      ))
    }
  </div>
);
 

};
