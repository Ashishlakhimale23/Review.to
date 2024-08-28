import { atom} from "recoil";
import { Space,PublishedSpace,DeleteSpaceType, SingleTestiomial} from "../types/types";

export const defaultSpace:Space = {
  spaceName :'',
  spaceImage: "https://res.cloudinary.com/ddweepkue/image/upload/v1719301620/coursefiles/0cecfa5bd56a3a089467769c9ede571e.jpg",
  spaceTitle:'',
  spaceCustomMessage:'',
  spaceQuestion:[
        "who are you / what are you working on?",
        "How has [our product / service] helped you?",
        "what is the best thing about [our product/services]?",
    ],
  spaceSocialLinks:false,
  spaceStarRating:false,
  spaceTheme:false,
  _id:""
}

export const defaultPublished:PublishedSpace = {
  PublishedName:"",
  PublishedLink:"",
  Published:false
}

export const defaultDeleteState:DeleteSpaceType={
  DeleteStatus:false,
  DeleteValue:"",
  DeleteId:'',
}

export const defaultSingleReview:SingleTestiomial={
  _id:'',
  spacelink:"",
  Message:'',
  StarRating:[true,true,true,true,true],
  YourName:'',
  UploadPhoto:'',
  AttachImage:'',
  openstatus:false,
}

export const SpaceState = atom<Space>({ 
  key:"Space",
  default:(()=>{
    const saved = localStorage.getItem("space");
    return saved ? JSON.parse(saved) as Space : defaultSpace
  })()
})

export const LoggedState = atom<boolean>({
   key:"LoggedState",
   default:false
})

export const PublishedState = atom<PublishedSpace>({
  key:"PublishedState",
  default:defaultPublished
})

export const DeleteState = atom<DeleteSpaceType>({
  key:"DeleteState",
  default:defaultDeleteState
})

export const SettingsModal = atom<boolean>({
  key:'SettingsModal',
  default:false
  
})

export const SubmitReviewModal = atom<boolean>({
  key:"SubmitReviewModal",
  default:false
})

export const EditFormModal = atom<boolean>({
  key:"EditFormModal",
  default:false
})

export const SpaceLogo = atom<string>({
  key:'SpaceLogo',
  default:''
})

export const SingleReview =atom<SingleTestiomial>({
  key:"SingleReview",
  default:defaultSingleReview
})