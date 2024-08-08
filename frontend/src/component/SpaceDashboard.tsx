import {  useSetRecoilState } from "recoil";
import { DeleteState } from "../store/atoms";
import {RemoveAnySpaces} from "../utils/RemoveAnySpaces"
export function SpaceDashboard({image,spaceName,id}:{image:string,spaceName:string,id:string}){
  const setDeleteState = useSetRecoilState(DeleteState)
    return (
      <>
        <div className="w-full h-fit flex items-center border-2 space-x-2">
          <div>
            <img src={image} className="w-[70px] h-[70px] md:w-20 md:h-20 "/>
          </div>
          <div className="flex-1">
            <p className=" sm:text-xl line-clamp-1">{spaceName}</p>
            <p className="sm:text-lg">Text</p>
          </div>
          <div className="pr-5 w-fit ">
            <button className="text-xl font-semibold " onClick={(e)=>{
              e.stopPropagation()
              console.log("clicked")
              const name:string = RemoveAnySpaces(spaceName)
              setDeleteState({DeleteStatus:true,DeleteValue:name,DeleteId:id})
            }}>x</button>
          </div>
        </div>
      </>
    );
}