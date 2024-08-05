import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {auth} from "./FirebaseAuth"

export let api = axios.create({
    baseURL:process.env.BASE_URL
})

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    _retry:boolean
}

class concurrency{
     queue :{resolve:Function,reject:Function}[]
     isRefreshing :boolean
     constructor(){
        this.queue = []
        this.isRefreshing = false
     }
     
     execute(refreshTokenFunction:()=>Promise<any>) {
        return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject });

      if (!this.isRefreshing) {
        this.isRefreshing = true;

        refreshTokenFunction()
          .then((token) => {
            this.queue.forEach((promise) => promise.resolve(token));
            this.queue = [];
            this.isRefreshing = false;
          })
          .catch((err) => {
            this.queue.forEach((promise) => promise.reject(err));
            this.queue = [];
            this.isRefreshing = false;
          });
      }
    });
  }

}

let concurrencynow =new concurrency()

const refreshToken = async()=>{
    const user = auth.currentUser
    const idtoken:string = await user?.getIdToken(true)!
    localStorage.setItem("AccessToken",idtoken)
    return idtoken;
}
api.interceptors.response.use(
    response=>response,
    async function (error :AxiosError) {
        const originalrequest = error.config as ExtendedAxiosRequestConfig 
        if(error.response?.status === 401 && !originalrequest._retry){
            originalrequest._retry = true
            const idtoken = concurrencynow.execute(refreshToken) 
            api.defaults.headers.common["Authorization"] =`Bearer ${idtoken}`
            return api(originalrequest) 
        }
        else{
            window.location.href = '/login'
            return Promise.reject(error)
        }
        
    }
)