import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, Button, Field, Input } from "../../components/ui";
import { contactsApi } from "../../lib/services";
import { contactSchema, sanitizeNameInput, sanitizePhoneInput } from "../../lib/validation";
import { TagEditor } from "./TagEditor";

export function ContactFormDialog({ open, onClose, contact, onSaved }) {
  const isEditing = Boolean(contact?._id);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      title: "",
      tags: [],
    },
  });

  const tags = useWatch({ control, name: "tags", defaultValue: [] });

  useEffect(() => {
    if (!open) return;
    reset({
      name: contact?.name || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      company: contact?.company || "",
      title: contact?.title || "",
      tags: contact?.tags || [],
    });
  }, [open, contact, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        const res = await contactsApi.update(contact._id, data);
        if (res.success) {
          toast.success("Contact updated");
          onSaved?.();
          onClose();
        }
      } else {
        const res = await contactsApi.create(data);
        if (res.success) {
          toast.success("Contact created");
          onSaved?.();
          onClose();
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to save contact");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Contact" : "Add Contact"}
      description={isEditing ? "Update contact details." : "Create a new contact."}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Full Name *" error={errors.name?.message}>
          <Input
            placeholder="e.g. Alex Morgan"
            maxLength={50}
            {...register("name", {
              onChange: (e) => {
                e.target.value = sanitizeNameInput(e.target.value);
              },
            })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="alex@company.com"
              maxLength={100}
              {...register("email")}
            />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input
              placeholder="+1 555 0199"
              maxLength={20}
              {...register("phone", {
                onChange: (e) => {
                  e.target.value = sanitizePhoneInput(e.target.value);
                },
              })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Company" error={errors.company?.message}>
            <Input placeholder="Company name" maxLength={100} {...register("company")} />
          </Field>
          <Field label="Job Title" error={errors.title?.message}>
            <Input placeholder="e.g. VP of Sales" maxLength={100} {...register("title")} />
          </Field>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Tags</label>
          <TagEditor
            tags={tags}
            onChange={(newTags) => setValue("tags", newTags, { shouldDirty: true })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-line">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditing ? "Save Changes" : "Create Contact"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
