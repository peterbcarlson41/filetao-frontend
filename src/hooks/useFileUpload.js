// hooks/useFileUpload.js

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/components/auth/AuthContext";

const useFileUpload = (fetchFiles) => {
  const [transfers, setTransfers] = useState([]);

  // Retrieve the base API URL from environment variables
  const BASE_URL = import.meta.env.VITE_APP_API_URL;

  const { getToken } = useAuth();
  const token = getToken();

  const handleFileUpload = async (selectedFiles) => {
    const fileUploadStates = selectedFiles.map((file) => ({
      id: uuidv4(),
      filename: file.name.split(".").slice(0, -1).join("."),
      extension: file.name.split(".").pop(),
      loading: true,
      status: "uploading",
      action: "upload",
    }));

    setTransfers((prev) => [...prev, ...fileUploadStates]);

    selectedFiles.forEach(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const matchingState = fileUploadStates.find(
        (f) =>
          f.filename === file.name.split(".").slice(0, -1).join(".") &&
          f.extension === file.name.split(".").pop()
      );

      fetch(`${BASE_URL}/uploadfile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            setTransfers((prev) =>
              prev.map((trans) =>
                trans.id === matchingState.id
                  ? { ...trans, loading: false, status: "success" }
                  : trans
              )
            );
            // Fetch files after each successful upload
            fetchFiles();
          } else {
            setTransfers((prev) =>
              prev.map((trans) =>
                trans.id === matchingState.id
                  ? { ...trans, loading: false, status: "failed" }
                  : trans
              )
            );
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setTransfers((prev) =>
            prev.map((trans) =>
              trans.id === matchingState.id
                ? { ...trans, loading: false, status: "failed" }
                : trans
            )
          );
        });
    });
  };

  return {
    transfers,
    handleFileUpload,
    setTransfers,
  };
};

export default useFileUpload;
