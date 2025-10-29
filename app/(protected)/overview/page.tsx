import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users2, SquarePen, Newspaper } from "lucide-react";

const overviewCards = [
  {
    title: "Chats",
    description: "Jump back into conversations and share updates.",
    href: "/chats",
    icon: MessageCircle,
    badge: "Live"
  },
  {
    title: "Friends",
    description: "Manage connections and discover new collaborators.",
    href: "/friends",
    icon: Users2,
    badge: "12"
  },
  {
    title: "Forums",
    description: "Discuss design systems and product strategy.",
    href: "/forums",
    icon: SquarePen,
    badge: "New"
  },
  {
    title: "Feeds",
    description: "Browse recent launches and product notes.",
    href: "/feeds",
    icon: Newspaper,
    badge: "Beta"
  }
];

export default function OverviewPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {overviewCards.map((card) => {
        const Icon = card.icon;
        return (
          <Link key={card.title} href={card.href}>
            <Card className="h-full cursor-pointer transition-transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
                <Badge>{card.badge}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
