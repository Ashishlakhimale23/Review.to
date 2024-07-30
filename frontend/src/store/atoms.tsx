import { atom } from "recoil";

export const SpaceNameState = atom<string>({
  key: "spaceName",
  default: (() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("space");
      return saved ? JSON.parse(saved).spaceName as string : "";
    }
    return "";
  })()
});

export const SpaceImageState = atom<string>({
    key:"spaceImage",
    default:(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("space");
      return saved ? JSON.parse(saved).spaceImage as string : "https://res.cloudinary.com/ddweepkue/image/upload/v1719301620/coursefiles/0cecfa5bd56a3a089467769c9ede571e.jpg";
    }
    return "https://res.cloudinary.com/ddweepkue/image/upload/v1719301620/coursefiles/0cecfa5bd56a3a089467769c9ede571e.jpg" ;
  })()
        
})

export const SpaceTitleState = atom<string>({
    key:"spaceTitle",
    default:(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("space");
      return saved ? JSON.parse(saved).spaceTitle as string : "";
    }
    return "";
  })()
})

export const SpaceCustomMessage = atom<string>({
    key:"spaceCustomMessage",
    default:(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("space");
      return saved ? JSON.parse(saved).spaceCustomMessage as string : "";
    }
    return "";
  })()
})

export const SpaceQuestion = atom<string[]>({
    key:"spaceQuestion",
    default:(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("space");
      return saved ? JSON.parse(saved).spaceQuestion as string[] : [
        "who are you / what are you working on?",
        "How has [our product / service] helped you?",
        "what is the best thing about [our product/services]?",
    ];
    }
    return [
        "who are you / what are you working on?",
        "How has [our product / service] helped you?",
        "what is the best thing about [our product/services]?",
    ];
  })()
        
    
})

export const SpaceSocialLinks = atom<boolean>({
    key:"spaceSocialLinks",
    default:(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("space");
      return saved ? JSON.parse(saved).spaceSocialLinks as boolean :false 
    }
    return false;
  })()
})

export const SpaceStarRating = atom<boolean>({
    key:"spaceStarRating",
    default:(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("space");
      return saved ? JSON.parse(saved).spaceStarRating as boolean :false 
    }
    return false;
  })()
})

export const SpaceTheme = atom<boolean>({
    key:"spaceTheme",
    default:(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("space");
      return saved ? JSON.parse(saved).spaceTheme as boolean :false 
    }
    return false;
  })()
})