import { useState,useRef } from "react";
import { CustomAxiosError, Space, Submitform } from "../types/types";
import { defaultSpace, SubmitReviewModal } from "../store/atoms";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import {z} from "zod"
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface submitReviewType extends Space{
  spacelink:string
}
export function SubmitReviewForm ({space}:{space:submitReviewType}){
  const {spaceImage,spaceQuestion,spaceStarRating,spaceSocialLinks,spacelink} = space
  const SumbitButtonRef=useRef<HTMLButtonElement>(null)
  const setSubmitReviewModal = useSetRecoilState<boolean>(SubmitReviewModal)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [attachImageBlob,setAttachImageBlob] = useState<string>("")
  const [uploadImageBlob,setUploadImageBlob] = useState<string>("")
  const queryClient =useQueryClient() 

  const DataEmail = z.object({
    email :z.string().email().refine(
  (email) => email.endsWith('@gmail.com'),
  {
    message: 'Must be a valid Gmail address',
  })})

  const DataTwitter = z.object({
    twitter : z.string().regex(/^https:\/\/twitter\.com\/[A-Za-z0-9_]+$/,{
      message:"Invalid twitter url"
    })
  })
  const DataX= z.object({
    twitter : z.string().regex(/^https:\/\/x\.com\/[A-Za-z0-9_]+$/,{
      message:"Invalid twitter url"
    })
  })


  const verifyEmail = (data:object)=>{
      const ParsedData = DataEmail.safeParse(data)
      return ParsedData
  }
  const verifyTwitter = (data:object)=>{
    const ParsedData = DataTwitter.safeParse(data)
    return ParsedData
  }
  const verifyX = (data:object)=>{
    const ParsedData = DataX.safeParse(data)
    return ParsedData
  }

  
  const submitReviewDefault:Submitform = {
    Message:"",
    AttachImage:'',
    YourName:"",
    YourEmail:"",
    UploadPhoto:defaultSpace.spaceImage,
    checkbox:false,
    StarRating:[true,true,true,true,true],
    SocialLink:""
  }

  const [submitReview,setSubmitReview] = useState<Submitform>(submitReviewDefault)

  const verifythenoofcharacters= ()=>{
    if(textareaRef.current && textareaRef.current.value.length < 30){
     return false  
    }
    return true
  }

  const submitreviewmethod =async(formdata:FormData):Promise<{message:string}>=>{
    const response = await axios.post(`${process.env.BASE_URL}/space/submitreview`,formdata,{
      headers:{
        'Content-Type':"multipart/form-data"
      }
    })
    return response.data
  }

  const submitMutation = useMutation<{message:string},CustomAxiosError,FormData>({
    mutationFn : (formdata:FormData)=>submitreviewmethod(formdata),
    onSuccess:()=>{
    setSubmitReview(submitReviewDefault)
    setSubmitReviewModal(false)
    queryClient.invalidateQueries({queryKey:['multiplereveiw']})
    
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
      },
      

  })


  if(submitMutation.isPending){
    if(SumbitButtonRef.current){
      SumbitButtonRef.current.disabled = true 
      SumbitButtonRef.current.innerText = "Uploading the review..."
    }
  }
  if(submitMutation.isSuccess){
    if(SumbitButtonRef.current){
      SumbitButtonRef.current.disabled =false 
      SumbitButtonRef.current.innerText = "Submit"
    }

  }
  
  const submitForm=async()=>{
    const no = verifythenoofcharacters()
    
    if(!no){
      return toast.error("writes some message atleast 30 character")
    }
    if(!submitReview.YourName){
      return toast.error("Enter your name")
    }
    if(!submitReview.YourEmail ){
      return toast.error("Enter email")
    }
    if(typeof submitReview.UploadPhoto == 'string' ){
      return toast.error("Upload a photo ")
    }
    if(!submitReview.checkbox){
      return toast.error("Give me the permission")
    }
    if(spaceSocialLinks){
      if(!submitReview.SocialLink){
        return toast.error("Enter your social link")
      }
    }

        const PrasedResult = verifyEmail({email:submitReview.YourEmail.toLowerCase()})
        const Prasedtwitter = verifyTwitter({twitter:submitReview.SocialLink!.toLowerCase()})
        const PrasedX = verifyX({twitter:submitReview.SocialLink!.toLowerCase()})
        if(spaceSocialLinks){
          console.log(submitReview.SocialLink )
          console.log(PrasedX , Prasedtwitter)
          if(!Prasedtwitter.success && !PrasedX.success){
            return toast.error("Invalid twitter url")
          }
        }
          if(!PrasedResult.success){
            const problem:string= PrasedResult.error.issues[0].message
            return toast.error(problem)
          }

          else{
            const formData = new FormData();
           

            Object.entries(submitReview).forEach(([key, value]) => {
              switch (key) {
                case "AttachImage":
                case "UploadPhoto":
                  if (value instanceof File) {
                    formData.append(key,value)
                  }
                  break;
                case "StarRating":
                  value.forEach((rating: string, index: number) => {
                    formData.append(`StarRating[${index}]`, rating.toString());
                  });
                  break;
                case "checkbox":
                  formData.append(key, value.toString());
                  break;
                default:
                  formData.append(key, value);
                  break
              }
            });

            formData.append("spacelink",spacelink)
            
            try {
              await submitMutation.mutateAsync(formData);
              toast.success("Review submitted successfully!");
            } catch (error) {
              console.error(error);
              toast.error("Failed to submit review. Please try again.");
            }

          }
  }
  
    return (
      <>
        <div className="w-full sm:max-w-md h-fit  p-3 shadow-lg rounded-md font-space bg-white space-y-2  ">
          <div className="w-full flex justify-between">
            <p>Write a text review </p>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                onClick={()=>{
                  setSubmitReviewModal(false)
                }}
              
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <div>
            <img
              src={typeof spaceImage === "string" ? spaceImage : ""}
              alt=""
              className="w-16 rounded-md"
            />
          </div>

          <div>
            <p className="text-xl underline">Questions</p>
            <div>
              {spaceQuestion.map((question, index) => (
                <div className="flex space-x-1">
                  <p className="text-sm">{"."}</p>
                  <p key={index} className="text-sm">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${spaceStarRating ? "block" : "hidden"} flex`}>
            {submitReview.StarRating.map((star, index) =>
              !star ? 
              <div id={`${index}`} onClick={(e)=>{
               
               const array = [...submitReview.StarRating]
               array[Number(e.currentTarget.id)] = !array[Number(e.currentTarget.id)]
               setSubmitReview((prevReview)=>({...prevReview,StarRating:array}))
              }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 "
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
 
              </div>
              : 
              <div id={`${index}`} onClick={(e)=>{
               
               const array = [...submitReview.StarRating]
               array[Number(e.currentTarget.id)] = !array[Number(e.currentTarget.id)]
               setSubmitReview((prevReview)=>({...prevReview,StarRating:array}))
              }}>
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
             
            )}
          </div>

          <div>
            <textarea
              ref={textareaRef}
              rows={5}
              minLength={30}
             
              className="outline-none  border-black border-2 rounded-md w-full p-2"
              value={submitReview.Message}
              onChange={(e) => {
                setSubmitReview({...submitReview,Message:e.target.value})
              }}
            ></textarea>
          </div>

          <div className="space-y-3">
            <div>
              <p className="mb-2">Attach image</p>
              <label
                htmlFor="image"
                className="p-2 rounded-md border-2 border-black "
              >
                choose a file
              </label>
              <input
                type="file"
                id="image"
                hidden
                size={5 * 1024 * 1024}
                accept=".png,.jpeg,.jpg"
                className=""
                onChange={(e) => {
                  setUploadImageBlob(URL.createObjectURL(e.target.files![0]))
                  setSubmitReview((preReview) => ({
                    ...preReview,
                    AttachImage: e.target.files![0],
                  }));
                }}
              />
              <div className={`${submitReview.AttachImage instanceof File ? 'block':"hidden"} relative w-fit`}>
              <img src={submitReview.AttachImage instanceof File ? uploadImageBlob : ''} className="w-16 rounded-md mt-7" />
              <div className="absolute -top-3 -right-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 text-blue-600 bg-white rounded-full"
                onClick={(e)=>{
                  e.stopPropagation()
                  setSubmitReview((prevReview)=>({...prevReview,AttachImage:""}))
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              </div>
              </div>

            </div>
            <div>
              <p>Name</p>
              <input
                type="text"
                className=" outline-none  border-black border-2 rounded-md w-full p-2"
                value={submitReview.YourName}
                onChange={(e) => {
                  setSubmitReview((prevReview) => ({
                    ...prevReview,
                    YourName: e.target.value,
                  }));
                }}
              />
            </div>
            <div>
              <p>Email</p>
              <input
                type="email"
                className=" outline-none  border-black border-2 rounded-md w-full p-2"
                value={submitReview.YourEmail}
                onChange={(e) => {
                  setSubmitReview((prevReview) => ({
                    ...prevReview,
                    YourEmail: e.target.value,
                  }));
                }}
              />
            </div>
            
            <div className={`${spaceSocialLinks ? "block" : 'hidden'} `}>
              <p>Socail link</p>
              <input
                type="text"
                className=" outline-none  border-black border-2 rounded-md w-full p-2"
                value={submitReview.SocialLink}
                onChange={(e) => {
                  setSubmitReview((prevReview) => ({
                    ...prevReview,
                    SocialLink: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={
                  submitReview.UploadPhoto instanceof File
                    ? attachImageBlob
                    : submitReview.UploadPhoto
                }
                className="w-16 h-16 rounded-full"
              />
              <label
                htmlFor="inputimage"
                className=" border-2 border-gray-200 px-2 py-1 rounded-md h-fit "
              >
                upload a photo
                <input
                  type="file"
                  id="inputimage"
                  hidden
                  accept=".jpg ,.png ,jpeg"
                  size={5 * 1024 * 1024}
                  onChange={(e) => {
                    setAttachImageBlob(URL.createObjectURL(e.target.files![0]))
                    setSubmitReview((prevReview) => ({
                      ...prevReview,
                      UploadPhoto: e.target.files![0],
                    }));
                  }}
                />
              </label>
            </div>

            <div className="flex items-baseline space-x-2">
              <input
                type="checkbox"
                checked={submitReview.checkbox}
                onChange={(e) => {
                  setSubmitReview((prevReview) => ({
                    ...prevReview,
                    checkbox: e.target.checked,
                  }));
                }}
              />
              <p>
                I give permission to use this testimonial across social channels
                and other marketing efforts
              </p>
            </div>
          </div>

          <div>
            <button className="w-full p-2 bg-black text-white rounded-md" ref={SumbitButtonRef} disabled={false} onClick={submitForm}>
              submit
            </button>
          </div>
        </div>
      </>
    );
}