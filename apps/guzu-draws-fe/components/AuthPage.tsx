export function AuthPage({isSignIn}: {
    isSignIn: boolean
}){


    return <div className="h-screen w-screen flex justify-center items-center bg-black">
        <div className="p-4 m-2 w-60 h-50 bg-white rounded flex flex-col justify-around">
           <div>
             <input className="p-2 rounded mb-2 bg-gray-200 w-full" type="text" placeholder="Email" />
            <input className="p-2 rounded bg-gray-200 w-full" type="password" placeholder="Password"/>
           </div>

            <button className="rounded p-2 bg-green-300 w-full" onClick={()=>{
                
            }} >
                {isSignIn? "Sign In": "Sign Up"}
            </button>
        </div>

    </div>

}