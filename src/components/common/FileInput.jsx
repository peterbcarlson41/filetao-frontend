import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FileInput() {
  return (
    // Use flexbox to center the card both horizontally and vertically
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-sm w-full">
        <CardHeader>
          <div>File Upload</div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="file">Choose File</Label>
              <Input id="file" type="file" />
            </div>
            <Button>Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
