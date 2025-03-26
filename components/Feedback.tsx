'use client'
import { motion } from "motion/react"
import { FeedbackItem } from "@/constant/types"
const animateVariants = {
    hidden : {
        opacity : 0,
        x : -100
    },
    show : (index:number)=>({
            opacity : 1,
            x :0,
            transition : { 
                duraction : 0.5,
                delay : index*0.1,
                ease : [.25,.1,.25,1]

            }
    })
}
const Feedback = ({ category, feedback,icon , index }: FeedbackItem) => {
      if(!category) return ;
    return (
        <motion.article
        variants={animateVariants}
        initial="hidden"
        whileInView='show'
        viewport={{
            once : true
        }}
        custom={index}
        className="p-2">
            <h1  className="uppercase font-mono font-medium text-lg"> 
             {icon}{" "}{category} 
            </h1>
            <p  className=" text-neutral-500 ">
                {feedback}
            </p>
        </motion.article>
    )
}
 
export default Feedback 