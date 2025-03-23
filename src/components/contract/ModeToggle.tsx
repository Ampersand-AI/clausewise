
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
        className="border border-terminal-cyan/30 p-1 rounded-sm bg-terminal-background font-mono"
      >
        <ToggleGroupItem 
          value="create" 
          className="data-[state=on]:bg-terminal-cyan/20 data-[state=on]:text-terminal-cyan rounded-sm flex items-center gap-1 text-sm px-4"
        >
          <FileText className="h-4 w-4" />
          <span>Create</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="analyze" 
          className="data-[state=on]:bg-terminal-cyan/20 data-[state=on]:text-terminal-cyan rounded-sm flex items-center gap-1 text-sm px-4"
        >
          <Search className="h-4 w-4" />
          <span>Analyze</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ModeToggle;
