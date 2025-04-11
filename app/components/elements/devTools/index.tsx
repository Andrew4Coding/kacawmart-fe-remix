import { Code2 } from "lucide-react";
import { cn } from "~/lib/utils";

export default function DevTools({isHidden}: {isHidden?: boolean}) { 
    return (
        <div className={cn('w-32 h-32 fixed bottom-10 left-10  rounded-full flex items-center justify-center bg-gray-800 z-50', isHidden ? 'hidden' : 'block')}>
            <div className="flex flex-col items-center justify-center">
                <Code2 className="text-white" size={32} />
                <span className="text-white text-sm mt-2">DevTools</span>
            </div>
        </div>
    );
}
