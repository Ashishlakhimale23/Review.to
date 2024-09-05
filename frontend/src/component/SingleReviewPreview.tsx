import { useRecoilState} from "recoil"
import { defaultSingleReview, SingleReview } from "../store/atoms"
import { SingleReviewCard } from "./SingleReviewCard";
import {  Submitform } from "../types/types";
import { toast } from "react-toastify";

export function SingleReviewPreview(){
  const [singlereveiw, setSinglereveiw] = useRecoilState(SingleReview);
  const {
    openstatus,
    spacelink,
    _id,
    Message,
    StarRating,
    YourName,
    AttachImage,
    UploadPhoto,
  } = singlereveiw;
  const Review: Submitform = {
    Message: Message,
    YourName: YourName,
    AttachImage: AttachImage,
    UploadPhoto: UploadPhoto,
    StarRating: StarRating,
    YourEmail: "",
  };
  return (
    <>
      <div
        className={`${
          openstatus ? "visible" : "hidden"
        } w-full h-fit max-w-4xl bg-white space-y-4 rounded-md font-space px-3 py-3 `}
      >
        <div>
          <div className="flex justify-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6"
              onClick={() => {
                setSinglereveiw(defaultSingleReview);
              }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p>Embed these testimonial in your website</p>
        </div>

        <div className="">
          <SingleReviewCard Review={Review} />
        </div>

        <div className="overflow-scroll p-2">
          <pre>
            <code>
              &lt;script type="text/javascript"
              src="https://review-to.onrender.com/space/getfile"&gt;&lt;/script&gt;
              <br />
              &lt;iframe id="resizable-iframe" src=
              {`https://reviewto.netlify.app/${spacelink}/${_id}`} width="100%"
              &gt;&lt;/iframe&gt;
            </code>
          </pre>
        </div>

        <div>
          <button
            className="w-full p-2 bg-black text-white rounded-md"
            onClick={() => {
              navigator.clipboard.writeText(
                "<script type='text/javascript' src='https://review-to.onrender.com/space/getfile'></script>\n" +
                  `<iframe id="resizable-iframe" src='https://reviewto.netlify.app/${spacelink}/${_id}' width='100%' frameborder='no' scrolling='no'></iframe>`
              );
              return toast.success("Copied");
            }}
          >
            Copy code
          </button>
        </div>
      </div>
    </>
  );
}