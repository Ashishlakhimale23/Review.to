import { useQuery } from "@tanstack/react-query";
import { ReviewCard } from "../component/ReviewCard";
import {useParams } from "react-router-dom";
import {api} from "../utils/AxiosApi"
import { CustomAxiosError, GetAllReviews, Space} from "../types/types";
import { ReviewHeader } from "../component/ReviewHeader";
import { PreviewCard } from "../component/PreviewCard";
import {toast} from "react-toastify"
import { CreateSpaceInfo } from "../component/CreateSpaceInfo";
import { useRecoilValue } from "recoil";
import { EditFormModal, SpaceState } from "../store/atoms";

export function Reviews(){
    const {spaceLink} = useParams()
    const space = useRecoilValue(SpaceState)
    const editModal = useRecoilValue(EditFormModal)
    let persistentspace :Space

    const GetReviews= async():Promise<GetAllReviews>=>{
        const response =await api.post(`/space/getallreviews`,{spaceLink:spaceLink})
        return  response.data.result
    }

    const {data,isLoading,isError,error,isSuccess} = useQuery<GetAllReviews,CustomAxiosError>({
        queryKey:["review"],
        queryFn:GetReviews
        
    })
    console.log(data)
    if(isLoading){
        return <div>Loading..</div>
    }
    if(isError){
      if (error.response) {
             return toast.error(
              error.response.data?.message || "Error creating space"
            );
          } else if (error.request) {
            return toast.error("No response from server. Please try again.");
          } else {
            return toast.error("Error setting up request. Please try again.");
          } 
    }
    if(isSuccess){
       persistentspace ={
        spaceName:data.spaceName,
        spaceImage:data.spaceImage,
        spaceQuestion:data.spaceQuestion,
        spaceCustomMessage:data.spaceCustomMessage,
        spaceSocialLinks:data.spaceSocialLinks,
        spaceStarRating:data.spaceStarRating,
        spaceTheme:data.spaceTheme,
        spaceTitle:data.spaceTitle
      }
      console.log(persistentspace)
      console.log(space)
      localStorage.setItem('space',JSON.stringify(persistentspace))
    }

    if (editModal) {
      return (
        <div className=" h-full w-full py-5 px-3 sm:px-10 sm:py-4 md:flex  md:justify-center md:items-center md:p-5">
          <div className="bg-white rounded-md px-2 py-5 w-fit h-fit shadow-lg border-2 border-black sm:px-6 sm:py-8 md:flex md:space-x-10 max-w-6xl">
            <PreviewCard space={space} />
            <CreateSpaceInfo />
          </div>
        </div>
      );
    }
    return (
      <>
        <div className="w-full min-h-screen bg-black">
          <div className="md:flex md:justify-center md:items-center">
            <ReviewHeader
              spaceImage={data?.spaceImage as string}
              spaceLink={data?.spaceLink as string}
              spaceName={data?.spaceName!}
            />
          </div>
          <div className="p-3 sm:flex sm:justify-center ">
            {!data?.Reviews.length ? (
              <div>No reviews</div>
            ) : (
              <div className="space-y-4 sm:px-5 sm:max-w-xl md:max-w-2xl ">
                {data?.Reviews.map((reviews, index) => (
                  <ReviewCard Review={reviews} key={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
}