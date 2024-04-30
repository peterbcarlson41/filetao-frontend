// hooks/useFileDownload.js

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";

const useFileDownload = () => {
  const [downloads, setDownloads] = useState([]);

  // Retrieve the base API URL from environment variables
  const BASE_URL = import.meta.env.VITE_APP_API_URL;

  const { getToken } = useAuth();
  const token = getToken();

  const handleFileDownload = async (filename, extension) => {
    const newDownload = {
      id: filename,
      filename: filename,
      extension: extension,
      loading: true,
      status: "downloading",
      action: "download",
    };

    setDownloads((prev) => [...prev, newDownload]);

    try {
      const url = `${BASE_URL}/retrieve/${encodeURIComponent(filename)}/`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        setDownloads((prev) =>
          prev.map((download) =>
            download.id === filename
              ? { ...download, loading: false, status: "success" }
              : download
          )
        );
      } else {
        setDownloads((prev) =>
          prev.map((download) =>
            download.id === filename
              ? { ...download, loading: false, status: "failed" }
              : download
          )
        );
        throw new Error("Failed to download file");
      }
    } catch (error) {
      console.error("Download error:", error);
      setDownloads((prev) =>
        prev.map((download) =>
          download.id === filename
            ? { ...download, loading: false, status: "failed" }
            : download
        )
      );
    }
  };

  return { downloads, handleFileDownload };
};

export default useFileDownload;
