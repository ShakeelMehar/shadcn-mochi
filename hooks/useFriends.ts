"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/apiClient";
import { normalizeListResponse } from "@/lib/utils";

type FriendStatus = "accepted" | "pending" | "requested" | string;

export interface FriendEntry {
    id: string;
    name?: string;
    email?: string;
    status?: FriendStatus;
    fingerprint?: string;
    identity?: string;
    class?: string;
    [key: string]: unknown;
}

export const useFriends = () => {
    const [friends, setFriends] = useState<FriendEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFriends = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await apiClient.get("/friends/list");
            const friendsPayload =
                (data as { data?: { friends?: FriendEntry[] } }).data?.friends ??
                (data as { friends?: FriendEntry[] }).friends ??
                data;

            setFriends(normalizeListResponse<FriendEntry>(friendsPayload));
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Unable to load friends");
        } finally {
            setLoading(false);
        }
    }, []);

    const searchUsers = useCallback(async (query: string) => {
        if (!query.trim()) return [] as FriendEntry[];
        try {
            const { data } = await apiClient.get("/friends/search", {
                params: { search: query },
            });
            return normalizeListResponse<FriendEntry>(data);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Unable to search users");
            return [];
        }
    }, []);

    const inviteEmail = useCallback(async (email: string) => {
        try {
            setError(null);
            await apiClient.post("/friends/invite", { email });
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Unable to send invite");
        }
    }, []);

    const addFriend = useCallback(
        async (friendId: string, name: string) => {
            try {
                setError(null);
                await apiClient.post("/friends/create", null, {
                    params: { id: friendId, name },
                });
                await fetchFriends();
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Unable to add friend");
            }
        },
        [fetchFriends]
    );

    const acceptRequest = useCallback(
        async (id: string) => {
            try {
                setError(null);
                await apiClient.post("/friends/accept", { id });
                await fetchFriends();
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Unable to accept request");
            }
        },
        [fetchFriends]
    );

    const ignoreRequest = useCallback(
        async (id: string) => {
            try {
                setError(null);
                await apiClient.post("/friends/ignore", { id });
                await fetchFriends();
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Unable to ignore request");
            }
        },
        [fetchFriends]
    );

    const deleteFriend = useCallback(
        async (friendId: string) => {
            try {
                setError(null);
                await apiClient.post("/friends/delete", null, {
                    params: { id: friendId },
                });
                await fetchFriends();
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Unable to delete friend");
            }
        },
        [fetchFriends]
    );

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    return useMemo(
        () => ({
            friends,
            loading,
            error,
            fetchFriends,
            searchUsers,
            inviteEmail,
            addFriend,
            acceptRequest,
            ignoreRequest,
            deleteFriend,
        }),
        [
            friends,
            loading,
            error,
            fetchFriends,
            searchUsers,
            inviteEmail,
            addFriend,
            acceptRequest,
            ignoreRequest,
            deleteFriend,
        ]
    );
};
