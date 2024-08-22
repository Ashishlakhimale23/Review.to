import { ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {SpaceDashboard} from "../component/SpaceDashboard"
import { useRecoilValue } from "recoil"; 
import {  PublishedState } from "../store/atoms";
import { PublishedSpace } from "../types/types";
import { PublishedCard } from "../component/PublishedCard";
import { api } from "../utils/AxiosApi";
import { useQuery } from "@tanstack/react-query";
import { DeleteSpace } from "../component/DeleteSpace";
import { DeleteState } from "../store/atoms";
import "react-toastify/dist/ReactToastify.css";
import { CustomAxiosError } from "../types/types";

export function Dashboard():ReactElement{
    const navigate = useNavigate()
    const {Published,PublishedName,PublishedLink} = useRecoilValue<PublishedSpace>(PublishedState)
    const {DeleteStatus} = useRecoilValue(DeleteState)

    async function fetchSpace(){
      const response = await api.get(`${process.env.BASE_URL}/space/getspace`)
      console.log(response)
      return response.data.data.space
    }

    const {data:space,isLoading,isError,error} = useQuery<[{spaceName:string,spaceImage:string,_id:string,spaceLink:string}],CustomAxiosError>({
      queryKey :["space"],
      queryFn:fetchSpace
    })
    


    if(isLoading){
      return(
            <>
            <div className="w-full h-screen bg-black flex justify-center items-center overflow-hidden"><p className="text-2xl text-white font-space">Loading...</p></div>
            </> 
      )    
    }
    if(Published){
      return (
        <>
       <PublishedCard spaceName={PublishedName} spaceLink={PublishedLink}/> 
        </>
      )
    }
    return (
      <>
        <div className="w-full min-h-screen bg-black font-space ">
          <div className=" pt-28 px-2 text-white space-y-6 sm:px-7 lg:px-11 xl:px-14 ">
            <p className=" text-3xl ">Overview</p>
            <div className="space-y-6 md:flex md:space-y-0 md:space-x-3  ">
              <div className="px-4 py-7 text-xl border-2 rounded-lg flex-1">
                Space : {space?.length}
              </div>
              <div className="px-4 py-7 text-xl border-2 rounded-lg flex-1">
                Testimonials :
              </div>
            </div>

            <div className="flex justify-between px-2 ">
               <p className="text-2xl align-middle">Spaces</p>
               <button className="border-2 border-white p-2 rounded-md " onClick={()=>{
               navigate("/createspace") 
               }}>+ createspace</button>
            </div>

            <div className="space-y-5  md:grid md:grid-cols-2 md:space-y-0 md:gap-y-7 md:gap-x-3 lg:grid-cols-3 ">
              {!space?.length ? <div>no space</div>:
               space?.map((element)=>(
                <SpaceDashboard image={element.spaceImage} spaceName={element.spaceName} spaceLink={element.spaceLink} key={element._id} id={element._id}/>
               )) 
              } 
            </div>
          </div>
        </div>
          <div className={`${DeleteStatus ? 'top-0':"top-full"} fixed px-2 w-full h-screen flex justify-center items-center sm:px-10`}>
          <DeleteSpace  />
        </div>
        
      </>
    );
}