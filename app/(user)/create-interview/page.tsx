'use client'

import { useEffect, useState } from "react";
import { vapi } from "../../utils/vapi";
import Agent from "@/components/Agent";
import { motion, AnimatePresence } from "motion/react";
import { AudioLines, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const Router = useRouter()
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('')
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [userSpeak, setUserSpeaks] = useState(false)
  const {data : session} = useSession()
  const [redirect , setRedirect] = useState(false)

  

  // hook into Vapi events
  useEffect(() => {
    const onCallStart =  () => {
      setConnecting(false);
      setConnected(true);
    }
    const onMessage =  (message : {role: string , transcript : string , transcriptType:string}) => {
      if (message?.role === 'user') {
       setUserSpeaks(true)
       setMessage(message?.transcript)
     } else if (message?.role === 'assistant') {
       setUserSpeaks(false)
       if (message?.transcriptType === 'final') {
         setMessage(message?.transcript)
       }
     } else {
       setUserSpeaks(false)
     }
   }    
    const onCallEnd = () => {
       
        
      setRedirect(true)
      setConnecting(false);
      setConnected(false);
 
    } 
    const onSpeechStart = () => {
      setConnected(true)
      setAssistantIsSpeaking(true);
    }
    const onSpeechEnd =() => {
      setAssistantIsSpeaking(false);
    } 
    const onVolumeUp = (level:number) => {
      setVolumeLevel(level);
    }
    const onError = (error : Error) => {
      console.error("Vapi error:", error);
      setRedirect(true)
      setConnected(false)
      setConnecting(false);
    }
    vapi.on("call-start",onCallStart);

    vapi.on("message",onMessage);

    vapi.on("call-end", onCallEnd);

    vapi.on("speech-start", onSpeechStart);

    vapi.on("speech-end", onSpeechEnd);

    vapi.on("volume-level",onVolumeUp);

    vapi.on("error", onError);
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off('volume-level',onVolumeUp)
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  
  }, []);
  useEffect(()=>{
    if(redirect){
      toast.success("Your interview has been created. You will be directed to the interview page.");
      setTimeout(() => {
        Router.push("/interview");
      }, 1000);
    }
  },[redirect, Router])
  if(!session?.user?.id) {
    return <Loader />
  }
  const assistantOverrides = {
    variableValues: {
      userid: session?.user?.id
    }
  };
  const startCall = async () => {
    setConnecting(true)
    vapi.start(process.env.NEXT_PUBLIC_VAPI_CREATE_INTERVIEW_AGENT, assistantOverrides);
  }
  const endCall = () => {
    setConnected(false)
    vapi.stop();
  };
  return (
    <motion.section
    initial={{
      opacity : 0
    }}
    animate={{
      opacity : 1
    }}
    transition={{
      duration : 0.5, 
      ease : "easeInOut"
    }}
    className="h-full flex flex-col  gap-16 ">
      <div className="border-b border-neutral-200/55 font-mono   w-full p-4">
            <h1 className="first-letter:capitalize tracking-tight ">
            Craft Your Personalized Interview with Ease
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



