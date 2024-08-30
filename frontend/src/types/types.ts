import { AxiosError, AxiosResponse } from "axios"

export interface Space{
  spaceName : string,
  spaceImage : File | string,
  spaceTitle : string,
  spaceCustomMessage : string,
  spaceQuestion: string[],
  spaceSocialLinks :boolean,
  spaceStarRating : boolean ,
  _id?:string

}

export interface PublishedSpace{
  PublishedName :string, 
  PublishedLink :string,
  Published:boolean
}

export interface DeleteSpaceType{
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
  checkbox ?: boolean,
  StarRating :boolean[]
  createdAt?: Date
  WallOfFame?:boolean
  _id?:string

}

export interface GetAllReviews extends Space {
  Reviews:Submitform[],
  spaceLink:string
}

export interface SingleTestiomial{
  _id:string,
  spacelink:string,
  Message:string,
  AttachImage: string,
  YourName:string,
  UploadPhoto :string,
  StarRating :boolean[]
  openstatus:boolean,
}

export interface MultipleTestiomial{
  _id:string,
  spacelink:string,
  Message:string,
  AttachImage: string,
  YourName:string,
  UploadPhoto :string,
  StarRating :boolean[]
  createdAt:Date
}