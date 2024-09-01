import  { ReactElement, useEffect,useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { DeleteState } from "../store/atoms";
import { defaultDeleteState } from "../store/atoms";
import { api } from "../utils/AxiosApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomAxiosError } from "../types/types";
export function DeleteSpace():ReactElement{
    const [deleteSpace,setDeleteSpace] = useRecoilState(DeleteState)
    const {DeleteStatus,DeleteValue,DeleteId} = deleteSpace
    const DeleteSpaceModal = useRef<HTMLDivElement>(null)
    const [spaceid,setSpaceid] =useState<string>('')
    const [wrong,setWrong] = useState(false)
    const ButtonRef = useRef<HTMLButtonElement>(null)
    const queryClient = useQueryClient()

    useEffect(()=>{
      if(DeleteStatus){
        document.body.addEventListener("mousedown",UnselectTheDeleteSpace)
        if(ButtonRef.current){
        ButtonRef.current.disabled =false 
        ButtonRef.current.innerText = "Delete Space"
        }
      }else{
        document.body.removeEventListener("mousedown",UnselectTheDeleteSpace)
      }
    },[DeleteStatus])

    function UnselectTheDeleteSpace(e:MouseEvent){
      if(e && DeleteSpaceModal.current && !DeleteSpaceModal.current.contains(e.target as Node) ){
        setDeleteSpace(defaultDeleteState)
        if(ButtonRef.current){
        ButtonRef.current.disabled =false 
        ButtonRef.current.innerText = "Delete Space"
        }
      }
    }

    async function DeleteApiRequest(Deleteid:string):Promise<{message:string}>{
      
      const response =await api.post(`${process.env.BASE_URL}/space/deletespace`,{Deleteid})
      return response.data
      
    }

    const deleteMutation = useMutation<{message:string},CustomAxiosError,string>({
      mutationFn:(Deleteid:string)=>DeleteApiRequest(Deleteid),
      onSuccess:()=>{
        toast.success("Space deleted")
        setDeleteSpace(defaultDeleteState)
        
        setSpaceid("")
        if(ButtonRef.current){
        ButtonRef.current.disabled =false 
        ButtonRef.current.innerText = "Delete Space"
        }
        queryClient.invalidateQueries({queryKey:['space']})
      },
      onError:(error)=>{
          if(ButtonRef.current){
              ButtonRef.current.disabled =false 
              ButtonRef.current.innerText = "Delete Space"
            }
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


    if(deleteMutation.isPending){
      if(ButtonRef.current!==null){
        ButtonRef.current.disabled = true
        ButtonRef.current.innerText = "Deleting please wait"
      }
    }
    

    return (
      <>
        <div className={`${DeleteStatus ? "visible" : "hidden"} max-w-96 bg-white space-y-4 rounded-md font-space px-3 py-6 `} ref={DeleteSpaceModal}>
          <div className="space-y-2">
            <p className="text-center text-2xl font-semibold">Delete the space</p>
            <p className="text-gray-500 text-center">
              Once you delete the space you all the testimonials in this space
              will be gone for ever
            </p>
          </div>
          <div className="space-y-2">
            <div >
              <p>Enter the space id <p unselectable="off" className="text-red-500">{DeleteValue}</p></p>
              <input type="text" className="w-full outline-none border-gray-400 border-2 rounded-md focus:border-2 focus:border-black px-2 py-1" value={spaceid} onChange={(e)=>{
                    setSpaceid(e.target.value)
                    wrong ? setWrong(false):null
              }} />
            </div>
            <div>
            <button className="w-full bg-black text-white py-2 rounded-md" disabled={false} ref={ButtonRef} onClick={()=>{
               if(DeleteValue!==spaceid){
                 setWrong(true)
               }else{
                deleteMutation.mutate(DeleteId)
               }
            }}>Delete the space</button>
            <p className={`${wrong ? "visible" : "hidden"} text-red-400`}>space id entered is incorrect</p>
            </div>
          </div>
        </div>
      </>
    );

}