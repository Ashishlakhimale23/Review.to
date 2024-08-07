
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