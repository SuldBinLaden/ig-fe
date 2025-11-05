"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { UserContext } from "../providers/UserProvider";
import { redirect } from "next/navigation";
import { useAxios } from "../hooks/useAxios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SingInPage = () => {
  const { user, setToken } = useContext(UserContext);

  const [passwordShown, setPasswordShown] = useState(false);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const axios = useAxios();
  const router = useRouter();

  if (user) {
    return redirect("/");
  }

  const handleSignin = async () => {
      // const response = await fetch("http://localhost:5500/signin", {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   method: "POST",
      //   body: JSON.stringify({ credential, password }),
      // });

      // const data = await response.json();

      // if (response.ok) {
      //   toast.success(data.message);
      //   setToken(data.body);
      // } else {
      //   toast.error(data.message);
      // }

      try {const response = await axios.post("/signin", {
        credential,
        password,
      }, );
      toast.success("Signed in successfully");
      setToken(response.data.body);
      router.push("/")} catch (error) {
        console.error(error);
        toast.error("Failed to sign in");
      }
    
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Signin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter your email, phone or username..."
              value={credential}
              onChange={(e) => {
                setCredential(e.target.value);
              }}
            />
            <div className="relative">
              <Input
                placeholder="Password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={passwordShown ? "text" : "password"}
              />
              <Button
                onClick={() => {
                  setPasswordShown(!passwordShown);
                }}
                variant="ghost"
                className="absolute right-0 top-0"
              >
                {passwordShown ? <Eye /> : <EyeClosed />}
              </Button>
            </div>
            <Button onClick={handleSignin}>Sign in</Button>
            <Link href={"/signup"}>Don't have an account?</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingInPage;
