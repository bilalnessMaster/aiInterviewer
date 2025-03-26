import { auth } from "@/auth";
import { Interview } from "@/constant/types";
import sql from "./db";

export const getInterviewById = async (id: string | undefined) => {
    try {
        const session = await auth()
        const user = session?.user?.id as string
        let interview: Interview[];
        if (!id) {
            interview = await sql`select * from "Interview" where user_id = ${user} 
        ORDER BY created_at DESC 
        limit 1`
            return interview
        }
        interview = await sql`select * from "Interview" where  id = ${id} limit 1`

        return !interview.length ? [] : interview;
    } catch (error) {
        console.log(error);
        return null;

    }
}

export const getInterviews = async () => {
    try {
        const interviews = await sql`select * from "Interview"`
        return interviews;
    } catch (error) {
        console.log(error);
        return [];

    }
}