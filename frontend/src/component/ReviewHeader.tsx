import { useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil";
import { EditFormModal } from "../store/atoms";

export function ReviewHeader({spaceLink,spaceImage,spaceName}:{spaceLink:string,spaceImage:string,spaceName:string}){
  const navigate = useNavigate();
  const setEditFormModal = useSetRecoilState(EditFormModal);
  return (
    <div className="w-full h-fit font-space text-white p-3 max-w-3xl py-10 space-y-2">
      <div className="flex items-center space-x-2 md:justify-center ">
        <img src={spaceImage} alt="" className="w-20 rounded-lg" />
        <p className="sm:text-2xl font-bold ">{spaceName}</p>
      </div>

      <div className="sm:flex sm:justify-between">
        <div>
          <p>space url:</p>
          <p
            onClick={() => {
              navigate(`/review/${spaceLink}`);
            }}
            className="hover:underline hover:text-blue-400 break-words cursor-pointer"
          >{`http:reviewto.netlify.app/review/${spaceLink}`}</p>
        </div>
        <button
          className="p-2 border-2 border-white w-full rounded-md hover:bg-white hover:text-black sm:w-fit"
          onClick={() => {
            setEditFormModal(true);
          }}
        >
          edit space
        </button>
      </div>
    </div>
  );
}
