import { Post } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, User, Verified } from "lucide-react";
import { useAxios } from "../hooks/useAxios";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";
dayjs.extend(relativeTime);

export const PostCard = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [totalComments, setTotalComments] = useState(3);

  const axios = useAxios();

  const [text, setText] = useState("");
  const [comments, setComments] = useState(post.comments);

  const { user } = useUser();
  useEffect(() => {
    if (user) {
      const userId = user._id;
      setIsLiked(post.likes.some((like) => like.createdBy._id === userId));
    }
  }, [user]);

  const handleSubmitComment = async () => {
    const response = await axios.post(`/posts/${post._id}/comments`, { text });

    if (response.status === 200) {
      setText("");
      setComments([...comments, response.data]);
    } else {
      toast.error("Алдаа гарлаа");
    }
  };

  return (
    <div key={post._id} className="mb-4 border-b py-4 flex flex-col gap-4">
      <div className="flex gap-2">
        <Link href={`/${post.createdBy?.username}`}>
          <div className="font-bold flex gap-1">{post.createdBy?.username} <Verified/></div>
        </Link>
        <div className="font-bold">{dayjs(post.createdAt).fromNow()}</div>   
      </div>
      <img className="h-[600px] object-cover" src={post.imageUrl} alt="" />
      <div className="flex">
        <div
          className="hover:opacity-60 cursor-pointer"
          onClick={async () => {
            const response = await axios.post(`/posts/${post._id}/like`);
            setIsLiked(response.data.isLiked);

            if (response.data.isLiked) {
              setLikeCount(likeCount + 1);
            } else {
              setLikeCount(likeCount - 1);
            }
          }}
        >
          {isLiked ? <Heart fill="red" stroke="red" /> : <Heart />}
        </div>
      </div>
      <div>{likeCount} likes</div>
      <hr />
      <div>
      <Link href={`/${post.createdBy?.username}`}>
        <b>{post.createdBy?.username}</b>
      </Link>{" "}
      {post.description}</div>
      {comments.slice(0, totalComments).map((comment) => (
        <div key={comment._id}>
          <b>{comment.createdBy.username}: </b>
          {comment.text}
        </div>
      ))}
      {comments.length > 3 && (
        <div
          onClick={() => {
            setTotalComments(100);
          }}
          className="hover:underline cursor-pointer"
        >
          View all comments
        </div>
      )}
      <div className="relative">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment" className="w-full resize-none" rows={1} />
        {text.length > 0 && (
          <div onClick={handleSubmitComment} className="absolute hover:underline cursor-pointer right-0 top-0 font-bold">
            Post
          </div>
        )}
      </div>
    </div>
  );
}
