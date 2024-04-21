// hooks/useFileSearchAndSort.js

import { useMemo } from "react";

const useFileSearchAndSort = (files, searchTerm, sortBy) => {
  const sortedFiles = useMemo(() => {
    let sorted = [...files];

    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.filename.localeCompare(b.filename));
        break;
      case "size":
        sorted.sort((a, b) => a.size - b.size);
        break;
      case "date":
        sorted.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));
        break;
      default:
        break;
    }

    return sorted;
  }, [files, sortBy]);

  const filteredFiles = useMemo(() => {
    return sortedFiles.filter((file) =>
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedFiles, searchTerm]);

  return filteredFiles;
};

export default useFileSearchAndSort;
