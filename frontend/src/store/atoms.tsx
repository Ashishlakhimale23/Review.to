import { atom} from "recoil";
import { Space,PublishedSpace,DeleteSpace} from "../types/types";

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
  spaceTheme:false
}

export const defaultPublished:PublishedSpace = {
  PublishedName:"",
  PublishedLink:"",
  Published:false
}

export const defaultDeleteState:DeleteSpace={
  DeleteStatus:false,
  DeleteValue:"",
  DeleteId:'',
}
export const SpaceState = atom<Space>({ 
  key:"Space",
  default:(()=>{
    const saved = localStorage.getItem("space");
    console.log(saved)
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

export const DeleteState = atom<DeleteSpace>({
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