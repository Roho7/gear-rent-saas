import { getClient } from "@/lib/sanity.client";
import { getPosts, Post } from "@/lib/sanity.queries";

import { Separator } from "@/components/ui/separator";
import { BlogCard } from "./_components/blog.card";

async function fetchPosts(): Promise<Post[]> {
  const client = getClient();
  return await getPosts(client);
}

export default async function BlogsPage() {
  const posts = await fetchPosts();

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold">Gearyo Blogs</h1>
      <Separator className="my-4" />
      <section className="grid md:grid-cols-4 grid-cols-1 gap-2">
        {posts.length
          ? posts.map((post) => <BlogCard key={post._id} post={post} />)
          : null}
      </section>
    </div>
  );
}
