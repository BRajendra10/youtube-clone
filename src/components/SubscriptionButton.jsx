import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { toggleSubscribtion } from "../features/userSlice";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SubscriptionButton({ channelId, isSubscribed }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  if (currentUser?._id === channelId) return null;

  const handleToggle = () => {
    dispatch(toggleSubscribtion(channelId))
      .unwrap()
      .then(() =>
        toast.success(
          isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully"
        )
      )
      .catch(() => toast.error("Failed to toggle subscription"));
  };

  return (
    <Button
      className="rounded-full px-6"
      variant={isSubscribed ? "secondary" : "default"}
      onClick={handleToggle}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
}
