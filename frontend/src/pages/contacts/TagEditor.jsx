import { useState } from "react";
import { Tag, Plus, X } from "lucide-react";
import { Badge } from "../../components/ui";

export function TagEditor({ tags = [], onChange }) {
  const [input, setInput] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
      setInput("");
    }
  };

  const handleRemove = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <Badge key={t} variant="neutral" className="gap-1 pr-1">
            <Tag className="h-3 w-3" />
            {t}
            <button
              type="button"
              onClick={() => handleRemove(t)}
              className="ml-1 rounded-full p-0.5 hover:bg-surface-dark/10"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a tag..."
          className="h-8 rounded-lg border border-line bg-surface px-2.5 text-xs focus:border-brand-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-ink hover:bg-surface-muted"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
    </div>
  );
}
