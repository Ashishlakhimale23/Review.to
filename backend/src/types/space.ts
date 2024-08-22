
export interface Space{
  spaceName : string,
  spaceImage : string,
  spaceTitle : string,
  spaceCustomMessage : string,
  spaceQuestion: string[],
  spaceSocialLinks :boolean,
  spaceStarRating : boolean ,
  spaceTheme :boolean 
}

export interface SumbitReivew{
  Message:string,
  AttachImage?:Express.Multer.File,
  SocialLink?:string, 
  YourName:string,
  YourEmail:string,
  UploadPhoto: Express.Multer.File ,
  StarRating?:boolean[]

}