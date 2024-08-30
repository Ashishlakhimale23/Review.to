import { useNavigate, useParams } from "react-router-dom"
import { PreviewCard } from "../component/PreviewCard"
import axios from "axios"
import {toast} from "react-toastify"
import { CustomAxiosError, Space } from "../types/types"
import { useQuery } from "@tanstack/react-query"
import { SubmitReviewForm } from "../component/submitReviewForm"
import { useRecoilValue } from "recoil"
import { SubmitReviewModal } from "../store/atoms"

export function SubmitReview(){
  const navigate = useNavigate();
  const { spacelink } = useParams();
  const reviewModal = useRecoilValue<boolean>(SubmitReviewModal);

  const fetchSpaceInfo = async (): Promise<Space> => {
    const response = await axios.post(
      `${process.env.BASE_URL}/space/getspacedetails`,
      { spacelink: encodeURIComponent(spacelink!) }
    );
    return response.data.details;
  };
  const {
    data: space,
    isLoading,
    isError,
    error,
  } = useQuery<Space, CustomAxiosError>({
    queryKey: ["generatedinfo"],
    queryFn: fetchSpaceInfo,
    retry: 1,
  });

  if (isLoading) {
    return (
      <>
        <div>Loading..</div>
      </>
    );
  }

  if (isError) {
    if (error!.response) {
      navigate("/dashboard");
      return toast.error(
        error!.response.data?.message || "Error fetching space"
      );
    } else if (error!.request) {
      toast.error("No response from server. Please try again.");
      navigate("/dashboard");
    } else {
      toast.error("Error setting up request. Please try again.");
      navigate("/dashboard");
    }
  }

  return (
    <>
      <div className="w-full px-2 sm:px-20 h-screen flex justify-center items-center z-10">
        <PreviewCard space={space!} />
      </div>
      <div
        className={` w-full h-screen sm:flex sm:justify-center overflow-y-scroll fixed  ${
          reviewModal ? "block top-0" : "hidden"
        }`}
      >
        <SubmitReviewForm space={{ ...space!, spacelink: spacelink! }} />
      </div>
    </>
  );
}