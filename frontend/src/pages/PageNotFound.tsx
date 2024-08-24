import puzzled from "../assets/pzzled.gif"
export function PageNotFound(){
    return (
      <>
        <div className="h-svh w-full bg-black flex flex-col justify-center space-y-2 items-center p-5 text-white font-space">
          <p className="text-2xl">Sorry page not found</p>
          <img src={puzzled} alt="not found" className="max-w-60 rounded-md" />
        </div>
      </>
    );
}