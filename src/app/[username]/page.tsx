
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { useAxios } from "../hooks/useAxios";
import { User } from "../types";
import { Grid3X3, Spool, Home } from "lucide-react";
import Link from "next/link";
import { ProfilePostCard } from "../components/ProfilePostCard";
import { UserContext } from "../providers/UserProvider";
import { Button } from "@/components/ui/button";
import { Post } from "../types";

const Page = () => {
  const { username } = useParams();
  const axios = useAxios();
  const router = useRouter();

  const { user: loggedInUser } = useContext(UserContext);

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  // Follow-related states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`/users/${username}`);
      setUser(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) setIsNotFound(true);
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
  // ⛔ REMOVE axios from deps
}, [username]);

// Fetch posts
useEffect(() => {
  const fetchUserPosts = async () => {
    try {
      const res = await axios.get("/posts");
      const userPosts = res.data.filter(
        (post: Post) => post.createdBy?.username === username
      );
      setPosts(userPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  fetchUserPosts();
}, [username]);

// Fetch follow stats
useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await axios.get(`/users/${username}/stats`);
      setFollowersCount(res.data.followersCount);
      setFollowingCount(res.data.followingCount);
      setIsFollowing(res.data.isFollowing);
    } catch (error) {
      console.error("Error fetching follow stats:", error);
    }
  };
  fetchStats();
}, [username]);

  // 🔹 Handle follow/unfollow toggle
  const handleFollow = async () => {
  setFollowLoading(true);
  try {
    const res = await axios.post(`/users/${username}/follow`);

    // Update only THEIR follower count
    setFollowersCount(res.data.followersCount);
    setIsFollowing(res.data.isFollowing);

    // ❌ Don't update followingCount unless viewing your own profile
    if (loggedInUser?.username === username) {
      setFollowingCount(res.data.followingCount);
    }
  } catch (error) {
    console.error("Follow/unfollow error:", error);
  } finally {
    setFollowLoading(false);
  }
};

  return (
    <div className="flex items-center flex-col gap-4">
      {/* Home */}
      <Link href={"/"}>
        <div>
          <Home />
        </div>
      </Link>

      {/* Username */}
      <div className="flex pt-10 text-2xl font-bold gap-1">@{username}</div>

      {/* Basic Info */}
      <div className="flex gap-1 text-gray-600">
        <div>{username}</div>
        <div>• he/him</div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <div>{posts.length} posts</div>
        <div>{followersCount} followers</div>
        <div>{followingCount} following</div>
      </div>

      {loggedInUser && (
  loggedInUser.username === username ? (
    ""
  ) : (
    <Button
      onClick={handleFollow}
      disabled={followLoading}
      variant={isFollowing ? "secondary" : "default"}
    >
      {followLoading
        ? "Loading..."
        : isFollowing
        ? "Unfollow"
        : "Follow"}
    </Button>
  )
)}

      {/* Username label */}
      <div className="font-bold flex gap-1 items-center mt-2">
        <Spool /> {username}
      </div>

      <Grid3X3 />
      <hr className="w-300" />

      {/* User posts grid */}
      <div className="w-300 flex flex-wrap justify-between">
        {posts.map((post) => (
          <ProfilePostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Page;
