import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoById, updateVideo, uploadVideo } from "../features/videoSlice.js";
import { toast } from "sonner";

// =========================
// Yup Schema for BOTH modes
// =========================
const videoSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  videoFile: Yup.mixed().nullable(),
  thumbnail: Yup.mixed().nullable(),
});

export default function VideoForm() {
  const { videoId } = useParams();
  const dispatch = useDispatch();

  const isEdit = Boolean(videoId); // <--- Auto detect mode

  const { selectedVideo, loading } = useSelector((state) => state.video);

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Fetch video only in edit mode
  useEffect(() => {
    if (isEdit) dispatch(fetchVideoById(videoId));
  }, [videoId, isEdit, dispatch]);

  // Fix loading state only for edit mode
  if (isEdit && loading && !selectedVideo) {
    return <div className="text-white p-6">Loading video details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">
          {isEdit ? "Update Video" : "Upload Video"}
        </h1>

        <Formik
          enableReinitialize
          initialValues={{
            title: isEdit ? selectedVideo?.title : "",
            description: isEdit ? selectedVideo?.description : "",
            videoFile: null,
            thumbnail: null,
          }}
          validationSchema={videoSchema}
          onSubmit={async (values) => {
            const formData = new FormData();

            formData.append("title", values.title);
            formData.append("description", values.description);

            if (values.videoFile) formData.append("videoFile", values.videoFile);
            if (values.thumbnail) formData.append("thumbnail", values.thumbnail);

            try {
              if (isEdit) {
                const res = await dispatch(updateVideo({ videoId, formData }));

                if (res.meta.requestStatus === "fulfilled") {
                  toast.success("Video updated successfully!");
                } else {
                  toast.error(res.payload || "Failed to update video");
                }
              } else {
                const res = await dispatch(uploadVideo(formData));

                if (res.meta.requestStatus === "fulfilled") {
                  toast.success("Video uploaded successfully!");
                } else {
                  toast.error(res.payload || "Failed to upload video");
                }
              }
            } catch (err) {
              toast.error("Something went wrong!");
              console.log(err);
            }
          }}

        >
          {({ setFieldValue }) => (
            <Form className="space-y-6">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT SIDE */}
                <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/10 space-y-5">

                  {/* Title */}
                  <div>
                    <label className="block text-sm mb-2">Title</label>
                    <Field
                      name="title"
                      className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-2"
                    />
                    <ErrorMessage name="title" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm mb-2">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      rows="5"
                      className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-2"
                    />
                    <ErrorMessage name="description" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-6">

                  {/* VIDEO UPLOAD */}
                  <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
                    <p className="text-sm mb-3">
                      {isEdit ? "Replace Video (optional)" : "Upload Video"}
                    </p>

                    <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-8 cursor-pointer hover:border-red-500">

                      <input
                        type="file"
                        accept=".mp4,.mkv,.webm,.mov"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFieldValue("videoFile", file);
                          setVideoPreview(file?.name);
                        }}
                      />

                      {videoPreview ? (
                        <p className="text-red-400">{videoPreview}</p>
                      ) : (
                        <div className="text-center text-gray-400">
                          <p>{isEdit ? "Click to replace video" : "Click to upload video"}</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* THUMBNAIL UPLOAD */}
                  <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
                    <p className="text-sm mb-3">
                      {isEdit ? "Replace Thumbnail (optional)" : "Upload Thumbnail"}
                    </p>

                    {isEdit && (
                      <img
                        src={selectedVideo?.thumbnail}
                        className="w-full rounded-lg mb-3"
                      />
                    )}

                    <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-8 cursor-pointer hover:border-red-500">

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFieldValue("thumbnail", file);
                          setThumbnailPreview(file?.name);
                        }}
                      />

                      {thumbnailPreview ? (
                        <p className="text-red-400">{thumbnailPreview}</p>
                      ) : (
                        <div className="text-center text-gray-400">
                          <p>{isEdit ? "Click to replace thumbnail" : "Click to upload thumbnail"}</p>
                        </div>
                      )}
                    </label>
                  </div>

                </div>
              </div>

              {/* SUBMIT */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium"
                >
                  {isEdit ? "Update Video" : "Upload Video"}
                </button>
              </div>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}
