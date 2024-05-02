import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext"; // Ensure this import is correct

const useFetchFiles = () => {
  const [files, setFiles] = useState([]);
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [userCap, setUserCap] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve the base API URL from environment variables
  const BASE_URL = import.meta.env.VITE_APP_API_URL;

  const { getToken } = useAuth();

  // Function to fetch files
  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const authToken = await getToken(); // Ensure token is retrieved asynchronously
      if (!authToken) {
        console.error("No auth token found");
        setIsLoading(false);
        setError("Authentication required.");
        return;
      }

      const url = `${BASE_URL}/user_data`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      const filesArray = data.file_metadata.map((file, index) => ({
        id: index, // Assuming file object does not have an id and index is used instead
        ...file,
      }));

      setFiles(filesArray);
      setNumberOfFiles(data.stats.filecount);
      setStorageUsed(data.stats.storage);
      setUserCap(data.stats.usercap);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError(error.message || "Failed to fetch files");
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, getToken]);

  // Trigger fetchFiles when the component using this hook is mounted
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return {
    files,
    fetchFiles,
    numberOfFiles,
    storageUsed,
    userCap,
    isLoading,
    error,
  };
};

export default useFetchFiles;
