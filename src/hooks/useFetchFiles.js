// hooks/useFetchFiles.js

import { useState, useCallback } from "react";

const useFetchFiles = () => {
  const [files, setFiles] = useState([]);
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);

  // Retrieve the base API URL from environment variables
  const BASE_URL = import.meta.env.VITE_APP_API_URL;

  // Function to fetch files
  const fetchFiles = useCallback(async () => {
    // Retrieve the auth token from local storage
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      console.error("No auth token found");
      return;
    }

    const url = `${BASE_URL}/user_data`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const filesArray = Object.entries(data.file_metadata).map(
        ([key, value]) => {
          return { id: key, ...JSON.parse(value) };
        }
      );
      setFiles(filesArray);

      // Get info to display in the stats card
      setNumberOfFiles(data.stats.filecount);
      // Convert storage to GB assuming the value is in bytes
      setStorageUsed(data.stats.storage);
    } else {
      console.error("Failed to fetch files");
    }
  }, [BASE_URL]);

  return { files, fetchFiles, numberOfFiles, storageUsed };
};

export default useFetchFiles;
