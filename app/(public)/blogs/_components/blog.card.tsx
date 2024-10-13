"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "@/lib/sanity.queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug.current}`}
      className="text-blue-500 hover:underline"
    >
      <Card className="overflow-hidden">
        <CardHeader>
          {post.mainImage && (
            <Image
              src={urlFor(post.mainImage).width(500).height(300).url()}
              alt={post.title || "Blog post image"}
              width={300}
              height={200}
              className="object-cover w-full h-48"
            />
          )}
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            {new Date(post._createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter>{}</CardFooter>
      </Card>
    </Link>
  );
}
