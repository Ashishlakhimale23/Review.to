import { ReactElement, useEffect} from "react"
import { useRecoilState } from "recoil"
import {SpaceNameState,SpaceImageState,SpaceTitleState,SpaceCustomMessage,SpaceQuestion, SpaceSocialLinks, SpaceStarRating, SpaceTheme} from "../store/atoms"
import {motion} from "framer-motion"

export function CreateSpaceInfo():ReactElement{
    const [spaceName,setSpaceName]=useRecoilState(SpaceNameState)
    const [spaceImage,setSpaceImage]=useRecoilState(SpaceImageState)
    const [spaceTitle,setSpaceTitle]=useRecoilState(SpaceTitleState)
    const [spaceCustomMessage,setSpaceCustomMessage] = useRecoilState(SpaceCustomMessage)
    const [spaceQuestion,setSpaceQuestion] = useRecoilState<string[]>(SpaceQuestion)
    const [spaceSocialLinks,setSpaceSocialLinks] = useRecoilState(SpaceSocialLinks)
    const [spaceStarRating,setSpaceStarRating] = useRecoilState(SpaceStarRating)
    const [spaceTheme,setSpaceTheme] = useRecoilState(SpaceTheme)

    useEffect(()=>{
      const space = {
        spaceName:spaceName,
        spaceImage:spaceImage,
        spaceTitle:spaceTitle,
        spaceCustomMessage:spaceCustomMessage,
        spaceQuestion:spaceQuestion,
        spaceSocialLinks:spaceSocialLinks,
        spaceStarRating:spaceStarRating,
        spaceTheme:spaceTheme
      }

      localStorage.setItem("space",JSON.stringify(space))
    },[spaceName,spaceImage,spaceTitle,spaceCustomMessage,spaceQuestion,spaceSocialLinks,spaceStarRating,spaceTheme])




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
            setSpaceImage(data.secure_url)
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
              onChange={(e) => setSpaceName(e.target.value)}
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
            onChange={(e)=>setSpaceTitle(e.target.value)}
             />
          </div>

          <div className="mb-2">
            <p>Custom message</p>
            <textarea name="" id=""
            className="w-full outline-none border-2 border-gray-200 focus:ring-black focus:ring-2 px-3 py-1 rounded-md"
            placeholder="write a warm message to your customer, and give them simple directions on how to make the best testimonial."
            rows={5}
            value={spaceCustomMessage}
            onChange={(e)=>setSpaceCustomMessage(e.target.value)}
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
                        setSpaceQuestion(array)
                    }}
                    />
                     
                ))
            }
            </div>
            <button className={`${spaceQuestion.length>=5?'invisible':'visible'}`} onClick={()=>{
                setSpaceQuestion([...spaceQuestion,""])
            }}>Add upto 5</button>
          </div>
          
          <div className="mb-2">
            <p>Collect Socail link</p>
            <div className={`w-12 h-7 bg-gray-200 rounded-full p-1 flex items-center ${spaceSocialLinks?'justify-end bg-blue-500':'justify-start'}`} onClick={()=>setSpaceSocialLinks(!spaceSocialLinks)}>
            <motion.div layout className={` w-5 h-5 bg-white rounded-full` }></motion.div>
            </div>
          </div>
          
          <div  className="mb-2">
            <p>Collect star ratings</p>
            <div className={`w-12 h-7 bg-gray-200 rounded-full p-1 flex items-center ${spaceStarRating?'justify-end bg-blue-500':'justify-start'}`} onClick={()=>setSpaceStarRating(!spaceStarRating)}>
            <motion.div layout className={` w-5 h-5 bg-white rounded-full` }></motion.div>
            </div>
          </div>

          <div className="mb-2">
            <p>Choose a theme</p>
            <div className={`w-12 h-7 bg-gray-200 rounded-full p-1 flex items-center ${spaceTheme?'justify-end bg-blue-500':'justify-start'}`} onClick={()=>setSpaceTheme(!spaceTheme)}>
            <motion.div layout className={` w-5 h-5 bg-white rounded-full` }></motion.div>
            </div>
          </div>

          <div>
              <button type="submit" className="w-full bg-black text-white py-3 rounded-md">Create space</button>
          </div>

        </div>
      </>
    );
}