import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '@/api/blog.api';
import type { BlogPost, BookmarkResponse } from '@/types/blog';

export const BOOKMARKS_QUERY_KEY = ['bookmarks'] as const;

export const useBookmarks = () => {
  return useQuery({
    queryKey: BOOKMARKS_QUERY_KEY,
    queryFn: bookmarkApi.get,
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isBookmarked }: { postId: string; isBookmarked: boolean; post: BlogPost }) =>
      isBookmarked ? bookmarkApi.remove(postId) : bookmarkApi.add(postId),

    onMutate: async ({ postId, isBookmarked, post }) => {
      await queryClient.cancelQueries({ queryKey: BOOKMARKS_QUERY_KEY });
      const previousBookmarks = queryClient.getQueryData<BookmarkResponse>(BOOKMARKS_QUERY_KEY);

      queryClient.setQueryData<BookmarkResponse>(BOOKMARKS_QUERY_KEY, (old) => {
        if (!old) return old;
        const currentPosts = old.bookmark.posts;
        const updatedPosts = isBookmarked
          ? currentPosts.filter((p) => p._id !== postId)
          : [...currentPosts, post];
        return { ...old, bookmark: { ...old.bookmark, posts: updatedPosts } };
      });

      return { previousBookmarks };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(BOOKMARKS_QUERY_KEY, context.previousBookmarks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY });
    },
  });
};