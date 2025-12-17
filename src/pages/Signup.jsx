import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useDispatch } from "react-redux";
import { RegisterUser } from "../features/userSlice";

import { useFormik } from "formik";
import * as Yup from "yup";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // -------------------- Yup Validation Schema --------------------
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Confirm your password"),
    avatar: Yup.mixed().required("Avatar is required"),
    coverImage: Yup.mixed().required("Cover Image is required"),
  });

  // -------------------- Formik --------------------
  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: null,
      coverImage: null,
    },

    validationSchema,

    onSubmit: async (values) => {
      // Prepare FormData for backend
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("avatar", values.avatar);
      formData.append("coverImage", values.coverImage);

      try {
        await dispatch(RegisterUser(formData)).unwrap();

        toast.success("User registered successfully");
        navigate("/");
      } catch (error) {
        toast.error(error?.message || "Failed to register user !!")
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <Card className="w-full max-w-md bg-[#181818] border border-zinc-700 text-white shadow-lg">
        <CardHeader className="p-3">
          <CardTitle className="text-3xl text-center font-semibold">
            Create account
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <Label>Full Name</Label>
              <Input
                type="text"
                name="fullName"
                placeholder="John Doe"
                className="bg-[#0f0f0f] border-zinc-700 text-white"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-500 text-xs">{formik.errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <Label>Username</Label>
              <Input
                type="text"
                name="username"
                placeholder="your_username"
                className="bg-[#0f0f0f] border-zinc-700 text-white"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-xs">{formik.errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="bg-[#0f0f0f] border-zinc-700 text-white"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                className="bg-[#0f0f0f] border-zinc-700 text-white"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                className="bg-[#0f0f0f] border-zinc-700 text-white"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs">{formik.errors.confirmPassword}</p>
              )}
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col gap-2">
              <Label>Avatar</Label>
              <Input
                type="file"
                accept="image/*"
                name="avatar"
                className="bg-[#0f0f0f] border-zinc-700 text-white"
                onChange={(e) =>
                  formik.setFieldValue("avatar", e.target.files[0])
                }
              />
              {formik.touched.avatar && formik.errors.avatar && (
                <p className="text-red-500 text-xs">{formik.errors.avatar}</p>
              )}
            </div>

            {/* Cover Image Upload */}
            <div className="flex flex-col gap-2">
              <Label>Cover Image</Label>
              <Input
                type="file"
                accept="image/*"
                name="coverImage"
                className="bg-[#0f0f0f] border-zinc-700 text-white"
                onChange={(e) =>
                  formik.setFieldValue("coverImage", e.target.files[0])
                }
              />
              {formik.touched.coverImage && formik.errors.coverImage && (
                <p className="text-red-500 text-xs">{formik.errors.coverImage}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-[#FF0000] hover:bg-red-600 text-white font-medium"
            >
              Create Account
            </Button>
          </form>

          <Separator className="bg-zinc-700" />

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
