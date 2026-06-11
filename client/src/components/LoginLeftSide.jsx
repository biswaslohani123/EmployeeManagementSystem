import React from 'react'
import download from '../assets/download.jpg'


const LoginLeftSide = () => {

  return (

    <div className='hidden md:flex w-1/2  relative overflow-hidden border-r border-slate-200'>

        <img src={download} alt=""  className='absolute w-full h-full'/>

            
    </div>
  )
}

export default LoginLeftSide