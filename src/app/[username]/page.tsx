"use client";

import {  useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { User } from "../types";
import { Grid3X3 } from "lucide-react";
import { Spool } from "lucide-react";
import { Post } from "../types";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProfilePostCard } from "../components/ProfilePostCard";

const Page = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState();

  // useEffect(() => {
  //   fetch("http://localhost:5500/posts")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPosts(data);
  //     });
  // }, []);

  useEffect(() => {
    axios
      .get(`/users/${username}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((res) => {
        if (res.status === 404) {
          setIsNotFound(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:5500/posts")
      .then((res) => res.json())
      .then((data) => {
        const userPosts = data.filter(
          (post: Post) => post.createdBy?.username === username
        );
        setPosts(userPosts);
      });
  }, [username]);

  if (loading) return <>Loading...</>;
  if (isNotFound) return <>User with username {username} not found!</>;

  return (
    <>
      <div className="flex items-center flex-col gap-4">
        <Link href={"/"}>
          <div>
            <Home />
          </div>
        </Link>
        <div className="flex pt-10 text-2xl font-bold gap-1">{username}</div>
        <div className="flex gap-1">
          <div className="">{username}</div>
          <div className="text-gray-500">he/him</div>
        </div>
        <div className="flex gap-2">
          <div>{posts.length} posts</div>
          <div> followers</div>
          <div> following</div>
        </div>
        <div className="font-bold flex gap-1">
          <Spool /> {username}
        </div>
        {/* <div
          className="h-15 w-100 bg-blue-500 rounded-4xl flex justify-center items-center"
          onClick={async () => {
            const response = await axios.post(`/users/${username}/follow`);
            setIsFollowing(response.data.isFollowing);
          }}
        >
          {isFollowing ? (
            <div className="bg-gray-700 w-100 h-15 flex justify-center items-center rounded-4xl transition-all">
              Following
            </div>
          ) : (
            <div className="transition-all">Follow</div>
          )}
        </div> */}

        <Grid3X3 />
        <hr className="w-300"></hr>
        <div className="w-300 flex flex-wrap justify-between">
          {posts.map((post) => (
            <ProfilePostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
