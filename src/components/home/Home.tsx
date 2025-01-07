"use client";
import { useEffect, useState } from "react";

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
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setFiles(data.files);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur:", err);
          setError("Impossible de charger les fichiers. Veuillez réessayer plus tard.");
          setLoading(false);
        });
    };

    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-16">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl text-white font-gilroy font-italic font-semibold">
          Welcome to the debug devtool !
        </h1>
        <h2 className="text-white text-3xl font-gilroy font-italic">
          Please choose a video below :
        </h2>
        
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : files.length === 0 ? (
          <p className="text-white">Aucun fichier trouvé dans le dossier videos</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file.path} className="p-4 bg-white/10 rounded-lg">
                <p className="text-white font-semibold">{file.folderName}</p>
                <p className="text-white text-sm">{file.videoName}</p>
                <p className="text-sm text-gray-400">
                  Taille: {Math.round(file.size / 1024)} KB
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
