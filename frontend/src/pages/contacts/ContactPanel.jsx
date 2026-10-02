import { Drawer, Avatar, Button, Badge } from "../../components/ui";
import { Mail, Phone, Building2, Tag, Calendar, Pencil, Trash2 } from "lucide-react";
import { date } from "../../lib/format";

export function ContactPanel({ contact, open, onClose, onEdit, onDelete }) {
  if (!contact) return null;

  return (
    <Drawer open={open} onClose={onClose} title="Contact Information">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={contact.name} size="lg" />
          <div>
            <h2 className="text-xl font-bold text-ink">{contact.name}</h2>
            <p className="text-sm text-ink-soft">{contact.title || "Contact"}</p>
            <p className="text-xs text-brand-600 font-semibold mt-0.5">{contact.company}</p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-line bg-surface-muted/30 p-4 text-sm">
          <div className="flex items-center gap-3 text-ink">
            <Mail className="h-4 w-4 text-ink-soft" />
            <a href={`mailto:${contact.email}`} className="hover:underline">
              {contact.email || "No email"}
            </a>
          </div>
          <div className="flex items-center gap-3 text-ink">
            <Phone className="h-4 w-4 text-ink-soft" />
            <a href={`tel:${contact.phone}`} className="hover:underline">
              {contact.phone || "No phone"}
            </a>
          </div>
          <div className="flex items-center gap-3 text-ink">
            <Building2 className="h-4 w-4 text-ink-soft" />
            <span>{contact.company || "Independent"}</span>
          </div>
          <div className="flex items-center gap-3 text-ink">
            <Calendar className="h-4 w-4 text-ink-soft" />
            <span>Added {date(contact.createdAt)}</span>
          </div>
        </div>

        {contact.notes && (
          <div>
            <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2">Notes</h3>
            <p className="text-sm text-ink bg-surface border border-line rounded-xl p-3 whitespace-pre-wrap">
              {contact.notes}
            </p>
          </div>
        )}

        {contact.tags && contact.tags.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {contact.tags.map((t) => (
                <Badge key={t} variant="neutral">
                  <Tag className="h-3 w-3 mr-1" /> {t}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-line">
          <Button variant="outline" className="flex-1" onClick={() => { onClose(); onEdit(contact); }}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button variant="danger" className="flex-1" onClick={() => { onClose(); onDelete(contact); }}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
