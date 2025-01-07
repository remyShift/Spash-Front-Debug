"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileInfo } from "@/types/files";

export default function VideoPage() {
    const params = useParams();
    const [video, setVideo] = useState<FileInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchVideoDetails = () => {
            fetch(`/api/v1/files/${params.id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setVideo(data.file);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Erreur:", err);
                    setError("Impossible de charger les détails de la vidéo.");
                    setLoading(false);
                });
        };

        fetchVideoDetails();
    }, [params.id]);

    if (loading) {
        return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-white">Chargement...</p>
        </div>
        );
    }

    if (error) {
        return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500">{error}</p>
        </div>
        );
    }

    if (!video) {
        return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-white">Vidéo non trouvée</p>
        </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
            <h1 className="text-4xl text-white font-gilroy font-italic font-semibold">
                {video.folderName || video.videoName}
            </h1>
            <div className="bg-white/10 p-8 rounded-lg w-full max-w-2xl">
                <div className="space-y-4">
                <p className="text-white">
                    <span className="font-semibold">Nom du dossier:</span> {video.folderName || "Aucun"}
                </p>
                <p className="text-white">
                    <span className="font-semibold">Nom de la vidéo:</span> {video.videoName}
                </p>
                <p className="text-white">
                    <span className="font-semibold">Taille:</span> {Math.round(video.size / 1024)} KB
                </p>
                <p className="text-white">
                    <span className="font-semibold">Date de création:</span>{" "}
                    {new Date(video.createdAt).toLocaleDateString()}
                </p>
                </div>
            </div>
        </div>
    );
}
