import NotFound from "../assets/NotFound.jpg"
export function PageNotFound(){
  return (
    <>
      <div className="h-svh w-full bg-black flex flex-col justify-center space-y-2 items-center p-5 text-white font-space">
        <img src={NotFound} alt="not found" className=" rounded-md" />
      </div>
    </>
  );
}