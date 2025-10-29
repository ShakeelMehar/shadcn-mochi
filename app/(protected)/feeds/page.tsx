import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

const posts = [
  {
    id: 1,
    author: "Nora Winters",
    role: "Product Design @ Lunar",
    content: "Shipped Mochi-OS 0.9 with focus mode and inline AI summaries.",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    author: "Micah Brown",
    role: "Engineering Lead @ Altair",
    content: "Experimenting with streaming architecture for chat reliability.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
  }
];

export default function FeedsPage() {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3">
            <Avatar fallback={post.author} src={post.image} />
            <div>
              <CardTitle className="text-base">{post.author}</CardTitle>
              <CardDescription>{post.role}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{post.content}</p>
            <div className="overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.author} className="h-48 w-full object-cover" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
