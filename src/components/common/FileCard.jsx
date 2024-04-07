import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FileCard({
  filename,
  filenameExtension,
  createdDate,
  fileType,
  onDelete,
  onDownload,
}) {
  return (
    <Card className="min-w-[250px] max-w-md rounded-lg overflow-hidden shadow-lg">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>{filename}</CardTitle>
          <CardDescription>{filenameExtension}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <dt>Created</dt>
            <dd>{createdDate}</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="p-2 flex gap-2">
        <Button
          className="w-1/2 justify-center border-r border-gray-200"
          variant="outline"
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button className="w-1/2 justify-center" onClick={onDownload}>
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
