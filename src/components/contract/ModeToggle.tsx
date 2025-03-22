
import { FileText, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ModeToggleProps = {
  mode: "create" | "analyze";
  onModeChange: (mode: "create" | "analyze") => void;
};

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center mb-4">
      <ToggleGroup type="single" value={mode} onValueChange={(value) => value && onModeChange(value as "create" | "analyze")} className="border border-amber-200 dark:border-amber-700 p-1 rounded-md bg-amber-50 dark:bg-amber-900/20">
        <ToggleGroupItem value="create" className="data-[state=on]:bg-white dark:data-[state=on]:bg-amber-700 rounded flex items-center gap-1 text-sm px-4 text-amber-900 dark:text-amber-100">
          <FileText className="h-4 w-4" />
          Create
        </ToggleGroupItem>
        <ToggleGroupItem value="analyze" className="data-[state=on]:bg-white dark:data-[state=on]:bg-amber-700 rounded flex items-center gap-1 text-sm px-4 text-amber-900 dark:text-amber-100">
          <Search className="h-4 w-4" />
          Analyze
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ModeToggle;
