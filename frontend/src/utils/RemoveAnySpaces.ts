export function RemoveAnySpaces(str:string):string{
    let name:string  = str.trim() 
    let arr = name.split(' ')
    arr = arr.filter((element)=>element!=="")
    name = arr.join("-")
    console.log(name)
    return name
}