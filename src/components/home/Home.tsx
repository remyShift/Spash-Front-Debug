"use client";
import { useEffect, useState } from "react";
import VideoBtn from "./VideoBtn";

interface FileInfo {
  folderName: string;
  videoName: string;
  path: string;
  size: number;
  createdAt: string;
}

export default function Home() {
  const [files, setFiles] = useState<FileInfo[]>([]);
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
          setFiles(data.files);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur:", err);
          setError("Can't load files. Please try again later.");
          setLoading(false);
        });
    };

    fetchFiles();
  }, []);

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
        ) : files.length === 0 ? (
          <p className="text-white text-center">No files found in the videos folder, please add one !</p>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {files.map((file) => (
              <VideoBtn file={file} key={file.path} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
