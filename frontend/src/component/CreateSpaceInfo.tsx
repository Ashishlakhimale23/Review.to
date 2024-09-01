import { ReactElement, useEffect, useRef} from "react"
import {toast} from "react-toastify"
import { useRecoilState, useSetRecoilState } from "recoil"
import {PublishedState, SpaceLogo, SpaceState} from "../store/atoms"
import zod from "zod"
import { CustomAxiosError, PublishedSpace, Space } from "../types/types"
import { api } from "../utils/AxiosApi";
import {defaultSpace} from "../store/atoms"
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"
export function CreateSpaceInfo():ReactElement{
    const [space, setSpace] = useRecoilState(SpaceState);
    const setPublished = useSetRecoilState<PublishedSpace>(PublishedState);
    const navigate = useNavigate()
    const {spaceName,spaceImage,spaceCustomMessage,spaceSocialLinks,spaceQuestion,spaceStarRating,spaceTitle} = space
    const [spaceLogo,setSpaceLogo]  = useRecoilState(SpaceLogo)    
    const ButtonRef = useRef<HTMLButtonElement>(null); 

    useEffect(()=>{
      localStorage.setItem("space",JSON.stringify(space))
      return ()=>{
        localStorage.removeItem("space");
        
      }
    },[space])

    const DataToVerify = zod.object({
       spaceName:zod.string({message:"Requires a string"}),
       spaceCustomMessage:zod.string({message:"Requires a string"}),
       spaceQuestion:zod.array(zod.string({message:"Requires a array string"})),
       spaceSocialLinks:zod.boolean(),
       spaceStarRating:zod.boolean(),
    }) 

   const DataVerification =(data:Space)=>{
    const ParsedData = DataToVerify.safeParse(data)
    return ParsedData;
   }

   const MutationSpaceInfo = async (formData : FormData & Space ):Promise<{spaceName:string,spaceLinks:string}> => {
    const response = await api.post(`${process.env.BASE_URL}/space/createspace`,formData, {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     });
     return response.data
   };

   const Mutationfunc = useMutation<{spaceName:string,spaceLinks:string},CustomAxiosError,FormData & Space>({
    mutationFn:(formdata:FormData & Space)=>MutationSpaceInfo(formdata),
    onSuccess:(data)=>{
      if(ButtonRef.current){
      ButtonRef.current.disabled = false,
      ButtonRef.current.innerText = window.location.pathname === '/createspace'?'Create space':'Edit space'
    }
      setPublished({
        Published: true,
        PublishedName: data.spaceName,
        PublishedLink: data.spaceLinks,
      });
      setSpace(defaultSpace);
      navigate("/dashboard");
      return toast.success("space uploaded");
    },
    onError:(error)=>{

      setSpace(defaultSpace);
  if(ButtonRef.current){
      ButtonRef.current.disabled = false,
      ButtonRef.current.innerText = window.location.pathname === '/createspace'?'Create space':'Edit space'
    }
      if (error.response) {
        return toast.error(
          error.response.data.message || "Error creating space"
        );
      } else if (error.request) {
        return toast.error("No response from server. Please try again.");
      } else {
        return toast.error("Error setting up request. Please try again.");
      }
    }
   })

   if(Mutationfunc.isPending){
    if(ButtonRef.current){
      ButtonRef.current.disabled = true,
      ButtonRef.current.innerText = "Uploading the space"
    }
   }
  const handleDataSubmit = async()=>{

    const status:boolean = window.location.pathname === '/createspace' 
    if (!spaceName.length) {
      return toast.error("Fill the field space name");
    }
    if (!spaceTitle.length) {
      return toast.error("Fill the field space title");
    }
    if (!spaceCustomMessage.length) {
      return toast.error("Fill the field custom message");
    }
    if (defaultSpace.spaceImage === spaceImage) {
      return toast.error("upload the space image");
    }
    
    try {
      const ParsedData = DataVerification(space);
      if (!ParsedData.success) {
        return toast.error(ParsedData.error.issues[0].message);
      } else {

        const formData = new FormData() as FormData & Space;
        Object.entries(space).forEach(([key, value]) => {
          if (key === "spaceImage" && value instanceof File) {
            formData.append("spaceImage", value);
          } else if (Array.isArray(value)) {
            value.forEach((item, index) =>
              formData.append(`space[${key}][${index}]`, item)
            );
          } else {
            formData.append(`space[${key}]`, value);
          }
        });
         formData.append(`space[status]`,status.toString())
        Mutationfunc.mutate(formData);

      }
    } catch (error) {
      return toast.error("internal server error");
    } finally {
      if (ButtonRef.current !== null) {
        ButtonRef.current.disabled = false;
        ButtonRef.current.textContent =status ? "Create space" :"Edit space";
      }
    }
  } 

    
    return (
      <>
        <div className="w-fit h-fit font-space lg:px-4">
          <div className="text-center mb-7">
            <h1 className=" font-bold text-xl">{`${window.location.pathname ==='/createspace' ? 'Create a new Space' :'Edit space'}`}</h1>
            <p className={`${window.location.pathname === "/createspace" ? 'block' : 'hidden'}`}>
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
              className="w-full outline-none border-2 border-gray-200 focus:ring-black focus:ring-2 px-3 py-1 rounded-md "
            />
          </div>

          <div className="mb-2">
            <p>Space logo</p>
            <div className="space-x-8 flex items-center">
               <img  src={typeof spaceImage === 'string' ? spaceImage : spaceImage instanceof File ? spaceLogo: defaultSpace.spaceImage as string} className="w-12 h-12 rounded-full" />
               <label htmlFor="inputimage" className=" border-2 border-gray-200 px-2 py-1 rounded-md h-fit "> 
                change
                <input type="file" id="inputimage" hidden  accept=".jpg ,.png ,jpeg" size={5*1024*1024} onChange={(e)=>{
                     const file = e.target.files?.[0] 
                     console.log(file)
                     if(file){
                      setSpaceLogo(URL.createObjectURL(file))
                      setSpace((prevSpace)=>({...prevSpace,spaceImage:file}))
                     }
                 }}/>
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
            <p>Collect Twitter link</p>
            <div className={`w-12 h-7 bg-gray-200 rounded-full p-1 flex items-center ${spaceSocialLinks?'justify-end bg-blue-500':'justify-start'}`} onClick={()=>setSpace((prevSpace)=>({...prevSpace,spaceSocialLinks:!spaceSocialLinks}))}>
            <div className={` w-5 h-5 bg-white rounded-full` }></div>
            </div>
          </div>
          
          <div  className="mb-2">
            <p>Collect star ratings</p>
            <div className={`w-12 h-7 bg-gray-200 rounded-full p-1 flex items-center ${spaceStarRating?'justify-end bg-blue-500':'justify-start'}`} onClick={()=>setSpace((prevSpace)=>({...prevSpace,spaceStarRating:!spaceStarRating}))}>
            <div className={` w-5 h-5 bg-white rounded-full` }></div>
            </div>
          </div>

          <div>
              <button type="submit" disabled={false} className="w-full bg-black text-white py-3 rounded-md" ref={ButtonRef} onClick={handleDataSubmit}>{window.location.pathname === '/createspace'?'Create space':'Edit space'}</button>
          </div>

        </div>
      </>
    );
}