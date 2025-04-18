
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
        className="border rounded-md bg-background"
      >
        <ToggleGroupItem 
          value="create" 
          className="flex items-center gap-1 text-sm px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <FileText className="h-4 w-4" />
          <span>Create</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="analyze" 
          className="flex items-center gap-1 text-sm px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Search className="h-4 w-4" />
          <span>Analyze</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ModeToggle;
