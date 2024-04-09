import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const FileUploadButton = ({ onFileChange }) => {
  return (
    <>
      <Button
        onClick={() => document.getElementById("fileInput").click()}
        className="gap-1"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span>Upload File</span>
      </Button>
      <input
        id="fileInput"
        type="file"
        onChange={onFileChange}
        style={{ display: "none" }}
        multiple
      />
    </>
  );
};
