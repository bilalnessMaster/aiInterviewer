export type FeedbackItem = {
    category: string;
    feedback: string;
    icon?: string;
    rating?: number;
    items?: string[];
    index?:number
  };

export type  Interview = {
    id : string,
    questions : string[]
}