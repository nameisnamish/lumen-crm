import { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Building2,
  User,
  DollarSign,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Dialog, Button, Field, Input, Select, Textarea, Badge } from "../ui";
import { leadsApi } from "../../lib/services";
import { LEAD_STAGES, LEAD_PRIORITIES, LEAD_SOURCES } from "../../lib/constants";
import { leadSchema, sanitizeNameInput, sanitizePhoneInput } from "../../lib/validation";
import { useDebounce } from "../../hooks/useDebounce";
import { currency } from "../../lib/format";

/**
 * Multi-Step Lead Creation Wizard (Viva Concepts):
 * 1. UNCONTROLLED INPUTS: React Hook Form leverages uncontrolled inputs by registering
 *    DOM refs directly. Form values reside in the DOM until validation/submission, preventing
 *    costly re-renders on every keystroke.
 * 2. STEP VALIDATION: Step progression calls `trigger(['fields...'])` to validate only
 *    the active step's subset of schema rules while preserving accumulated wizard state.
 * 3. DYNAMIC ARRAYS: `useFieldArray` provides immutable list mutations (append/remove)
 *    for tags and additional contacts within the unified form instance.
 */

const STEP_TITLES = [
  { step: 1, title: "Company", icon: Building2, desc: "Organization & categorization" },
  { step: 2, title: "Contact", icon: User, desc: "Primary & secondary contacts" },
  { step: 3, title: "Deal", icon: DollarSign, desc: "Pipeline stage & deal valuation" },
  { step: 4, title: "Review", icon: CheckCircle2, desc: "Verify details & submit" },
];

export function LeadWizardDialog({ open, onClose, onSaved }) {
  const [step, setStep] = useState(1);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailConflict, setEmailConflict] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setError,
    clearErrors,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leadSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      value: 0,
      status: "New",
      priority: "Medium",
      source: "Website",
      notes: "",
      tags: [],
      additionalContacts: [],
    },
  });

  // Dynamic tags via useFieldArray
  const [tagInput, setTagInput] = useState("");

  // Dynamic additional contacts via useFieldArray
  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: "additionalContacts",
  });

  const watchedEmail = useWatch({ control, name: "email" });
  const debouncedEmail = useDebounce(watchedEmail, 400);

  // Debounced async email uniqueness check
  useEffect(() => {
    let ignore = false;
    async function checkEmailUniqueness() {
      if (!debouncedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail)) {
        setEmailConflict(false);
        setEmailChecking(false);
        return;
      }
      setEmailChecking(true);
      try {
        const res = await leadsApi.checkEmail(debouncedEmail);
        if (!ignore) {
          if (res.exists) {
            setEmailConflict(true);
            setError("email", {
              type: "manual",
              message: "A lead with this email already exists in the system",
            });
          } else {
            setEmailConflict(false);
            clearErrors("email");
          }
        }
      } catch {
        // Fallback gracefully on network error
      } finally {
        if (!ignore) setEmailChecking(false);
      }
    }

    checkEmailUniqueness();
    return () => {
      ignore = true;
    };
  }, [debouncedEmail, setError, clearErrors]);

  const handleClose = () => {
    setStep(1);
    setEmailConflict(false);
    setEmailChecking(false);
    setTagInput("");
    reset();
    onClose();
  };

  // Handle Next step with per-step field validation
  const handleNext = async () => {
    if (step === 1) {
      const valid = await trigger(["company"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["name", "email", "phone"]);
      if (!valid) return;

      // Async email validation check before leaving Step 2
      const emailVal = getValues("email");
      if (emailVal && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        try {
          const res = await leadsApi.checkEmail(emailVal);
          if (res.exists) {
            setEmailConflict(true);
            setError("email", {
              type: "manual",
              message: "A lead with this email already exists in the system",
            });
            return;
          }
        } catch {
          // ignore
        }
      }

      setStep(3);
    } else if (step === 3) {
      const valid = await trigger(["value", "status", "priority", "source", "notes"]);
      if (valid) setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const val = tagInput.trim();
    if (!val) return;
    const current = getValues("tags") || [];
    if (!current.includes(val)) {
      reset({ ...getValues(), tags: [...current, val] });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    const current = getValues("tags") || [];
    reset({ ...getValues(), tags: current.filter((t) => t !== tagToRemove) });
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      value: Number(data.value) || 0,
    };
    try {
      const res = await leadsApi.create(payload);
      toast.success("Lead created successfully 🎉");
      onSaved?.(res.lead);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to create lead");
    }
  };

  const formValues = getValues();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Create New Lead (Wizard)"
      description="Follow the guided multi-step flow to capture all lead metadata."
    >
      {/* Step Indicator Progress Bar */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2">
          {STEP_TITLES.map((st) => {
            const Icon = st.icon;
            const isActive = step === st.step;
            const isCompleted = step > st.step;
            return (
              <div
                key={st.step}
                className={`flex flex-col items-center rounded-xl p-2 text-center transition-all ${
                  isActive
                    ? "bg-brand-50 border border-brand-200 text-brand-700"
                    : isCompleted
                    ? "bg-surface-muted border border-line text-ink"
                    : "text-ink-soft opacity-60"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full mb-1 text-xs font-semibold ${
                    isActive
                      ? "bg-brand-500 text-white shadow-xs"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-surface-muted text-ink-soft"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] font-semibold">{st.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* STEP 1: Company & Tags */}
        {step === 1 && (
          <div className="space-y-4">
            <Field label="Company Name" error={errors.company?.message}>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <Input
                  placeholder="e.g. Acme Corporation"
                  className="pl-9"
                  maxLength={100}
                  {...register("company")}
                />
              </div>
            </Field>

            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">Tags & Categorization</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  maxLength={30}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag (e.g. Enterprise, SaaS, Q4)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(formValues.tags || []).map((t) => (
                  <Badge key={t} variant="neutral" className="gap-1.5 py-1 px-2.5">
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-ink-soft hover:text-rose-500 transition cursor-pointer"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {(!formValues.tags || formValues.tags.length === 0) && (
                  <p className="text-xs text-ink-soft italic">No tags added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Contact & Secondary Contacts */}
        {step === 2 && (
          <div className="space-y-4">
            <Field label="Primary Contact Name *" error={errors.name?.message}>
              <Input
                placeholder="e.g. Sarah Jenkins"
                maxLength={50}
                {...register("name", {
                  onChange: (e) => {
                    e.target.value = sanitizeNameInput(e.target.value);
                  },
                })}
              />
            </Field>

            <Field label="Email Address" error={errors.email?.message}>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="sarah@company.com"
                  maxLength={100}
                  {...register("email")}
                />
                {emailChecking && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-brand-500" />
                )}
              </div>
              {emailConflict && (
                <p className="text-xs text-rose-500 mt-1">
                  Email is already associated with an existing lead.
                </p>
              )}
            </Field>

            <Field label="Phone Number" error={errors.phone?.message}>
              <Input
                placeholder="+1 (555) 234-5678"
                maxLength={20}
                {...register("phone", {
                  onChange: (e) => {
                    e.target.value = sanitizePhoneInput(e.target.value);
                  },
                })}
              />
            </Field>

            {/* Additional Contacts via useFieldArray */}
            <div className="border-t border-line pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">Additional Contacts</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendContact({ name: "", email: "", role: "" })}
                  className="gap-1 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Contact Row
                </Button>
              </div>

              {contactFields.length === 0 && (
                <p className="text-xs text-ink-soft italic">No additional contacts.</p>
              )}

              {contactFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-2 rounded-xl border border-line bg-surface-muted/30 p-2.5"
                >
                  <Input
                    placeholder="Name"
                    className="text-xs"
                    maxLength={50}
                    {...register(`additionalContacts.${index}.name`, {
                      onChange: (e) => {
                        e.target.value = sanitizeNameInput(e.target.value);
                      },
                    })}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    className="text-xs"
                    maxLength={100}
                    {...register(`additionalContacts.${index}.email`)}
                  />
                  <Input
                    placeholder="Role"
                    className="text-xs"
                    maxLength={50}
                    {...register(`additionalContacts.${index}.role`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContact(index)}
                    className="text-rose-500 hover:bg-rose-50 px-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Deal Details */}
        {step === 3 && (
          <div className="space-y-4">
            <Field label="Deal Value (USD)" error={errors.value?.message}>
              <Input
                type="number"
                min="0"
                max="1000000000"
                placeholder="0"
                {...register("value")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Pipeline Stage">
                <Select {...register("status")}>
                  {LEAD_STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Priority Level">
                <Select {...register("priority")}>
                  {LEAD_PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Lead Source">
              <Select {...register("source")}>
                {LEAD_SOURCES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>

            <Field label="Notes & Context" error={errors.notes?.message}>
              <Textarea
                rows={3}
                maxLength={2000}
                placeholder="Initial call summary, next steps..."
                {...register("notes")}
              />
            </Field>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-3.5 rounded-2xl border border-line bg-surface-muted/30 p-4 text-xs">
            <div className="flex items-center gap-2 text-brand-700 font-semibold border-b border-line pb-2">
              <Sparkles className="h-4 w-4" />
              <span>Review Lead Summary</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-ink-soft">Primary Contact:</p>
                <p className="font-semibold text-ink">{formValues.name || "—"}</p>
              </div>
              <div>
                <p className="text-ink-soft">Company:</p>
                <p className="font-semibold text-ink">{formValues.company || "—"}</p>
              </div>
              <div>
                <p className="text-ink-soft">Email:</p>
                <p className="font-semibold text-ink">{formValues.email || "—"}</p>
              </div>
              <div>
                <p className="text-ink-soft">Phone:</p>
                <p className="font-semibold text-ink">{formValues.phone || "—"}</p>
              </div>
              <div>
                <p className="text-ink-soft">Deal Value:</p>
                <p className="font-semibold text-ink">{currency(Number(formValues.value) || 0)}</p>
              </div>
              <div>
                <p className="text-ink-soft">Stage / Priority:</p>
                <p className="font-semibold text-ink">{formValues.status} · {formValues.priority}</p>
              </div>
            </div>

            {(formValues.tags?.length > 0) && (
              <div className="border-t border-line pt-2">
                <p className="text-ink-soft mb-1">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {formValues.tags.map((t) => (
                    <Badge key={t} variant="neutral">{t}</Badge>
                  ))}
                </div>
              </div>
            )}

            {(formValues.additionalContacts?.length > 0) && (
              <div className="border-t border-line pt-2">
                <p className="text-ink-soft mb-1">Additional Contacts ({formValues.additionalContacts.length}):</p>
                <ul className="list-disc list-inside space-y-0.5 text-ink">
                  {formValues.additionalContacts.map((c, i) => (
                    <li key={i}>{c.name} {c.role ? `(${c.role})` : ""} {c.email ? `— ${c.email}` : ""}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center pt-3 border-t border-line">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handlePrev} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}

          {step < 4 ? (
            <Button type="button" onClick={handleNext} className="gap-1.5">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" loading={isSubmitting} className="gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Submit Lead
            </Button>
          )}
        </div>
      </form>
    </Dialog>
  );
}
