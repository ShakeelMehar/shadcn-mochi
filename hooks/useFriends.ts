"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/apiClient";

type FriendStatus = "accepted" | "pending" | "requested";

export interface FriendEntry {
  id: string;
  name: string;
  email: string;
  status: FriendStatus;
}

export const useFriends = () => {
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get<{ data: FriendEntry[] }>("/friends/list");
      setFriends(data?.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Unable to load friends");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchUsers = useCallback(async (query: string) => {
    if (!query) return [] as FriendEntry[];
    const { data } = await apiClient.get<{ data: FriendEntry[] }>("/friends/search", {
      params: { search: query }
    });
    return data?.data ?? [];
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
    async (friendId: string) => {
      try {
        setError(null);
        await apiClient.post("/friends/add", { friendId });
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
        await apiClient.post("/friends/delete", null, { params: { id: friendId } });
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
      deleteFriend
    }),
    [friends, loading, error, fetchFriends, searchUsers, inviteEmail, addFriend, acceptRequest, ignoreRequest, deleteFriend]
  );
};
