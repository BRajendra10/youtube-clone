import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <Card className="w-full max-w-md bg-[#181818] border border-zinc-700 text-white shadow-lg">
        <CardHeader className="p-3">
          <CardTitle className="text-3xl text-center font-semibold">
            Create account
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="bg-[#0f0f0f] border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-[#0f0f0f] border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-[#0f0f0f] border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="bg-[#0f0f0f] border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Create Account Button */}
          <Button className="w-full bg-[#FF0000] hover:bg-red-600 text-white font-medium transition-all">
            Create Account
          </Button>

          {/* Divider */}
          <Separator className="bg-zinc-700" />

          {/* Login Link */}
          <p className="text-sm text-zinc-400 text-center">
            Already have an account?{" "}
            <NavLink
              className="underline text-white hover:text-blue-500 transition"
              to="/login"
            >
              Sign in
            </NavLink>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
