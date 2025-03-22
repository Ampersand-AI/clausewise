
import { FileText, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ModeToggleProps = {
  mode: "create" | "analyze";
  onModeChange: (mode: "create" | "analyze") => void;
};

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center mb-8">
      <ToggleGroup 
        type="single" 
        value={mode} 
        onValueChange={(value) => value && onModeChange(value as "create" | "analyze")} 
        className="border border-gray-800 rounded-lg bg-black/40 shadow-lg w-[350px]"
      >
        <ToggleGroupItem 
          value="create" 
          className={`data-[state=on]:bg-gray-800 data-[state=on]:text-white rounded-md flex items-center justify-center gap-2 text-base px-6 py-3 w-1/2 transition-all duration-300 ${
            mode === "create" ? "shadow-lg" : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/70"
          }`}
        >
          <FileText className="h-5 w-5" />
          Create
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="analyze" 
          className={`data-[state=on]:bg-gray-800 data-[state=on]:text-white rounded-md flex items-center justify-center gap-2 text-base px-6 py-3 w-1/2 transition-all duration-300 ${
            mode === "analyze" ? "shadow-lg" : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/70"
          }`}
        >
          <Search className="h-5 w-5" />
          Analyze
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ModeToggle;
