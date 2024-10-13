"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getClient } from "@/lib/sanity.client";

import { GearyoBreadcrumb } from "@/app/_components/_shared/breadcrumb";
import Spinner from "@/app/_components/_shared/spinner";
import { getPost, type Post } from "@/lib/sanity.queries";
import { urlFor } from "@/sanity/lib/image";
import dayjs from "dayjs";

export default function BlogPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const pathname = usePathname();
  const slug = pathname?.split("/").pop() || "";

  useEffect(() => {
    const fetchPost = async () => {
      const client = getClient();
      const fetchedPost = await getPost(client, slug);
      setPost(fetchedPost);
    };

    fetchPost();
  }, [slug]);

  if (!post) {
    return <Spinner />;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className="pr-2 my-2 bg-muted/10 rounded-full w-fit">
        <GearyoBreadcrumb />
      </div>
      {post.mainImage && (
        <Image
          src={urlFor(post.mainImage).width(500).height(300).url()}
          alt={post.title || "Blog post cover image"}
          width={1200}
          height={630}
          className="w-full h-auto rounded-lg shadow-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.excerpt && (
        <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
      )}
      <time className="text-sm text-gray-500 mb-8 block">
        {dayjs(post._createdAt).format("MMMM D, YYYY")}
      </time>
      <div className="prose prose-lg max-w-none">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}
