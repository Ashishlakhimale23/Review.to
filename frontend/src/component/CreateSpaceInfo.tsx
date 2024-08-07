import { ReactElement, useEffect, useRef} from "react"
import {toast,ToastContainer} from "react-toastify"
import { useRecoilState } from "recoil"
import "react-toastify/dist/ReactToastify.css";
import {PublishedState, SpaceState} from "../store/atoms"
import {motion} from "framer-motion"
import zod from "zod"
import { PublishedSpace, Space } from "../types/types"
import { api } from "../utils/AxiosApi";
import {defaultSpace} from "../store/atoms"
import { useNavigate } from "react-router-dom";
export function CreateSpaceInfo():ReactElement{
    const [space,setSpace]=useRecoilState(SpaceState)
    const [published,setPublished] = useRecoilState<PublishedSpace>(PublishedState)
    const navigate = useNavigate()
    const {spaceName,spaceImage,spaceCustomMessage,spaceSocialLinks,spaceQuestion,spaceStarRating,spaceTheme,spaceTitle} = space
    const ButtonRef =useRef<HTMLButtonElement>(null) 

    useEffect(()=>{
      localStorage.setItem("space",JSON.stringify(space))
      return ()=>{
        localStorage.removeItem("space")
      }
    },[space])

    const DataToVerify = zod.object({
       spaceName:zod.string({message:"Requires a string"}),
       spaceImage:zod.string({message:"Requires a string"}),
       spaceCustomMessage:zod.string({message:"Requires a string"}),
       spaceQuestion:zod.array(zod.string({message:"Requires a array string"})),
       spaceSocialLinks:zod.boolean(),
       spaceStarRating:zod.boolean(),
       spaceTheme:zod.boolean()
    }) 

   const DataVerification =(data:Space)=>{
    const ParsedData = DataToVerify.safeParse(data)
    return ParsedData
   }

  const handleDataSubmit = async()=>{
    
    if (!spaceName.length) {
      return toast.error("Fill the field space name");
    }
    if (!spaceTitle.length) {
      return toast.error("Fill the field space title");
    }
    if (!spaceCustomMessage.length) {
      return toast.error("Fill the field custom message");
    }
    
    try {
      const ParsedData = DataVerification(space);
      if (!ParsedData.success) {
        return toast.error(ParsedData.error.issues[0].message);
      } else {
        if (ButtonRef.current !== null) {
          ButtonRef.current.disabled = true;
          ButtonRef.current.textContent = "Uploading space...";
        }
        await api
          .post(`${process.env.BASE_URL}/space/createspace`, { space: space })
          .then((resp) => {
            if (resp.status == 201) {
              setSpace(defaultSpace)
              setPublished((prevPublished)=>({...prevPublished,Published:true,PublishedName:resp.data.spaceName,PublishedLink:resp.data.spaceLinks}))
              navigate("/dashboard")
              return toast.success("space uploaded");
            }else{
              setSpace(defaultSpace)
              return toast.error(resp.data.message)
            } 
          })
          .catch((error) => {
           if (error.response) {
             return toast.error(
               error.response.data.message || "Error creating space"
             );
           } else if (error.request) {
             return toast.error("No response from server. Please try again.");
           } else {
             return toast.error("Error setting up request. Please try again.");
           } 
          });
      }
    } catch (error) {
      return toast.error("internal server error");
    }finally{
     if(ButtonRef.current !==null){
      ButtonRef.current.disabled = false
      ButtonRef.current.textContent = "create space"
     }
    }
  } 

    const handleImageChange = async(e:any) =>{
        const file = e.target.files[0]
        const upload_preset:string =process.env.UPLOAD_PRESET!
        const api_key:string  =process.env.API_KEY!
        const cloudinary_name:string = process.env.CLOUDINARY_NAME!
        let formdata = new FormData()
        formdata.append("file",file)
        formdata.append("upload_preset",upload_preset)
        formdata.append("api_key",api_key)
        try{
        const response =await fetch(`https://api.cloudinary.com/v1_1/${cloudinary_name}/image/upload`,
            {
                method:"POST",
                body:formdata,
            }
        )
        if(response.ok){
            const data=await response.json()
            setSpace((prevSpace)=>({...prevSpace,spaceImage:data.secure_url}))
        }else{
            throw new Error("Failed to upload the space logo")
        }
        }catch(err){
            throw err
        }
        
    }
    return (
      <>
        <div className="w-fit h-fit font-space lg:px-4">
          <div className="text-center mb-7">
            <h1 className=" font-bold text-xl">Create a new Space</h1>
            <p>
              After the space is created ,it will generate a dedicated page for
              collecting testimonials
            </p>
          </div>

          <div className="mb-2">
            <p>Space name</p>
            <input
              type="text"
              value={spaceName}
              onChange={(e) => setSpace((prevSpace)=>({...prevSpace,spaceName:e.target.value}))}
              className="w-full outline-none border-2 border-gray-200 focus:ring-black focus:ring-2 px-3 py-1 rounded-md"
            />
          </div>

          <div className="mb-2">
            <p>Space logo</p>
            <div className="space-x-8 flex items-center">
               <img src={spaceImage} className="w-12 h-12 rounded-full" />
               <label htmlFor="inputimage" className=" border-2 border-gray-200 px-2 py-1 rounded-md h-fit "> 
                change
                <input type="file" id="inputimage" hidden  accept=".jpg ,.png ,jpeg" onChange={handleImageChange}/>
               </label> 
            </div>
          </div>
          
          <div className="mb-2">
            <p>Header title</p>
            <input type="text"
            className="w-full outline-none border-2 border-gray-200 focus:ring-black focus:ring-2 px-3 py-1 rounded-md"
            value={spaceTitle}
            onChange={(e)=>setSpace((prevSpace)=>({...prevSpace,spaceTitle:e.target.value}))}
             />
          </div>

          <div className="mb-2">
            <p>Custom message</p>
            <textarea name="" id=""
            className="w-full outline-none border-2 border-gray-200 focus:ring-black focus:ring-2 px-3 py-1 rounded-md"
            placeholder="write a warm message to your customer, and give them simple directions on how to make the best testimonial."
            rows={5}
            value={spaceCustomMessage}
            onChange={(e)=>setSpace((prevSpace)=>({...prevSpace,spaceCustomMessage:e.target.value}))}
            ></textarea>
          </div>

          <div className="mb-2">
            <p>Question</p>
            <div className="space-y-2 mb-2">
            {
                spaceQuestion.map((question,index)=>(
                    <input type="text"
                    id={index.toString()}
                    key={index}
                    maxLength={100}
                    placeholder="keep it short"
                    className=" w-full outline-none border-2 border-gray-200 focus:ring-black focus:ring-2 px-3 py-1 rounded-md"
                    value={question} 
                    onChange={(e)=>{
                        console.log(e.target.id)
                        const array = [...spaceQuestion]
                        array[parseInt(e.target.id)] = e.target.value
                        setSpace((prevSpace)=>({...prevSpace,spaceQuestion:array}))
                    }}
                    />
                     
                ))
            }
            </div>
            <button className={`${spaceQuestion.length>=5?'invisible':'visible'}`} onClick={()=>{
                setSpace((prevSpace)=>({...prevSpace,spaceQuestion:[...spaceQuestion,""]}))
            }}>Add upto 5</button>
          </div>
          
          <div className="mb-2">
            <p>Collect Socail link</p>
            <div className={`w-12 h-7 bg-gray-200 rounded-full p-1 flex items-center ${spaceSocialLinks?'justify-end bg-blue-500':'justify-start'}`} onClick={()=>setSpace((prevSpace)=>({...prevSpace,spaceSocialLinks:!spaceSocialLinks}))}>
            <motion.div layout className={` w-5 h-5 bg-white rounded-full` }></motion.div>
            </div>
          </div>
          
          <div  className="mb-2">
            <p>Collect star ratings</p>
            <div className={`w-12 h-7 bg-gray-200 rounded-full p-1 flex items-center ${spaceStarRating?'justify-end bg-blue-500':'justify-start'}`} onClick={()=>setSpace((prevSpace)=>({...prevSpace,spaceStarRating:!spaceStarRating}))}>
            <motion.div layout className={` w-5 h-5 bg-white rounded-full` }></motion.div>
            </div>
          </div>

          <div className="mb-2">
            <p>Choose a theme</p>
            <div className={`w-12 h-7 bg-gray-200 rounded-full p-1 flex items-center ${spaceTheme?'justify-end bg-blue-500':'justify-start'}`} onClick={()=>setSpace((prevSpace)=>({...prevSpace,spaceTheme:!spaceTheme}))}>
            <motion.div layout className={` w-5 h-5 bg-white rounded-full` }></motion.div>
            </div>
          </div>

          <div>
              <button type="submit" disabled={false} className="w-full bg-black text-white py-3 rounded-md" ref={ButtonRef} onClick={handleDataSubmit}>Create space</button>
          </div>

        </div>
        <ToastContainer/>
      </>
    );
}