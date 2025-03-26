'use client'
import { useAnimate } from "motion/react-mini"
import { useEffect } from "react"
import SplitType from "split-type"
import { delay, stagger} from "motion"
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
    const [scopeTitle, animateTitle] = useAnimate()
    const [scopePara, animatePara] = useAnimate();
    // useEffect(() => {
    //     // Only initialize SplitType if elements exist
    //     if(scopeTitle.current && scopePara.current) {
    //       const splitTitle = new SplitType(scopeTitle.current, {
    //         types: "lines,chars",
    //         tagName: "span"
    //       })
    
    //       const splitPara = new SplitType(scopePara.current, {
    //         types: 'chars',
    //         tagName: "span"
    //       })
    
    //       // Store animation cleanup functions
    //       const titleAnimation = animateTitle(scopeTitle.current.querySelectorAll('.char'), {
    //         opacity: 1
    //       }, {
    //         duration: 0.2,
    //         delay: stagger(0.1),
    //         ease: 'easeInOut'
    //       })
    
    //       const paraAnimation = animatePara(scopePara.current.querySelectorAll('.char'), {
    //         opacity: 1
    //       }, { 
    //         duration: 0.2, 
    //         delay: stagger(0.1), 
    //         ease: 'easeInOut' 
    //       })
    
    //       // Cleanup function
    //       return () => {
    //         titleAnimation?.stop()
    //         paraAnimation?.stop()
    //         splitTitle.revert()
    //         splitPara.revert()
    //       }
    //     }
    //   }, [animateTitle, animatePara , scopePara , scopeTitle])
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
            <h1 ref={scopeTitle} className="uppercase font-mono font-medium text-lg"> 
             {icon}{" "}{category} 
            </h1>
            <p ref={scopePara} className=" text-neutral-500 ">
                {feedback}
            </p>
        </motion.article>
    )
}
 
export default Feedback 