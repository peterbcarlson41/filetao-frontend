// hooks/useFileDelete.js

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

const useFileDelete = (fetchFiles) => {
  //fetch token
  const { getToken } = useAuth();

  // This hook uses useCallback to memoize the function, avoiding unnecessary re-creations
  const handleFileDelete = useCallback(
    async (filename, extension) => {
      // Retrieve the base API URL from environment variables
      const BASE_URL = import.meta.env.VITE_APP_API_URL;

      try {
        const fullFilename = `${filename}.${extension}`;
        const url = `${BASE_URL}/delete/${encodeURIComponent(fullFilename)}`;

        const token = await getToken();

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          fetchFiles();
        } else {
          toast({
            variant: "destructive",
            title: "Failed to delete file",
            description: "There was a problem with your request.",
          });
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        toast({
          variant: "destructive",
          title: "Failed to delete file",
          description: response.detail || error,
        });
      }
    },
    [fetchFiles]
  );

  return handleFileDelete;
};

export default useFileDelete;
