"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: {
    content: string;
    mediaIds: string[];
  }) {
    const { user } = await validateRequest();

    if (!user) throw new Error("Unauthorized");

    const { content } = createPostSchema.parse(input);

    const newPost = await prisma.post.create({
        data: {
            content,
            userId: user.id,
        },
        include: postDataInclude,
  });
  return newPost;

}