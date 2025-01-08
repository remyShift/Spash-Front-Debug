"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/context/store";
import { VideoList } from "./VideoList";
import { fetchFiles } from "@/utils/fetchFiles";
import Loader from "../Loader";
import ErrorMsg from "../ErrorMsg";

export default function Home() {
  const { pairs, setPairs } = useStore();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles({ setLoading, setError, setPairs });
  }, [setPairs]);

  if (loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <ErrorMsg error={error} />
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

        {pairs.length === 0 ? (
          <p className="text-white text-center">No files found in the videos folder, please add one !</p>
        ) : (
          <VideoList pairs={pairs}/>
        )}
      </div>
    </div>
  );
}


