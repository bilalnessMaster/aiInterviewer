'use client'

import { useEffect, useState } from "react";
import { vapi } from "./utils/vapi";
import Agent from "@/components/Agent";
import {motion, AnimatePresence } from "motion/react";
import { AudioLines, User } from "lucide-react";

export default function Home() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [message , setMessage] = useState('')
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [userSpeak , setUserSpeaks] = useState(false)


  // hook into Vapi events
  useEffect(() => {

    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
    });

    vapi.on("message", (message) => {
      console.log(message);
      if(message?.role === 'user'){
        setUserSpeaks(true)
        setMessage(message?.transcript)
      }else if(message?.role === 'assistant' ){
        setUserSpeaks(false)
        if(message?.transcriptType === 'final'){
          setMessage(message?.transcript)
        }
      }else{
        setUserSpeaks(false)
      }
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
    });

    vapi.on("speech-start", () => {      
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
      setConnecting(false);
    });

  }, []);

  const startCall = async () => {
    setConnected(true)
    vapi.start('1957508e-2b35-47e7-a925-89543f151811' , assistantOverrides);
  }
  const endCall = () => {
    vapi.stop();
  };
  return (
    <div className="h-screen flex flex-col  gap-16 items-center justify-center ">
      <div className="max-w-5xl w-full  mx-auto grid grid-cols-2 gap-3">
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
            initial={{opacity: 0 ,y: 40}}
            animate={{opacity: 1 ,y: 0}}
            exit={{opacity: 0 ,y: -40}}
            transition={{duration : 0.5 , ease : 'easeInOut'}}
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 items-center justify-center ">
        <button className="cursor-pointer  size-12 rounded-full bg-green-50 items-center justify-center flex " onClick={startCall}>
          <i className="hgi hgi-stroke hgi-call-ringing-04 text-green-700 text-2xl"></i>
        </button>
        <button className="cursor-pointer size-12 rounded-full bg-red-50 items-center justify-center flex " onClick={endCall}>
          <i className="hgi hgi-stroke hgi-call-disabled-02 text-2xl text-red-700"></i>
        </button>

      </div>
    </div>
  );
}


const assistantOverrides = {
 
    variableValues: {
        userid : 'userid'
    }
};
