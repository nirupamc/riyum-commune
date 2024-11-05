import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export  async function GET(){
    try{
        const {user} = await validateRequest();
        if(!user) return Response.json({error: "unauthorized"}, {status: 401});
        const posts = await prisma.post.findMany({
            include: postDataInclude,
            orderBy: {createdAt: 'desc'},
        });

        return Response.json(posts);
        
    } catch(e){
        console.error(e);
        return Response.json({error: "initial server error, and you shouldn't be here"}, {status: 500});
    }
}