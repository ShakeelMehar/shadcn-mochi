"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
    MessageCircle,
    MoreVertical,
    Search,
    UserPlus,
    UserRoundCheck,
    UserRoundMinus,
    X,
} from "lucide-react";
import debounce from "lodash.debounce";
import { useFriends } from "@/hooks/useFriends";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function FriendsPage() {
    const router = useRouter();
    const {
        friends,
        loading,
        error,
        searchUsers,
        addFriend,
        acceptRequest,
        ignoreRequest,
        deleteFriend,
    } = useFriends();
    const [manageOpen, setManageOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<typeof friends>([]);
    const [searchAttempted, setSearchAttempted] = useState(false);

    const debouncedSearch = useMemo(
        () =>
            debounce(async (query: string) => {
                const trimmed = query.trim();
                if (!trimmed.length) {
                    setSearchResults([]);
                    setSearchAttempted(false);
                    return;
                }

                const results = await searchUsers(trimmed);
                setSearchResults(results);
                setSearchAttempted(true);
            }, 450),
        [searchUsers]
    );

    useEffect(() => {
        if (!manageOpen) {
            setSearchTerm("");
            setSearchResults([]);
            setSearchAttempted(false);
            debouncedSearch.cancel();
        }
    }, [manageOpen, debouncedSearch]);

    useEffect(() => {
        if (!manageOpen) return;
        debouncedSearch(searchTerm);

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, manageOpen, debouncedSearch]);

    const handleSearch = async () => {
        const query = searchTerm.trim();
        if (!query) {
            setSearchResults([]);
            setSearchAttempted(false);
            return;
        }

        const results = await searchUsers(query);
        setSearchResults(results);
        setSearchAttempted(true);
    };

    const handleAddFriend = async (friendId: string, name?: string) => {
        await addFriend(friendId, name ?? "");
        setManageOpen(false);
        setSearchTerm("");
        setSearchResults([]);
        setSearchAttempted(false);
        debouncedSearch.cancel();
    };

    const handleMessage = (friendId: string) => {
        router.push(`/chats?friend=${encodeURIComponent(friendId)}`);
    };

    const discoverEmptyMessage = !searchAttempted
        ? "Search to see community members."
        : searchResults.length === 0
        ? "No people found for that search yet."
        : null;

    return (
        <>
            {manageOpen ? (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <Card className="w-full max-w-2xl shadow-xl">
                        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
                            <div>
                                <CardTitle>Grow your network</CardTitle>
                                <CardDescription>
                                    Search the Mochi community and send a friend request.
                                </CardDescription>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setManageOpen(false)}>
                                <X className="mr-2 h-4 w-4" />
                                Close
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Input
                                    placeholder="Search Mochi-OS users"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                />
                                <Button
                                    variant="secondary"
                                    className="sm:w-32"
                                    onClick={handleSearch}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Search
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {searchResults.map((person) => {
                                    const primary =
                                        person.name ??
                                        person.identity ??
                                        person.fingerprint ??
                                        "Unknown member";
                                    const secondary =
                                        person.identity ??
                                        (person.fingerprint ? `ID: ${person.fingerprint}` : null);
                                    const canAdd = Boolean(person.id);

                                    return (
                                        <div
                                            key={(person.id as string | undefined) ?? primary}
                                            className="flex items-center justify-between rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm">
                                            <div>
                                                <p className="text-sm font-semibold">{primary}</p>
                                                {secondary ? (
                                                    <p className="text-xs text-muted-foreground">
                                                        {secondary}
                                                    </p>
                                                ) : null}
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    person.id &&
                                                    handleAddFriend(
                                                        person.id,
                                                        person?.name ?? primary
                                                    )
                                                }
                                                disabled={!canAdd}>
                                                <UserPlus className="mr-1 h-4 w-4" /> Add
                                            </Button>
                                        </div>
                                    );
                                })}
                                {discoverEmptyMessage ? (
                                    <p className="text-sm text-muted-foreground">
                                        {discoverEmptyMessage}
                                    </p>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : null}

            <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Your Network</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage friends and discover new connections.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="self-start sm:self-auto"
                        onClick={() => setManageOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add or Search Friends
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Friends</CardTitle>
                        <CardDescription>
                            Message friends or manage your connection.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <p className="text-sm text-muted-foreground">
                                Loading friends...
                            </p>
                        ) : friends.length ? (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {friends.map((friend) => {
                                    const primary = friend.name ?? "Unknown member";
                                    const isPending = friend.status === "pending";

                                    return (
                                        <div
                                            key={friend.id}
                                            className="flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-background/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md3">
                                            <div>
                                                <p className="text-base font-semibold text-foreground">
                                                    {primary}
                                                </p>
                                            </div>

                                            <div className="mt-6 flex flex-col gap-2">
                                                {isPending ? (
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 rounded-full sm:flex-none"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                acceptRequest(friend.id)
                                                            }>
                                                            <UserRoundCheck className="mr-1 h-4 w-4" />
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 rounded-full sm:flex-none"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                ignoreRequest(friend.id)
                                                            }>
                                                            <UserRoundMinus className="mr-1 h-4 w-4" />
                                                            Ignore
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="flex-1 rounded-full sm:flex-none"
                                                            onClick={() =>
                                                                handleMessage(friend.id)
                                                            }>
                                                            <MessageCircle className="mr-1 h-4 w-4" />
                                                            Message
                                                        </Button>
                                                        <DropdownMenu.Root>
                                                            <DropdownMenu.Trigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-10 w-10 rounded-full border border-border/70 bg-background">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenu.Trigger>
                                                            <DropdownMenu.Content className="z-50 w-48 rounded-2xl border border-border bg-popover p-1 shadow-md3">
                                                                <DropdownMenu.Item asChild>
                                                                    <button
                                                                        onClick={() =>
                                                                            deleteFriend(friend.id)
                                                                        }
                                                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive transition hover:bg-destructive/10">
                                                                        Remove friend
                                                                    </button>
                                                                </DropdownMenu.Item>
                                                            </DropdownMenu.Content>
                                                        </DropdownMenu.Root>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No friends yet. Use the button above to add people.
                            </p>
                        )}
                        {error ? <Badge variant="outline">{error}</Badge> : null}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
