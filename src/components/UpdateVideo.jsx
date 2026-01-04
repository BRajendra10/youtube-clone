import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoById, updateVideo } from "../features/videoSlice.js";
import { toast } from "sonner";

const videoSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
});

export default function UpdateVideo() {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedVideo, loading } = useSelector((state) => state.video);
  const { currentUser } = useSelector((state) => state.user);

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchVideoById(videoId));
  }, [videoId, dispatch]);

  if (loading || !selectedVideo) {
    return <div className="text-white p-6">Loading video...</div>;
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">Update Video</h1>

        <Formik
          enableReinitialize
          initialValues={{
            title: selectedVideo.title,
            description: selectedVideo.description,
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
              await dispatch(updateVideo({ videoId, formData })).unwrap();
              toast.success("Video updated successfully");
              navigate(`/${currentUser.username}`);
            } catch (err) {
              toast.error(err.message || "Failed to update video");
            }
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT */}
                <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/10 space-y-5">
                  <div>
                    <label className="block text-sm mb-2">Title</label>
                    <Field
                      name="title"
                      className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-2"
                    />
                    <ErrorMessage name="title" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

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

                {/* RIGHT */}
                <div className="space-y-6">

                  {/* EXISTING THUMB */}
                  <img
                    src={selectedVideo.thumbnail}
                    className="w-full rounded-lg"
                  />

                  {/* VIDEO */}
                  <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
                    <p className="text-sm mb-3">Replace Video (optional)</p>

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
                      {videoPreview || "Click to replace video"}
                    </label>
                  </div>

                  {/* THUMB */}
                  <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
                    <p className="text-sm mb-3">Replace Thumbnail (optional)</p>

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
                      {thumbnailPreview || "Click to replace thumbnail"}
                    </label>
                  </div>

                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  Update Video
                </button>
              </div>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}