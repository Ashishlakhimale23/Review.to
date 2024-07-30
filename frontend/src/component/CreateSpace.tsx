import { CreateSpaceInfo } from "./CreateSpaceInfo";
import { PreviewCard } from "./PreviewCard";

export function CreateSpace(){
    return (
      <>
        <div className=" h-full w-full p-3 sm:px-10 sm:py-4 md:flex  md:justify-center md:items-center md:p-5">
          <div className="bg-white rounded-md px-2 py-3 w-fit h-fit shadow-lg border-2 border-black sm:px-6 sm:py-8 md:flex md:space-x-10 max-w-6xl">
            <PreviewCard />
            <CreateSpaceInfo />
          </div>
        </div>
      </>
    );
}