import { MultipleTestiomial } from '../types/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CustomAxiosError } from '../types/types';
import { useParams } from 'react-router-dom';
import { MultipleReviewsCard } from '../component/MultipleReviewsCard';
export const MansoryPage= () => {
     const {spacelink} = useParams()
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
    <div className="container mx-auto p-4 masonry sm:masonry-sm lg:masonry-md space-y-4 sm:space-x-2 sm:space-y-2 md:space-x-4 md:space-y-4  ">
      {
        data.map((review,index)=>(

      <MultipleReviewsCard Review={review} key={index}/>
        ))
      }
    </div>
  );
};
