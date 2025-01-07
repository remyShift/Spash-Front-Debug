"use client";
import { useEffect, useState } from "react";
import { useStoreVideo, useStoreJSON } from "@/context/store";
import { VideoList } from "./VideoList";

export default function Home() {
  const { videos, setVideos } = useStoreVideo();
  const { setJSON } = useStoreJSON();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = () => {
      setLoading(true);
      fetch("/api/v1/files")
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const fetchedVideos = data.allVideos;
          setVideos(fetchedVideos);

          const fetchedJSON = data.allJSON;
          setJSON(fetchedJSON);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error:", err);
          setError("Impossible de charger les fichiers.");
          setLoading(false);
        });
    };

    fetchFiles();
  }, [setVideos, setJSON]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">Loading...</p>
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

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : videos.length === 0 ? (
          <p className="text-white text-center">No files found in the videos folder, please add one !</p>
        ) : (
          <VideoList videos={videos}/>
        )}
      </div>
    </div>
  );
}


