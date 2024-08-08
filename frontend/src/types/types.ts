import { AxiosError, AxiosResponse } from "axios"

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