
import {  Submitform } from "../types/types";

export function SingleReviewCard({Review}:{Review:Submitform}){
  const { Message, AttachImage, YourName, UploadPhoto, StarRating } = Review;

  return (
    <>
      <div className="h-fit w-full font-space text-black p-5  rounded-lg space-y-5 max-w-4xl border-2 border-black shadow-lg bg-white ">
        <div className="space-y-5">
          <div>
            <div className={`${StarRating ? "block" : "hidden"} flex`}>
              {StarRating.map((star, index) =>
                !star ? (
                  <div id={`${index}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div id={`${index}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 fill-yellow-400"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                )
              )}
            </div>
          </div>
          <p className="break-words ">{Message}</p>
        </div>

        <div className={`${AttachImage ? "block" : "hidden"} `}>
          <img
            src={AttachImage as string}
            className="rounded-md w-24 sm:w-36"
          />
        </div>

        <div className=" space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <img
                src={UploadPhoto as string}
                className="w-10 h-10 rounded-full"
              />
              <p className="break-words">{YourName}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}