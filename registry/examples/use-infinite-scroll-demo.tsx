"use client"

import * as React from "react"

import { useInfiniteScroll } from "registry/hooks/use-infinite-scroll"

interface Post {
  id: number
  title: string
  content: string
}

export default function UseInfiniteScrollDemo() {
  const [posts, setPosts] = React.useState<Post[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  const [page, setPage] = React.useState(1)

  const generatePosts = (pageNum: number): Post[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: (pageNum - 1) * 10 + i + 1,
      title: `Post ${(pageNum - 1) * 10 + i + 1}`,
      content: `This is the content for post ${(pageNum - 1) * 10 + i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    }))
  }

  const loadMorePosts = React.useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPosts = generatePosts(page)

    setPosts((prev) => [...prev, ...newPosts])
    setPage((prev) => prev + 1)

    if (page >= 5) {
      setHasMore(false)
    }

    setIsLoading(false)
  }, [page, isLoading, hasMore])

  const triggerRef = useInfiniteScroll({
    onLoadMore: loadMorePosts,
    isLoading,
    hasMore,
    threshold: 0.5,
  })

  return (
    <div className="mx-auto max-h-[60vh] w-full max-w-sm overflow-y-auto">
      <h3 className="mb-6 text-center text-lg font-bold underline underline-offset-4">
        Infinite Scroll Demo
      </h3>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-lg border border-gray-300 p-4 shadow-sm"
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <p>Loading more posts...</p>
        </div>
      )}
      {!hasMore && !isLoading && (
        <div className="mt-4 text-center text-destructive">
          You&apos;ve reached the end of the content
        </div>
      )}
      <div
        ref={triggerRef}
        style={{ height: "20px", margin: "10px 0" }}
        aria-hidden="true"
      />
    </div>
  )
}
