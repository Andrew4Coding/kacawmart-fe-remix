// Global styles for seller

import { ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export function Pagination() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        className="bg-black text-white hover:bg-gray-800"
      >
        1
      </Button>
      <Button variant="outline">2</Button>
      <Button variant="outline">3</Button>
      <Button variant="outline">4</Button>
      <span>...</span>
      <Button variant="outline">10</Button>
      <Button variant="outline" className="flex items-center gap-1">
        NEXT <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
