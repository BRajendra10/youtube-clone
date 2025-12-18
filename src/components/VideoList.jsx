import React from "react";
import { formatDate } from "../store/formate";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function VideoListItem({ video, children, isLikedVideo }) {
    const { currentUser } = useSelector((state) => state.user);
    
    let isOwner = video.owner._id === currentUser._id;
    isOwner = isLikedVideo ? true : isOwner;

    return (
        <Link
            key={video._id}
            to={`/video/${video._id}`}
            className="flex flex-col sm:flex-row gap-4 p-3 rounded-xl hover:bg-neutral-900 transition cursor-pointer"
        >
            {/* Thumbnail */}
            <div className="w-full sm:w-48 h-48 sm:h-28 rounded-lg overflow-hidden bg-neutral-800">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Video Info */}
            <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-lg font-semibold line-clamp-2">
                    {video.title}
                </h3>

                <p className="text-sm text-gray-400">
                    {video.owner?.fullName}
                </p>

                <div className="text-xs text-gray-500 flex gap-2">
                    <span>{video.views || 0} views</span>
                    <span>•</span>
                    <span>{formatDate(video.createdAt)}</span>
                </div>

                {isOwner && children}
            </div>
        </Link>
    )
}