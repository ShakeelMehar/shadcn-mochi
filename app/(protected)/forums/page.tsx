import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const threads = [
  {
    id: 1,
    title: "Material 3 elevation tokens for dark mode",
    author: "Jess Lee",
    replies: 18,
    excerpt: "Exploring how tonal palettes translate to elevated surfaces in product dashboards."
  },
  {
    id: 2,
    title: "Async collaboration patterns",
    author: "Akira Tan",
    replies: 42,
    excerpt: "Share how your teams are mixing live chat with long-form specs."
  },
  {
    id: 3,
    title: "Design <> engineering rituals",
    author: "Morgan Fox",
    replies: 27,
    excerpt: "Weekly rituals that keep quality high without slowing velocity."
  }
];

export default function ForumsPage() {
  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Card key={thread.id} className="transition-transform hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{thread.title}</CardTitle>
                <CardDescription>{thread.excerpt}</CardDescription>
              </div>
              <Badge variant="secondary">{thread.replies} replies</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Started by {thread.author}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
