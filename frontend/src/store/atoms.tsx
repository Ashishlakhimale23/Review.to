import { atom} from "recoil";

interface Space{
  spaceName : string,
  spaceImage : string,
  spaceTitle : string,
  spaceCustomMessage : string,
  spaceQuestion: string[],
  spaceSocialLinks :boolean,
  spaceStarRating : boolean ,
  spaceTheme :boolean 
}

const defaultSpace:Space = {
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