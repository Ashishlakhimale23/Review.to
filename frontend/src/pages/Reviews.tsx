import { useQuery } from "@tanstack/react-query";
import {useParams } from "react-router-dom";
import {api} from "../utils/AxiosApi"
import { CustomAxiosError, GetAllReviews, Space} from "../types/types";
import { ReviewHeader } from "../component/ReviewHeader";
import { PreviewCard } from "../component/PreviewCard";
import {toast} from "react-toastify"
import { CreateSpaceInfo } from "../component/CreateSpaceInfo";
import {  useRecoilState} from "recoil";
import { defaultSpace,  EditFormModal, SpaceState ,SingleReview } from "../store/atoms";
import {  useEffect, useState} from "react";
import loading from "../assets/loading.gif"
import { ReviewText } from "../component/ReviewText";
import { useRecoilValue } from "recoil";
import { SingleReviewPreview } from "../component/SingleReviewPreview";
import { MultipleReviewPreview } from "../component/MultipleReviewPreview";

export function Reviews(){
  const { spaceLink } = useParams();
  const [space, setSpace] = useRecoilState(SpaceState);
  const [editModal, setEditModal] = useRecoilState(EditFormModal);
  const [onComponent, setOnComponent] = useState("text review");
  const { openstatus } = useRecoilValue(SingleReview);

  const GetReviews = async (): Promise<GetAllReviews> => {
    const response = await api.post(`/space/getallreviews`, {
      spaceLink: spaceLink,
    });
    return response.data.result;
  };

  const { data, isLoading, isError, error, isSuccess } = useQuery<
    GetAllReviews,
    CustomAxiosError
  >({
    queryKey: ["review", spaceLink],
    queryFn: GetReviews,
  });
  useEffect(() => {
    const storedSpace = localStorage.getItem("space");
    if (storedSpace) {
      setSpace(JSON.parse(storedSpace));
    } else {
      setSpace(defaultSpace);
    }
    return () => {
      setSpace(defaultSpace);
      setEditModal(false);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      const newSpace: Space = {
        spaceName: data.spaceName,
        spaceImage: data.spaceImage,
        spaceQuestion: data.spaceQuestion,
        spaceCustomMessage: data.spaceCustomMessage,
        spaceSocialLinks: data.spaceSocialLinks,
        spaceStarRating: data.spaceStarRating,
        spaceTitle: data.spaceTitle,
        _id: data._id,
      };
      setSpace(newSpace);
      localStorage.setItem("space", JSON.stringify(newSpace));
    }
  }, [isSuccess, data, setSpace]);

  if (isLoading) {
    return (
      <div className=" h-svh w-full flex justify-center items-center p-5 bg-black">
        <img src={loading} alt="Loading" className="max-w-60" />
      </div>
    );
  }
  if (isError) {
    if (error.response) {
      return toast.error(
        error.response.data?.message || "Error creating space"
      );
    } else if (error.request) {
      return toast.error("No response from server. Please try again.");
    } else {
      return toast.error("Error setting up request. Please try again.");
    }
  }

  if (editModal) {
    return (
      <div className=" h-full w-full py-5 px-3 sm:px-10 sm:py-4 md:flex  md:justify-center md:items-center md:p-5">
        <div className="bg-white rounded-md px-2 py-5 w-fit h-fit shadow-lg border-2 border-black sm:px-6 sm:py-8 md:flex md:space-x-10 max-w-6xl">
          <PreviewCard space={space} />
          <CreateSpaceInfo />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="w-full min-h-screen bg-black">
        <div className="md:flex md:justify-center md:items-center">
          <ReviewHeader
            spaceImage={data?.spaceImage as string}
            spaceLink={data?.spaceLink as string}
            spaceName={data?.spaceName as string}
          />
        </div>
        <div className="w-full min-h-screen p-3 font-space ">
          <div className="w-full h-fit">
            <div
              className={`text-white space-y-1 text-lg bg-silver rounded-md p-2 max-w-xl mx-auto 
                        middle:max-w-fit middle:space-y-0 middle:space-x-2 middle:flex middle:justify-center `}
            >
              <button
                className={`block w-full middle:w-auto p-2 text-left hover:bg-white hover:text-black rounded-md ${
                  onComponent == "text review" ? "bg-white text-black" : ""
                }`}
                onClick={() => {
                  setOnComponent("text review");
                }}
              >
                Text Review
              </button>
              <button
                className={`block w-full middle:w-auto p-2 text-left hover:bg-white hover:text-black rounded-md ${
                  onComponent == "love" ? "bg-white text-black" : ""
                }`}
                onClick={() => {
                  !data?.Reviews.filter((review) => review.WallOfFame == true)
                    .length
                    ? toast.error("Wall of love is empty")
                    : setOnComponent("love");
                }}
              >
                Wall of Love
              </button>
            </div>
          </div>
          <div className="flex-1 mt-2">
            {!data?.Reviews.length && (
              <div className="text-2xl font-space text-white w-full text-center p-5">
                No Reviews Present
              </div>
            )}
            {onComponent == "text review" && data && <ReviewText data={data} />}
          </div>
        </div>
      </div>

      <div
        className={`${
          openstatus ? "top-0" : "top-full"
        }  fixed px-2 w-full h-screen flex justify-center items-center sm:px-10 `}
      >
        <SingleReviewPreview />
      </div>

      <div
        className={`${
          onComponent == "love" ? "top-0" : "top-full"
        }  fixed px-2 py-2 w-full h-screen flex justify-center items-center sm:px-10 `}
      >
        {onComponent == "love" && (
          <MultipleReviewPreview
            spacelink={data?.spaceLink as string}
            setOnComponent={setOnComponent}
          />
        )}
      </div>
    </>
  );
}