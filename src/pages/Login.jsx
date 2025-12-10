import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { LoginUser } from "../features/userSlice.js";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ----- Yup Validation Schema -----
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    // ----- Formik -----
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(LoginUser(values));

                navigate("/");
                toast.success("Loged-in successfully!");
            } catch (error) {
                console.log("Login Failed !!", error);
                toast.warning("Login failed ! try again")
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
            <Card className="w-full max-w-sm bg-[#181818] border-zinc-700 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl text-center font-semibold mt-2">
                        Sign in
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="bg-[#0f0f0f] border-zinc-700 text-white"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-xs">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="bg-[#0f0f0f] border-zinc-700 text-white"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-xs">{formik.errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#FF0000] hover:bg-red-600 text-white mt-2"
                        >
                            Sign In
                        </Button>
                    </form>

                    <p className="text-xs text-zinc-500 text-center mt-3">
                        By continuing, you agree to our Terms & Privacy Policy.
                    </p>

                    <Separator className="bg-zinc-700" />

                    <p className="text-sm text-zinc-400 text-center">
                        Don't have account?,{" "}
                        <NavLink
                            className={
                                "underline text-white hover:text-blue-500 transition"
                            }
                            to="/signup"
                        >
                            Create account
                        </NavLink>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
