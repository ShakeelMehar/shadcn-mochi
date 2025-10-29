"use client";

import { useState } from "react";
import { Search, UserPlus, UserRoundCheck, UserRoundMinus } from "lucide-react";
import { useFriends } from "@/hooks/useFriends";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function FriendsPage() {
  const {
    friends,
    loading,
    error,
    searchUsers,
    addFriend,
    acceptRequest,
    ignoreRequest,
    inviteEmail
  } = useFriends();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<typeof friends>([]);
  const [inviteAddress, setInviteAddress] = useState("");

  const handleSearch = async () => {
    const results = await searchUsers(searchTerm);
    setSearchResults(results);
  };

  const handleInvite = async () => {
    if (!inviteAddress) return;
    await inviteEmail(inviteAddress);
    setInviteAddress("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Network</CardTitle>
          <CardDescription>Manage friends and pending invites.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Invite by email"
              value={inviteAddress}
              onChange={(event) => setInviteAddress(event.target.value)}
              type="email"
            />
            <Button onClick={handleInvite} disabled={!inviteAddress}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite
            </Button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading friends…</p>
            ) : friends.length ? (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/10 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{friend.name ?? friend.email}</p>
                    <p className="text-xs text-muted-foreground">{friend.status}</p>
                  </div>
                  <div className="flex gap-2">
                    {friend.status === "pending" ? (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => acceptRequest(friend.id)}>
                          <UserRoundCheck className="mr-1 h-4 w-4" /> Accept
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => ignoreRequest(friend.id)}>
                          <UserRoundMinus className="mr-1 h-4 w-4" /> Ignore
                        </Button>
                      </>
                    ) : (
                      <Badge variant="outline">Connected</Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No friends yet. Search to add more.</p>
            )}
          </div>
          {error ? <Badge variant="outline">{error}</Badge> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discover people</CardTitle>
          <CardDescription>Search the community to add new friends.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search Mochi-OS users"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <Button variant="secondary" onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
          <div className="space-y-3">
            {searchResults.length ? (
              searchResults.map((person) => (
                <div key={person.id} className="flex items-center justify-between rounded-2xl bg-muted/20 p-3">
                  <div>
                    <p className="text-sm font-semibold">{person.name ?? person.email}</p>
                    <p className="text-xs text-muted-foreground">{person.email}</p>
                  </div>
                  <Button size="sm" onClick={() => addFriend(person.id)}>
                    <UserPlus className="mr-1 h-4 w-4" /> Add
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Search to see community members.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
