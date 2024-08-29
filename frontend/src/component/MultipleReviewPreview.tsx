import React, { SetStateAction } from "react";
import { toast } from "react-toastify";

export function MultipleReviewPreview({spacelink,setOnComponent}:{spacelink:string,setOnComponent:React.Dispatch<React.SetStateAction<string>>}){

   
    return (
      <>
        <div
          className={`w-full  max-w-4xl bg-white space-y-4 rounded-md font-space px-3 py-3 `}
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
                onClick={()=>{
                    setOnComponent("text review")
                }}

                
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-xl font-semibold">Embed these testimonial in your website</p>
          </div>

          <div className=" w-full flex  justify-center">
            <p className="text-2xl font-semibold">Preview</p>
          </div>
<div className=" w-full flex  justify-center">
            <a href={`http://localhost:5173/multiple/${spacelink}`} target="_blank" className="hover:underline hover:text-blue-600">
{`http://localhost:5173/multiple/${spacelink}`}
            </a>
          </div>
          <div className="overflow-scroll p-2">
  <pre>
    <code>
      &lt;script type="text/javascript" src="http://localhost:8000/space/getfile"&gt;&lt;/script&gt;
      <br />
      &lt;iframe id="resizable-iframe" src={`http://localhost:5173/multiple/${spacelink}`} width="100%" &gt;&lt;/iframe&gt;
    </code>
  </pre>
</div>

<div>
   <button
    className="w-full p-2 bg-black text-white rounded-md"
    onClick={() => {
      navigator.clipboard.writeText(
        "<script type='text/javascript' src='http://localhost:8000/space/getfile'></script>\n" +
        `<iframe id="resizable-iframe" src='http://localhost:5173/multiple/${spacelink}' width='100%' frameborder='no' scrolling='no'></iframe>`
      );
      return toast.success("Copied")
    }}
  >
    Copy code
  </button>
     
</div>

        </div>
      </>
    );

}