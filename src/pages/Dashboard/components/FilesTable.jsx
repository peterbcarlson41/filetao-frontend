import FileTableItem from "@/components/common/FileTableItem";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";

export const FilesTable = ({ files }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Size</TableHead>
          <TableHead className="hidden md:table-cell">
            Last Modified Date
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <FileTableItem
            key={file.id}
            filename={file.filename}
            size={formatBytes(file.size).string}
            uploaded={formatDate(file.uploaded)}
            extension={file.ext}
          />
        ))}
      </TableBody>
    </Table>
  );
};
