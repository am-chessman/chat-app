export default function Home() {
    return (
        <>
            <form action="/" method="post" className="relative flex flex-col justify-center items-center gap-4 h-full font-mono">
                <h1 className="text-[#6a5acd] text-[3.5rem] m-0">Login</h1>
                <input type="text" name="username" placeholder="Username" autoComplete="off" className="w-full h-[2.5rem] pl-2.5 pr-2.5 font-mono border-[1px] border-[#6a5acd] text-[1.1rem] outline-none" />
                <input type="password" name="password" placeholder="Password" className="w-full h-[2.5rem] pl-2.5 pr-2.5 font-mono border-[1px] border-[#6a5acd] text-[1.1rem] outline-none" />
                <div className="flex flex-col justify-center items-center ">
                    <div className="w-full text-left ">
                        <a href="#" className="underline">Forgot password?</a>
                    </div>
                    <div className="w-full text-right">
                        <a href="/signup" className="underline">Create account</a>
                    </div>
                </div>
                <input type="submit" value="Login" className="w-full h-[2.5rem] pl-2.5 pr-2.5 font-mono border-[1px] border-[#6a5acd] text-[1.2rem] cursor-pointer bg-[#d2d1d1] outline-none" />
                {/*<%if (locals) {%>*/}
                {/*<p class="error-field"><%= error_msg %></p>*/}
                {/*<%}%>*/}
            </form>

            {/*<script>*/}
            {/*  const errorMsgElement = document.querySelector('.error-field')*/}
            {/*  setTimeout(() => {*/}
            {/*  if(errorMsgElement) {*/}
            {/*  errorMsgElement.remove();*/}
            {/*}*/}
            {/*}, 3000)*/}
            {/*</script>*/}
        </>
    );
}
