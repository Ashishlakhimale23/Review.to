import { GetAllReviews } from "../types/types";
import { ReviewCard } from "./ReviewCard";
export function ReviewText({data}:{data:GetAllReviews}){
    return (
        <><div className=" sm:flex sm:justify-center ">
              {!data?.Reviews.length ? (
                <div>No reviews</div>
              ) : (
                <div className="space-y-4 sm:px-5 sm:max-w-xl md:max-w-2xl ">
                  {data?.Reviews.map((reviews, index) => (
                    <ReviewCard Review={reviews} key={index} />
                  ))}
                </div>
              )}
            </div>
</>

    )
}