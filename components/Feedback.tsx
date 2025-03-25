'use client'
import { useAnimate } from "motion/react-mini"
import { motion } from "motion/react"
import { useEffect } from "react"
import SplitType from "split-type"
import { stagger } from "motion"
type FeedbackItem = {
    category: string;
    feedback: string;
    icon?: string;
    rating?: number;
    items?: string[];
  };
const Feedback = ({ category, feedback,icon }: FeedbackItem) => {
    const [scopeTitle, animateTitle] = useAnimate()
    const [scopePara, animatePara] = useAnimate();
    useEffect(() => {
        // Only initialize SplitType if elements exist
        if(scopeTitle.current && scopePara.current) {
          const splitTitle = new SplitType(scopeTitle.current, {
            types: "lines,chars",
            tagName: "span"
          })
    
          const splitPara = new SplitType(scopePara.current, {
            types: 'chars',
            tagName: "span"
          })
    
          // Store animation cleanup functions
          const titleAnimation = animateTitle(scopeTitle.current.querySelectorAll('.char'), {
            opacity: 1
          }, {
            duration: 0.2,
            delay: stagger(0.1),
            ease: 'easeInOut'
          })
    
          const paraAnimation = animatePara(scopePara.current.querySelectorAll('.char'), {
            opacity: 1
          }, { 
            duration: 0.2, 
            delay: stagger(0.1), 
            ease: 'easeInOut' 
          })
    
          // Cleanup function
          return () => {
            titleAnimation?.stop()
            paraAnimation?.stop()
            splitTitle.revert()
            splitPara.revert()
          }
        }
      }, [animateTitle, animatePara])
      if(!category) return ;
    return (
        <article className="p-2">
            <h1 ref={scopeTitle} className="capitalize font-mono font-medium text-lg"> 
             {icon}{" "}{category} 
            </h1>
            <p ref={scopePara} className=" text-neutral-500 ">
                {feedback}
            </p>
        </article>
    )
}
 
export default Feedback 