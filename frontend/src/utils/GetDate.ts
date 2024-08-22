
const Month = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
]
export function getdate(value:Date){
    let date = new Date(value);
    let day = date.getDate() ;
    let month = Month[date.getMonth()];
    let year = date.getFullYear();
    let fulldate = day +" " + month + " " + year ;
    return fulldate; 
}
