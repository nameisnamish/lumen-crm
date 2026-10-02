import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, Upload, Trash2 } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Field,
  Avatar,
} from "../../components/ui";
import { authApi } from "../../lib/services";
import { cn } from "../../lib/utils";

function SectionIcon({ icon: Icon, className }) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50",
        className
      )}
    >
      <Icon className="h-4 w-4 text-brand-700" />
    </div>
  );
}

export function ProfileCard({ user, updateUser }) {
  const fileInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const currentAvatar = watch("avatar", user?.avatar || "");

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name || "",
      company: user.company || "",
      avatar: user.avatar || "",
    });
  }, [user, reset]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setValue("avatar", dataUrl, { shouldDirty: true });
        toast.success("Photo loaded from device! Click 'Save changes' to save.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setValue("avatar", "", { shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (form) => {
    try {
      const res = await authApi.updateProfile(form);
      updateUser(res.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Could not update profile");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SectionIcon icon={User} />
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information and photo.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        {/* Avatar preview & local device upload row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface-muted p-4">
          <div className="flex items-center gap-4">
            <Avatar name={user?.name} src={currentAvatar} size="lg" />
            <div>
              <p className="text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs text-ink-soft">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" /> Upload from device
            </Button>
            {currentAvatar && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </Button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              error={errors.name?.message}
              className="sm:col-span-2"
            >
              <Input
                placeholder="Your full name"
                {...register("name", { required: "Name is required" })}
              />
            </Field>

            <Field label="Company">
              <Input placeholder="Your company" {...register("company")} />
            </Field>

            {/* Email is read-only */}
            <Field label="Email address">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
                <Input
                  value={user?.email || ""}
                  disabled
                  className="pl-9"
                  readOnly
                />
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                Email can't be changed — contact support if needed.
              </p>
            </Field>

            <Field
              label="Avatar Image URL (or uploaded file above)"
              error={errors.avatar?.message}
              className="sm:col-span-2"
            >
              <Input
                placeholder="https://example.com/photo.jpg"
                {...register("avatar")}
              />
            </Field>
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" loading={isSubmitting}>
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
