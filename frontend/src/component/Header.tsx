import { ReactElement } from "react";

export function Header():ReactElement{
    return(
        <>
          <div className="bg-black flex justify-between items-center px-3 py-2 sm:px-6 md:px-12  lg:px-24">
            <p className="text-white text-xl font-space font-bold md:text-2xl">Review.to</p>
            <img src="https://res.cloudinary.com/ddweepkue/image/upload/v1719301620/coursefiles/0cecfa5bd56a3a089467769c9ede571e.jpg" 
            className="w-11 h-11 rounded-full hover:opacity-75 md:w-[50px] md:h-[50px]"
            />
          </div>
        </>
    )
}