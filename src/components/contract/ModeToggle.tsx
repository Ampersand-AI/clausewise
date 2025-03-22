
import { FileText, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ModeToggleProps = {
  mode: "create" | "analyze";
  onModeChange: (mode: "create" | "analyze") => void;
};

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative rounded-xl p-0.5 glow-effect animate-glow">
        <ToggleGroup 
          type="single" 
          value={mode} 
          onValueChange={(value) => value && onModeChange(value as "create" | "analyze")} 
          className="border border-bento-gray-200 dark:border-bento-brown-700 p-1 rounded-lg bg-bento-gray-50/80 dark:bg-bento-brown-800/80 backdrop-blur-sm"
        >
          <ToggleGroupItem 
            value="create" 
            className="data-[state=on]:bg-orange-brown-gradient data-[state=on]:text-white rounded-md flex items-center gap-1.5 text-sm px-5 py-1.5"
          >
            <FileText className="h-4 w-4" />
            Create
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="analyze" 
            className="data-[state=on]:bg-orange-brown-gradient data-[state=on]:text-white rounded-md flex items-center gap-1.5 text-sm px-5 py-1.5"
          >
            <Search className="h-4 w-4" />
            Analyze
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ModeToggle;
