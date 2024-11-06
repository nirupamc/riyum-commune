import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitPost } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { PostsPage } from "@/lib/types";

export function useSubmitPostMutation() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: submitPost,
        onSuccess: async (newPost) => {
            const queryFilter: QueryFilters = { queryKey: ["post-feed", "for-you"] };

            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<PostsPage>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return undefined;

                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map((page, index) => {
                            if (index === 0) {
                                return {
                                    ...page,
                                    posts: [newPost, ...page.posts], 
                                };
                            }
                            return page;
                        }),
                    };
                }
            );

            queryClient.invalidateQueries({
                queryKey: queryFilter.queryKey,
                predicate(query) {
                    return !query.state.data;
                },
            });

            queryClient.invalidateQueries({
                queryKey:queryFilter.queryKey,
                predicate(query){
                    return !query.state.data;
                }
            })

            toast({
                description: "Post created",
            });
        },
        onError(error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Failed, please try again",
            });
        },
    });

    return mutation;
}