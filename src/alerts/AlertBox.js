import React, { useContext } from 'react'
import './alerts.css'
function AlertBox({alertBoxRef,head,text}) {

  return (
      <div className="fixed w-[90%] md:w-full max-w-[600px] top-[140px] right-[5%] md:right-6 opacity-0 duration-500"  ref={alertBoxRef} >
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 ">
              {head}
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <p>
                  {text}
              </p>
          </div>
      </div>
  )
}

export default AlertBox