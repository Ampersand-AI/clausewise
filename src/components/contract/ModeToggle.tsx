
import { FileText, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ModeToggleProps = {
  mode: "create" | "analyze";
  onModeChange: (mode: "create" | "analyze") => void;
};

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center mb-4">
      <ToggleGroup 
        type="single" 
        value={mode} 
        onValueChange={(value) => value && onModeChange(value as "create" | "analyze")} 
        className="border border-bento-gray-200 dark:border-bento-gray-700 p-1 rounded-md bg-bento-gray-50 dark:bg-bento-gray-800"
      >
        <ToggleGroupItem 
          value="create" 
          className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-bento-yellow-500 data-[state=on]:to-bento-orange-500 data-[state=on]:text-white rounded flex items-center gap-1 text-sm px-4"
        >
          <FileText className="h-4 w-4" />
          Create
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="analyze" 
          className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-bento-yellow-500 data-[state=on]:to-bento-orange-500 data-[state=on]:text-white rounded flex items-center gap-1 text-sm px-4"
        >
          <Search className="h-4 w-4" />
          Analyze
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ModeToggle;
