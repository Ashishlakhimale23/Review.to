import { MultipleTestiomial } from "../types/types";
import { getdate } from "../utils/GetDate";

export function MultipleReviewsCard({ Review }:{Review:MultipleTestiomial}) {
  const { StarRating, Message, AttachImage, UploadPhoto, YourName, createdAt } = Review;

  return (
    <div className="bg-white border-2 border-black rounded-lg overflow-hidden shadow-lg  font-space h-fit ">
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <img
            src={UploadPhoto as string}
            alt={YourName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="">{YourName}</p>
        </div>

        {StarRating && (
          <div className="flex">
            {StarRating.map((star, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`w-5 h-5 ${star ? "fill-yellow-400" : "fill-white"}`}
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
          </div>
        )}

        {AttachImage && (
          <img
            src={AttachImage as string}
            alt="Review attachment"
            className="w-full h-auto rounded-md object-cover"
          />
        )}

        <p className="text-black break-words">{Message}</p>

        <p className="text-sm ">{getdate(createdAt)}</p>
      </div>
    </div>
  );
}

