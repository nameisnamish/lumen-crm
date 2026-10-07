import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, Dialog, Input, Textarea, Select, Field } from "../../components/ui";
import { tasksApi } from "../../lib/services";
import { dateInputValue } from "../../lib/format";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../lib/constants";
import { taskSchema } from "../../lib/validation";

export function TaskFormDialog({ open, onClose, task, leads, onSaved }) {
  const isEdit = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
  });

  // Reset form whenever the dialog opens or the target task changes.
  useEffect(() => {
    if (open) {
      reset(
        task
          ? {
              title: task.title ?? "",
              description: task.description ?? "",
              dueDate: dateInputValue(task.dueDate),
              status: task.status ?? "Pending",
              priority: task.priority ?? "Medium",
              relatedLead: task.relatedLead?._id ?? "",
            }
          : {
              title: "",
              description: "",
              dueDate: "",
              status: "Pending",
              priority: "Medium",
              relatedLead: "",
            }
      );
    }
  }, [open, task, reset]);

  const onSubmit = async (values) => {
    const payload = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      dueDate: values.dueDate || undefined,
      status: values.status,
      priority: values.priority,
      relatedLead: values.relatedLead || null,
    };
    try {
      if (isEdit) {
        await tasksApi.update(task._id, payload);
        toast.success("Task updated");
      } else {
        await tasksApi.create(payload);
        toast.success("Task created");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit task" : "New task"}
      description={isEdit ? "Update the details below." : "Fill in the details to create a task."}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <Field label="Title *" error={errors.title?.message}>
          <Input
            placeholder="e.g. Follow up with Acme Corp"
            maxLength={100}
            {...register("title")}
          />
        </Field>

        {/* Description */}
        <Field label="Description" error={errors.description?.message}>
          <Textarea rows={3} maxLength={1000} placeholder="Optional notes…" {...register("description")} />
        </Field>

        {/* Due date + Priority */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Due date" error={errors.dueDate?.message}>
            <Input type="date" {...register("dueDate")} />
          </Field>
          <Field label="Priority" error={errors.priority?.message}>
            <Select {...register("priority")}>
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Status */}
        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>

        {/* Linked lead */}
        <Field label="Linked lead" error={errors.relatedLead?.message}>
          <Select {...register("relatedLead")}>
            <option value="">No linked lead</option>
            {leads.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name}
                {l.company ? ` — ${l.company}` : ""}
              </option>
            ))}
          </Select>
        </Field>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={isSubmitting}>
            {isEdit ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
