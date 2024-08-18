import { useParams } from "react-router-dom"
import { PreviewCard } from "../component/PreviewCard"
import axios from "axios"
import {toast} from "react-toastify"
import { CustomAxiosError, Space } from "../types/types"
import { useQuery } from "@tanstack/react-query"
import { SubmitReviewForm } from "../component/submitReviewForm"
import { useRecoilValue } from "recoil"
import { SubmitReviewModal } from "../store/atoms"

export function SubmitReview(){
    let {spacelink} = useParams()
    const reviewModal = useRecoilValue<boolean>(SubmitReviewModal)


    const fetchSpaceInfo = async():Promise<Space>=>{
        const response = await axios.post(`${process.env.BASE_URL}/space/getspacedetails`,{spacelink:spacelink})
        return response.data.details
    }
    let {data:space,isLoading,isError,error} = useQuery<Space,CustomAxiosError>({
        queryKey:['generatedinfo'],
        queryFn:fetchSpaceInfo,
    }) 
    console.log(space)
    if(isLoading){
        return (
            <>
            <div>Loading..</div>
            </>
        )
    }
   
    if(isError){
        if (error!.response) {
            return toast.error(
               error!.response.data?.message || "Error creating space"
             );
           } else if (error!.request) {
             return toast.error("No response from server. Please try again.");
           } else {
             return toast.error("Error setting up request. Please try again.");
           }
    }

    return (
      <>
        <div className="w-full px-2 sm:px-20 h-screen flex justify-center items-center z-10">
          <PreviewCard space={space!} />
        </div>
       <div className={` w-full h-screen sm:flex sm:justify-center overflow-y-scroll fixed  ${reviewModal ? "block top-0" : "hidden"}`}>

          <SubmitReviewForm space={{...space!,spacelink:spacelink!}} />
        </div>
      </>
    );
}