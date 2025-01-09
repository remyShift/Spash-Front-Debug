"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/context/store";
import { VideoList } from "./VideoList";
import { fetchFiles } from "@/utils/fetchFiles";
import Loader from "../ui/Loader";
import ErrorMsg from "../ui/ErrorMsg";

export default function Home() {
  const { videos, setVideos } = useStore();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles({ setLoading, setError, setVideos });
  }, [setVideos]);

  if (loading) {
    return (
      <div className="flex-1 justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 justify-center items-center">
        <ErrorMsg error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-16">
      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl">
        <h1 className="text-4xl text-white font-semibold italic">
          Welcome to the debug devtool !
        </h1>
        <h2 className="text-white text-3xl italic">
          Please choose a video below :
        </h2>

        {videos.length === 0 ? (
          <p className="text-white text-center">No files found in the videos folder, please add one !</p>
        ) : (
          <VideoList videos={videos}/>
        )}
      </div>
    </div>
  );
}


