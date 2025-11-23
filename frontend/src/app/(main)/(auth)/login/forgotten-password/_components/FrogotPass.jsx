'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CodeVerification from '../../../register/_components/CodeVerification'
import { useRouter } from "next/navigation"
import EnterPhone from '../../../register/_components/EnterPhone'
import NewPass from './NewPass'

function FrogotPass({ onNext }) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [code, setCode] = useState(["", "", "", "", ""])

    const handleSubmitCode = () => {
        setStep(3)
        const fullCode = code.join("")
        console.log("کد وارد شده:", fullCode)
    }

    const handlePhoneChange = (e) => {
        setPhoneNumber(e.target.value)
    }

    const animationProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
    }

    const prevStep = () => {
        setStep(1)
        setCode(["", "", "", "", ""])
    }

    return (
        <div className="relative min-h-[200px] h-full  ">

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="enterPhone" {...animationProps}>
                        <EnterPhone
                            onNext={() => setStep(2)}
                            onChange={handlePhoneChange}
                            phoneNumber={phoneNumber}
                        />
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="codeVerification" {...animationProps}>
                        <CodeVerification
                            phoneNumber={phoneNumber}
                            onSubmit={handleSubmitCode}
                            code={code}
                            setCode={setCode}
                            onChangePhone={prevStep}
                        />
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="newPass" {...animationProps}>
                        <NewPass
                            phoneNumber={phoneNumber}
                            onSubmit={handleSubmitCode}
                            code={code}
                            setCode={setCode}
                            onChangePhone={prevStep}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FrogotPass
