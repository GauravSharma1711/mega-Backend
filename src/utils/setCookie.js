

 const setCookie = (res,accessToken,refreshToken)=>{

    const cookieOptions  = {
        httpOnly:true,
        sameSite:'strict'
    }

    res.cookie("accessToken",accessToken,cookieOptions);
    res.cookie("refreshToken",refreshToken,cookieOptions);


}

export default setCookie