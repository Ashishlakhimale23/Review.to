import { ReactElement } from "react";
import gojo from "../assets/gojo.gif"
import {  useSetRecoilState } from "recoil";
import { PublishedState } from "../store/atoms";
import {defaultPublished} from "../store/atoms"
import { toast } from "react-toastify";
export function PublishedCard ({spaceName,spaceLink}:{spaceName:string,spaceLink:string}):ReactElement{
    const setPublished =useSetRecoilState(PublishedState) 
    return (
      <>
        <div className="w-full h-screen flex justify-center items-center px-3">
          <div className="bg-white  space-y-2 font-space border-2 border-black p-2 rounded-md sm:p-3 ">
            <img src={gojo} className="rounded-md sm:max-w-96 " />
            <div className="space-y-3">
                <div>
              <p className="text-center text-xl font-bold">Added {spaceName} successfully</p>
              <p className="text-center">Heres a link for your customers</p>
              <p className="text-center text-sm hover:text-blue-600 hover:cursor-pointer"  onClick={async (e)=>{
                await navigator.clipboard.writeText(e.currentTarget.innerText)
                return toast.success("Link copied")
              }}>{`http://localhost:5173/review/${spaceLink}`}</p>
                </div>
              <button className="w-full text-white bg-black rounded-md py-2" onClick={()=>{
                setPublished(defaultPublished)
              }
              }>Close</button>
            </div>
          </div>
        </div>
      </>
    );

}