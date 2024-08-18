import { AxiosError, AxiosResponse } from "axios"

export interface Space{
  spaceName : string,
  spaceImage : File | string,
  spaceTitle : string,
  spaceCustomMessage : string,
  spaceQuestion: string[],
  spaceSocialLinks :boolean,
  spaceStarRating : boolean ,
  spaceTheme :boolean 

}

export interface PublishedSpace{
  PublishedName :string, 
  PublishedLink :string,
  Published:boolean
}

export interface DeleteSpace{
  DeleteStatus:boolean,
  DeleteValue:string
  DeleteId:string
}


export interface CustomAxiosError extends AxiosError{
  response?:AxiosResponse<{message:string}>

}

export interface Submitform{
  Message:string,
  AttachImage:File | string,
  SocialLink?:string, 
  YourName:string,
  YourEmail:string,
  UploadPhoto : File | string,
  checkbox : boolean,
  StarRating :boolean[]

}