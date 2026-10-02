import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Dialog, Textarea, Select, Field } from "../../components/ui";
import { notesApi } from "../../lib/services";

export function NoteFormDialog({ open, onClose, note, leads, onSaved }) {
  const isEditing = Boolean(note);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Reset form whenever the dialog opens or the note being edited changes
  useEffect(() => {
    if (open) {
      reset({
        content: note?.content ?? "",
        lead: note?.lead?._id ?? "",
        pinned: note?.pinned ?? false,
      });
    }
  }, [open, note, reset]);

  const onSubmit = async (values) => {
    const payload = {
      content: values.content,
      pinned: values.pinned,
      lead: values.lead || undefined,
    };

    try {
      if (isEditing) {
        await notesApi.update(note._id, payload);
        toast.success("Note updated");
      } else {
        await notesApi.create(payload);
        toast.success("Note created");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message ?? "Could not save note");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit note" : "New note"}
      description={
        isEditing ? "Update your note below." : "Add a note linked to a lead or contact."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
        {/* Content */}
        <Field label="Note" error={errors.content?.message}>
          <Textarea
            rows={6}
            placeholder="Write your note here…"
            {...register("content", { required: "Note content is required." })}
          />
        </Field>

        {/* Lead picker */}
        <Field label="Link to lead">
          <Select {...register("lead")}>
            <option value="">No linked lead</option>
            {leads.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name}{l.company ? ` — ${l.company}` : ""}
              </option>
            ))}
          </Select>
        </Field>

        {/* Pinned pill toggle */}
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface-muted/40 px-4 py-3 transition hover:bg-surface-muted/70">
          <div className="relative flex-shrink-0">
            <input type="checkbox" className="peer sr-only" {...register("pinned")} />
            <div className="h-5 w-9 rounded-full bg-line transition peer-checked:bg-brand-500" />
            <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-surface shadow transition peer-checked:translate-x-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Pin this note</p>
            <p className="text-xs text-ink-soft">Pinned notes appear at the top of the list.</p>
          </div>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={isSubmitting}>
            {isEditing ? "Save changes" : "Create note"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
