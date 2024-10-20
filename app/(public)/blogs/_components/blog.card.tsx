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
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  console.log(post);
  return (
    <Link href={`/blogs/${post.slug.current}`} className="text-blue-500">
      <Card className="overflow-hidden hover:shadow-lg">
        <CardHeader className="p-0">
          {post.mainImage && (
            <Image
              src={urlFor(post.mainImage).width(500).height(300).url()}
              alt={post.title || "Blog post image"}
              width={300}
              height={200}
              className="object-cover w-full h-48"
            />
          )}
        </CardHeader>
        <CardContent className="p-4   ">
          <CardTitle className="text-lg font-medium">{post.title}</CardTitle>
          <CardDescription>{post.excerpt}</CardDescription>
        </CardContent>
        <CardFooter className="text-sm text-muted flex justify-between px-4">
          <span>{dayjs(post._createdAt).format("MMM D, YYYY")}</span>
          <span>{post.author && ` by ${post.author.name}`}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
