'use client'

import { useEffect, useRef, useState } from "react";
import { vapi } from "../../utils/vapi";
import Agent from "@/components/Agent";
import { motion, AnimatePresence } from "motion/react";
import { AudioLines, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import { interviewer } from "@/constant/interviewer";
import axios from 'axios'


export default function InterviewRoom({interview}:{interview: any}) {
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('')
    const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [userSpeak, setUserSpeaks] = useState(false)
    const [messages, setMessages] = useState<string[]>([]);
    const { data: session } = useSession()
    

    // hook into Vapi events
    useEffect(() => {

        vapi.on("call-start", () => {
            setConnecting(false);
            setConnected(true);
        });

        vapi.on("message", (message) => {
            if (message?.role === 'user') {
                setUserSpeaks(true)
                if(message?.transcript){
                    setMessage(message?.transcript)
                    setMessages(prev => [...prev, `${message?.role} : ${message?.transcript}`]);
                }
            }else if(message?.role === 'assistant') {
                setUserSpeaks(false)
                if (message?.transcriptType === 'final') {
                    setMessages(prev => [...prev, `${message?.role} : ${message?.transcript}`])
                    setMessage(message?.transcript)
                }
            } else {
                setUserSpeaks(false)
            }
        });

        vapi.on("call-end", () => {
            setConnecting(false);
            setConnected(false);
        });

        vapi.on("speech-start", () => {
            setConnected(true)
            setAssistantIsSpeaking(true);
        });

        vapi.on("speech-end", () => {
            setAssistantIsSpeaking(false);
        });

        vapi.on("volume-level", (level) => {
            setVolumeLevel(level);
        });

        vapi.on("error", (error) => {
            console.log(error);
            setConnected(false)
            setConnecting(false);
        });
    }, []);
    if (!session?.user?.id) {
        return <Loader />
    }
    const assistantOverrides = {
        variableValues: {
            questions: interview?.questions.join("\n - ")
        }
    };
    const startCall = async () => {
        setConnecting(true)
        vapi.start(interviewer, assistantOverrides);
    }
    const endCall = async () => {
        setConnected(false)
        vapi.stop();
        const {data} = await axios.post('/api/feedback' , {messages ,id:interview?.id})
        console.log(data);
        
    };
    return (
        <motion.section
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            transition={{
                duration: 0.5,
                ease: "easeInOut"
            }}
            className="h-full flex flex-col  gap-16 ">
            <div className="border-b border-neutral-200/55 font-mono   w-full p-4">
                <h1 className="first-letter:capitalize tracking-tight ">
                    Take your interview
                </h1>
            </div>
            <div className="max-w-5xl w-full  mx-auto grid grid-cols-2 gap-3 px-4">
                <div className="border border-neutral-100 h-72 bg-neutral-50  rounded flex items-center justify-center ">
                    <Agent icon={<AudioLines />} volume={volumeLevel} isSpeaking={assistantIsSpeaking} />
                </div>
                <div className="border border-neutral-100 h-72 bg-neutral-50  rounded flex items-center justify-center ">
                    <Agent icon={<User />} volume={1} isSpeaking={userSpeak} />
                </div>
            </div>
            <div className=" px-3 rounded font-mono  overflow-hidden  mx-aut h-10 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                    <motion.p
                        className="bg-yellow-300/45"
                        key={message}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                        {message}
                    </motion.p>
                </AnimatePresence>
            </div>
            <div className="flex gap-2 items-center justify-center ">
                <AnimatePresence mode="popLayout">
                    {
                        !connected ?
                            (
                                <motion.button
                                    className="cursor-pointer  size-12 rounded-full bg-green-50 items-center justify-center flex "
                                    onClick={startCall}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <i className="hgi hgi-stroke hgi-call-ringing-04 text-green-700 text-2xl"></i>
                                </motion.button>
                            ) : connecting ?
                                <div>
                                    connecting
                                </div>
                                :

                                <motion.button
                                    className="cursor-pointer  size-12 rounded-full bg-red-50 items-center justify-center flex "

                                    onClick={endCall}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <i className="hgi hgi-stroke hgi-call-disabled-02 text-2xl text-red-700"></i>
                                </motion.button>


                    }
                </AnimatePresence>
            </div>
        </motion.section>
    );
}



