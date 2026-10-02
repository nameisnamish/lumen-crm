import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, FileText, Trash2 } from "lucide-react";
import { Card, Button, Input } from "../../components/ui";
import { notesApi } from "../../lib/services";
import { relative } from "../../lib/format";
import { toast } from "sonner";

export default function LeadNotesTab() {
  const { lead } = useOutletContext();
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    notesApi.list().then((res) => {
      if (res.notes) {
        setNotes(res.notes.filter((n) => n.lead?._id === lead._id || n.lead === lead._id));
      }
    });
  }, [lead._id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await notesApi.create({ content, lead: lead._id });
      if (res.success) {
        toast.success("Note added");
        setContent("");
        setNotes([res.note, ...notes]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await notesApi.remove(id);
    setNotes(notes.filter((n) => n._id !== id));
    toast.success("Note deleted");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <form onSubmit={handleAddNote} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Add a private note about ${lead.name}…`}
            rows={3}
            className="w-full rounded-xl border border-line p-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <div className="flex justify-end">
            <Button size="sm" type="submit" disabled={submitting || !content.trim()}>
              <Plus className="h-4 w-4" /> Add Note
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <Card className="p-8 text-center text-sm text-ink-soft">No notes recorded yet for this lead.</Card>
        ) : (
          notes.map((n) => (
            <Card key={n._id} className="p-4 flex items-start justify-between">
              <div>
                <p className="text-sm text-ink whitespace-pre-wrap">{n.content}</p>
                <span className="mt-2 text-xs text-ink-soft block">{relative(n.createdAt)}</span>
              </div>
              <button
                onClick={() => handleDelete(n._id)}
                className="text-ink-soft hover:text-rose-600 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
