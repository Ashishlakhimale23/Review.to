import { useRecoilValue, useSetRecoilState } from "recoil"
import { Space } from "../types/types"
import { defaultSpace, SpaceLogo, SubmitReviewModal } from "../store/atoms"
export function PreviewCard({space}:{space:Space}){
    const {spaceImage,spaceTitle,spaceCustomMessage,spaceQuestion} = space
    const setSubmitReviewModal = useSetRecoilState<boolean>(SubmitReviewModal)
    const spaceLogo = useRecoilValue(SpaceLogo)
    const pathname  = window.location.pathname

    return(
        <>
        <div className="w-full md:max-w-96 h-fit border-2 border-black font-space mb-9 shadow-2xl rounded-md p-3 sm:py-10 sm:px-8">
            <div className="flex justify-center mb-3">
                <img src={typeof spaceImage === 'string' ? spaceImage : spaceImage instanceof File  ? spaceLogo : defaultSpace.spaceImage as string}  alt="" className="w-14 h-14 rounded-full " />
            </div>

            <div className="mb-3">
                <p className="text-xl text-center">{spaceTitle.length?spaceTitle:"Header goes here..."}</p>
            </div>

            <div className="mb-3">
                <p className=" text-center">{spaceCustomMessage.length?spaceCustomMessage:"your custom message goes here..."}</p>
            </div>

            <div className="mb-3">
                <p className="text-xl mb-1">Question</p>
                <div className="space-y-1">
                    {
                       spaceQuestion.map((question,index) => (
                       <div key={index} className="flex"> 
                        <p key={index}>{question}</p>
                       </div>
                       ))
                    }
                </div>
            </div>

            <div><button className="w-full bg-black text-white py-2 rounded-md" disabled={pathname === '/createspace'} onClick={()=>{
                setSubmitReviewModal(true)
            }}>send in text</button></div>

        </div>
        </>
    ) 
}