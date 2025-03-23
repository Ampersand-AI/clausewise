
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
        className="border border-bento-border p-1 rounded-lg bg-bento-card shadow-sm"
      >
        <ToggleGroupItem 
          value="create" 
          className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary rounded-md flex items-center gap-1 text-sm px-4"
        >
          <FileText className="h-4 w-4" />
          <span>Create</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="analyze" 
          className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary rounded-md flex items-center gap-1 text-sm px-4"
        >
          <Search className="h-4 w-4" />
          <span>Analyze</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ModeToggle;
