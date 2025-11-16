import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = async (email, password) => {
        console.log(email, password);

        const fetchedData = await axios.post("/api/v1/users/login", {
            email,
            password,
        });
        console.log(fetchedData.data);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
            <Card className="w-full max-w-sm bg-[#181818] border-zinc-700 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl text-center font-semibold mt-2">
                        Sign in
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="bg-[#0f0f0f] border-zinc-700 text-white"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="bg-[#0f0f0f] border-zinc-700 text-white"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full bg-[#FF0000] hover:bg-red-600 text-white mt-2"
                        onClick={() => loginHandler(email, password)}
                    >
                        Sign In
                    </Button>

                    <p className="text-xs text-zinc-500 text-center mt-3">
                        By continuing, you agree to our Terms & Privacy Policy.
                    </p>

                    <Separator className="bg-zinc-700" />

                    <p className="text-sm text-zinc-400 text-center">
                        Don't have account?, <NavLink className={"underline text-white hover:text-blue-500 transition"} to="/signup">Create account</NavLink>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
