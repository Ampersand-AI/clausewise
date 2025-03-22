
import { FileText, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ModeToggleProps = {
  mode: "create" | "analyze";
  onModeChange: (mode: "create" | "analyze") => void;
};

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative rounded-xl p-0.5 glow-effect animate-glow">
        <ToggleGroup 
          type="single" 
          value={mode} 
          onValueChange={(value) => value && onModeChange(value as "create" | "analyze")} 
          className="border border-glass-border p-1 rounded-lg bg-[#1e1e24] backdrop-blur-sm w-[350px]"
        >
          <ToggleGroupItem 
            value="create" 
            className={`data-[state=on]:bg-orange-brown-gradient data-[state=on]:text-white rounded-md flex items-center justify-center gap-2 text-base px-6 py-3 w-1/2 ${
              mode === "create" ? "" : "text-foreground/70"
            }`}
          >
            <FileText className="h-5 w-5" />
            Create
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="analyze" 
            className={`data-[state=on]:bg-orange-brown-gradient data-[state=on]:text-white rounded-md flex items-center justify-center gap-2 text-base px-6 py-3 w-1/2 ${
              mode === "analyze" ? "" : "text-foreground/70"
            }`}
          >
            <Search className="h-5 w-5" />
            Analyze
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ModeToggle;
