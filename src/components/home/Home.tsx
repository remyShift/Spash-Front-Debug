"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useStore } from "@/context/store";
import { VideoList } from "./VideoList";
import { fetchFiles } from "@/utils/fetchFiles";
import Loader from "../ui/Loader";
import ErrorMsg from "../ui/ErrorMsg";
import UploadZone from "../upload/UploadZone";
import SwitchModeBtn from "../ui/SwitchModeBtn";

export default function Home() {
  const { videos, setVideos } = useStore();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const initialLoadDone = useRef(false);

  const loadMoreVideos = useCallback(() => {
    if (!loading && hasMore) {
      setLoading(true);
      fetchFiles({ 
        setLoading, 
        setError, 
        setVideos,
        videos,
        page, 
        limit: 5,
        setHasMore
      }).then((pagination: { hasMore: boolean }) => {
        if (pagination.hasMore) {
          setPage(prev => prev + 1);
        }
        setHasMore(pagination.hasMore);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
        setHasMore(false);
      });
    }
  }, [loading, hasMore, page, setVideos, videos]);

  useEffect(() => {
    if (!initialLoadDone.current) {
      fetchFiles({ 
        setLoading, 
        setError, 
        setVideos,
        videos,
        page, 
        limit: 5,
        setHasMore
      }).then((pagination: { hasMore: boolean }) => {
        if (pagination.hasMore) {
          setPage(prev => prev + 1);
        }
        setHasMore(pagination.hasMore);
        setInitialLoading(false);
        initialLoadDone.current = true;
      }).catch(() => {
        setInitialLoading(false);
        initialLoadDone.current = true;
      });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMoreVideos();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreVideos, loading, hasMore]);

  if (initialLoading) {
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
      <div className="absolute top-5 right-5">
        <SwitchModeBtn />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl">
        <h1 className="text-4xl text-white font-semibold italic">
          Welcome to the debug devtool !
        </h1>
        <UploadZone onUploadSuccess={() => {
          setPage(1);
          setHasMore(true);
          loadMoreVideos();
        }} />
        <h2 className="text-white text-3xl italic mt-8">
          Please choose a video below :
        </h2>

        {videos.length === 0 && !loading ? (
          <p className="text-white text-center">No files found in the videos folder, please add one !</p>
        ) : (
          <>
            <VideoList videos={videos}/>
            <div ref={observerTarget} className="h-10">
              {loading && <Loader />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


