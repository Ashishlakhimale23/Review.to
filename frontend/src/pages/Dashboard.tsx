import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {SpaceDashboard} from "../component/SpaceDashboard"
import { useRecoilValue } from "recoil"; 
import { PublishedState } from "../store/atoms";
import { PublishedSpace } from "../types/types";
import { PublishedCard } from "../component/PublishedCard";
import { api } from "../utils/AxiosApi";
import { useQuery } from "@tanstack/react-query";
export function Dashboard():ReactElement{
    const navigate = useNavigate()
    const {Published,PublishedName,PublishedLink} = useRecoilValue<PublishedSpace>(PublishedState)

    async function fetchSpace(){
      const response = await api.get(`${process.env.BASE_URL}/space/getspace`)
      console.log(response)
      return response.data.data.space
    }

    const {data:space,isLoading,isError} = useQuery<[{spaceName:string,spaceImage:string}]>({
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
        <div className="w-full min-h-screen bg-black font-space">
          <div className="pt-28 px-2 text-white space-y-6 sm:px-7 lg:px-11 xl:px-14">
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

            <div className="space-y-5  md:grid md:grid-cols-2 md:space-y-0 md:gap-y-7 md:gap-x-3 lg:grid-cols-3 lg:col-span-full">
              {!space?.length ? <div>no space</div>:
               space?.map((element,index)=>(
                <SpaceDashboard image={element.spaceImage} spaceName={element.spaceName} key={index}/>
               )) 
              } 
            </div>
          </div>
        </div>
      </>
    );
}