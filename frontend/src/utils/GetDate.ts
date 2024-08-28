
const Month = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
]
export function getdate(value:Date){
    const date = new Date(value);
    const day = date.getDate() ;
    const month = Month[date.getMonth()];
    const year = date.getFullYear();
    const fulldate = day +" " + month + " " + year ;
    return fulldate; 
}
