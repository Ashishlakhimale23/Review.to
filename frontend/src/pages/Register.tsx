import { useCallback,useEffect,useState } from "react";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {auth} from "../utils/FirebaseAuth"
import "react-toastify/dist/ReactToastify.css";
import {z} from "zod"
import {createUserWithEmailAndPassword, signInWithPopup , GoogleAuthProvider} from "firebase/auth"
import axios from "axios";
import { useRecoilState } from "recoil";
import {LoggedState} from "../store/atoms"


function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [logged, setLogged] = useRecoilState<boolean>(LoggedState);
  type SchemaProp = z.infer<typeof UserData>;

  useEffect(() => {
    if (logged) {
      navigate("/dashboard");
    }
  }, [logged, navigate]);

  const UserData = z.object({
    email: z
      .string()
      .email()
      .refine((email) => email.endsWith("@gmail.com"), {
        message: "Must be a valid Gmail address",
      }),
    password: z
      .string()
      .regex(
        /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
        "Password must be atleast 6 character longs should contain atleast one special character,number,lower case"
      ),
  });

  const DataVerfication = (data: SchemaProp) => {
    const ParsedResult = UserData.safeParse(data);
    return ParsedResult;
  };

  const handelsubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (!email.length) {
          return toast.error("Fill the email field");
        }
        if (!password.length) {
          return toast.error("Fill the password field");
        } else {
          const data = {
            email: email,
            password: password,
          };
          const PrasedResult = DataVerfication(data);
          if (!PrasedResult.success) {
            const problem: string = PrasedResult.error.issues[0].message;
            return toast(problem);
          } else {
            await createUserWithEmailAndPassword(auth, email, password)
              .then(async (userCredential) => {
                const idtoken = await userCredential.user.getIdToken(true);
                await axios
                  .post(`${process.env.BASE_URL}/user/signup`, {
                    idtoken: idtoken,
                  })
                  .then((resp) => {
                    if (Object.values(resp.data).includes("created account")) {
                      localStorage.setItem("AccessToken", idtoken);
                      setLogged(true);
                    } else {
                      return toast.error("Unable to signup please try again");
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    return toast.error("Internal server issue");
                  });
                //axios
              })
              .catch((error) => {
                const errorMessage: string = error.code;
                switch (errorMessage) {
                  case "auth/weak-password":
                    toast.error("weak password");
                    break;
                  case "auth/email-already-in-use":
                    toast.error("email already in use");
                    break;
                  case "auth/invalid-email":
                    toast.error("invalid email");
                    break;
                  case "auth/operation-not-allowed":
                    toast.error("email/password accounts are not enabled");
                    break;
                  default:
                    break;
                }
              });
          }
        }
      } catch (error) {
        return toast("unexpected error");
      }
    },
    [email, password, DataVerfication, setLogged]
  );

  const handlegooglesubmit = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider)
        .then(async (result) => {
          const idtoken: string | undefined = await result.user.getIdToken(
            true
          );

          if (!String(idtoken).length || idtoken === undefined) {
            return toast.error("error while signing up");
          }
          try {
            await axios
              .post(`${process.env.BASE_URL}/user/signup`, {
                idtoken: idtoken,
                username: result.user.displayName,
              })
              .then((resp) => {
                if (Object.values(resp.data).includes("created account")) {
                  localStorage.setItem("AccessToken", idtoken);
                  setLogged(true);
                } else {
                  return toast.error(resp.data.message);
                }
              })
              .catch((error) => {
                console.log(error);
                return toast.error("Internal server issue");
              });
          } catch (error) {
            return toast.error("Internal server issue");
          }
        })
        .catch((error) => {
          const errorMessage: string = error.code;
          switch (errorMessage) {
            case "auth/operation-not-supported-in-this-environment":
              toast.error("http protocol is not supported.please use http");
              break;
            case "auth/popup-blocked":
              toast.error("popup has been blocked by the browser");
              break;
            case "auth/popup-closed-by-user":
              toast.error("popup has been closed by user before f");
              break;
            case "auth/operation-not-allowed":
              toast.error("email/password accounts are not enabled");
              break;
            default:
              break;
          }
        });
    } catch (error) {
      toast.error("internal server issues");
    }
  };
  return (
    <>
      <div className="font-space min-h-screen flex flex-col justify-center">
        <form
          action=""
          onSubmit={handelsubmit}
          className="relative sm:w-96 mx-auto text-center"
        >
          <div className="text-4xl font-bold mb-3">
            <p>Review.to</p>
          </div>
          <label htmlFor="">
            Already have an account ?{" "}
            <a href="/login" className="underline hover:text-blue-500">
              Log in
            </a>
          </label>
          <div className="mt-4  bg-white rounded-lg border-2 border-black shadow-lg">
            <div className="px-3 py-4">
              <label className="block font-semibold  text-left">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="mt-2 focus:border-black border-2 w-full h-5  rounded-md px-4 py-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="block mt-2 font-semibold text-left">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="mt-2 w-full h-5 border-2  focus:border-black rounded-md px-4 py-5 mb-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full px-5 py-3 bg-white mt-2 text-black rounded-md  border-2 border-black hover:bg-black hover:text-white"
                >
                  Signup
                </button>
                <hr className="w-full border-black border" />
                <button
                  type="button"
                  className="w-full px-5 py-3 bg-white mt-2 text-black rounded-md  border-2 border-black hover:bg-black hover:text-white"
                  onClick={handlegooglesubmit}
                >
                  Google
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
    </>
  );
}
export default Signin;