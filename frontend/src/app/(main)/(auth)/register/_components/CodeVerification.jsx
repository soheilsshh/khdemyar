import Timer from "@/components/Timer"
import React, { useRef } from "react"

export default function CodeVerification({ phoneNumber, onSubmit, onChangePhone, code, setCode }) {
  const codeRefs = useRef([...Array(5)].map(() => React.createRef()))

  const handleChange = (e, index) => {
    const value = e.target.value
    if (!/^[0-9]?$/.test(value)) return

    const newCodes = [...code]
    newCodes[index] = value
    setCode(newCodes)

    if (value && index < codeRefs.current.length - 1) {
      codeRefs.current[index + 1].current.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        codeRefs.current[index - 1].current.focus()
      }
    }
  }

  const handleVerify = () => {
    if (code.every((c) => c !== '')) {
      onSubmit()
    }
  }

  return (
    <div className="rounded-lg flex flex-col lg:bg-dGray ">
      <div className="mb-4">
        کد تائید به شماره
        <span className="font-iranianSansDemiBold text-dBlue"> {phoneNumber} </span>
        ارسال شد.
      </div>
      <div className="flex justify-between text-xs font-iranianSansDemiBold items-center gap-2 mt-3">
        <div>کد دریافتی را وارد کنید:</div>
        <div className="flex justify-center items-center gap-1">
          <Timer seconds={90} />
          <div>تا ارسال مجدد</div>
        </div>
      </div>

      <div className="flex flex-col">
        <div dir="ltr" className="flex gap-2 pt-5 justify-around">
          {codeRefs.current.map((ref, i) => (
            <div key={i} className="w-10 h-12 md:w-15 md:h-17">
              <div className=" w-10 h-12 md:w-15 md:h-17 bg-green-700 shadow-lg rounded-[10px]">
                <input
                  ref={ref}
                  maxLength={1}
                  value={code[i]}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={`bg-gray-100  lg:bg-white w-full outline-none rounded-lg text-center
                    ${code[i] ? 'bottom-0 h-[95%] rounded-b-md' : 'h-full'}
                    font-iranianSansDemiBold text-xl`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-5 mt-8">
        <button className="bg-green-700 shadow-lg text-white cursor-pointer rounded-md w-full p-2" onClick={onChangePhone}>
          تغییر شماره
        </button>
        <button className="bg-green-700 shadow-lg cursor-pointer text-white rounded-md w-full p-2" onClick={handleVerify}>
          تایید کد
        </button>
      </div>
    </div>
  )
}
