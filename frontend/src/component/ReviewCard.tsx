
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { CustomAxiosError, Submitform } from "../types/types";
import {toast} from "react-toastify"
import {getdate} from "../utils/GetDate"
import { api } from "../utils/AxiosApi";
export function ReviewCard({Review}:{Review:Submitform}){
    const {Message,AttachImage,YourName,YourEmail,UploadPhoto,StarRating,SocialLink,createdAt,WallOfFame,_id} = Review
    const queryClient = useQueryClient()
    
    const addWallofFame =async (Reviewid:string):Promise<Object>=>{
      const response = await api.post(`${process.env.BASE_URL}/space/editwalloflove`,{Reviewid:Reviewid})
      return response.data

    }
    
    const WallOfFameMutation = useMutation<Object,CustomAxiosError,string>({
      mutationFn:(Reviewid:string)=>addWallofFame(Reviewid),
      onSuccess:()=>{
        toast.dismiss("loading")
        !WallOfFame ? toast.success("Added to wall of fame") :toast.success("Removed from wall of fame")
        queryClient.invalidateQueries({queryKey:["review"]})
      },
      onError:(error)=>{
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

    })
    if(WallOfFameMutation.isPending){
      toast.loading("please wait",{toastId:"loading"})
    }

    
    return (
      <>
        <div className="h-fit w-full font-space text-white p-2 bg-silver rounded-lg space-y-2 ">
          <div className="w-full flex justify-between">
            <p>Text</p>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`${WallOfFame ? 'fill-red-600 stroke-red-600' :"fill-slate-100"} w-6`}
                onClick={()=>{
                  if(!_id){
                    return toast.error("Error occured")
                  }
                  WallOfFameMutation.mutate(_id) 
                }}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
          </div>

          <div>
            <div>
              <div className={`${StarRating ? "block" : "hidden"} flex`}>
                {StarRating.map((star, index) =>
                  !star ? (
                    <div id={`${index}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div id={`${index}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-6 fill-yellow-400"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  )
                )}
              </div>
            </div>
            <p className="break-words ">{Message}</p>
          </div>

          <div className={`${AttachImage ? "block" : "hidden"} `}>
            <img
              src={AttachImage as string}
              className="rounded-md w-24 sm:w-36"
            />
          </div>

          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
            <div>
              <p className="">Name</p>
              <div className="flex items-center space-x-2">
                <img
                  src={UploadPhoto as string}
                  className="w-10 h-10 rounded-full"
                />
                <p className="break-words">{YourName}</p>
              </div>
            </div>

            <div>
              <p>Email</p>
              <p className="break-words">{YourEmail}</p>
            </div>

            <div className={`${SocialLink ? "block" : "hidden"}`}>
              <p>Socail Link</p>
              <p>{SocialLink}</p>
            </div>

            <div>
              <p>Submitted At</p>
              <p>{getdate(createdAt!)}</p>
            </div>
          </div>
        </div>
      </>
    );
}