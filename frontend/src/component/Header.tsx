import { ReactElement,useEffect,useRef } from "react";
import { useRecoilState } from "recoil";
import { SettingsModal } from "../store/atoms";
import { useNavigate } from "react-router-dom";

export function Header():ReactElement{
  const [settingsModal,setSettingModal] = useRecoilState<boolean>(SettingsModal)
  const imgRef = useRef<HTMLImageElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(()=>{
    if(settingsModal){
      document.body.addEventListener('mousedown',settingmodal)
    }else{
      document.body.removeEventListener('mousedown',settingmodal)
    }
  },[settingsModal])

  function settingmodal(e:any){
    if(imgRef.current !== null && modalRef.current!==null){
      if(imgRef.current && !imgRef.current.contains(e.target) && modalRef.current && !modalRef.current.contains(e.target)){
        setSettingModal(false)
      }
    }

  }


    return(
        <>
          <div className="bg-black flex justify-between items-center px-3 py-2 sm:px-6 md:px-12 lg:px-24">
            <p className="text-white text-xl font-space font-bold md:text-2xl">Review.to</p>
            <img src="https://res.cloudinary.com/ddweepkue/image/upload/v1719301620/coursefiles/0cecfa5bd56a3a089467769c9ede571e.jpg" 
            className="w-11 h-11 rounded-full hover:opacity-75 md:w-[50px] md:h-[50px]"
            ref={imgRef}
            onClick={()=>{
              setSettingModal((prevSettingModal)=>(!prevSettingModal))
            }}
            />
          </div>
          <div className={`${settingsModal ? "block":"hidden"} fixed right-3 sm:right-6 md:right-12 lg:right-24 w-44`}  
          ref={modalRef}
          >
            <div className="bg-silver text-white font-space px-2 py-2 rounded-md" >
              <button className=" px-[10px] py-2 hover:bg-white hover:text-black rounded-md w-full text-left"
              onClick={()=>{
                navigate("/dashboard")
              }}
              >
                Dashboard
              </button >
              <button className=" px-[10px] py-2 hover:bg-white hover:text-black rounded-md w-full text-left"
              >
                Setting 
              </button >
              <button className="px-[10px] py-2 hover:bg-white hover:text-black rounded-md w-full text-left"
              onClick={()=>{
                localStorage.removeItem("AccessToken")
                navigate("/login")
              }}
              >
                Signout
              </button >
            </div>
          </div>
        </>
    )
}