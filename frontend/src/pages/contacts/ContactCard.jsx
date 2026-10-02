import React from "react";
import { Star, Mail, Phone, Building2, MoreHorizontal, Pencil, Trash2, Tag } from "lucide-react";
import { Card, Badge, Avatar, Dropdown, DropdownItem } from "../../components/ui";

export const ContactCard = React.memo(function ContactCard({
  contact,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavorite,
}) {
  return (
    <Card
      data-flip-id={contact._id}
      className="group relative flex flex-col justify-between p-5 transition hover:shadow-md cursor-pointer"
      onClick={() => onOpen(contact)}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={contact.name} size="md" />
            <div>
              <h3 className="font-bold text-ink group-hover:text-brand-600 transition">
                {contact.name}
              </h3>
              <p className="text-xs text-ink-soft flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {contact.company || contact.title || "Independent"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleFavorite(contact._id)}
              className={`p-1.5 transition rounded-lg ${
                contact.favorite ? "text-amber-500 hover:text-amber-600" : "text-ink-soft/40 hover:text-ink-soft"
              }`}
              title={contact.favorite ? "Remove favorite" : "Mark favorite"}
            >
              <Star className={`h-4 w-4 ${contact.favorite ? "fill-current" : ""}`} />
            </button>
            <Dropdown
              trigger={
                <button className="rounded-lg p-1 text-ink-soft hover:bg-surface-dark/5 hover:text-ink">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
            >
              <DropdownItem onClick={() => onEdit(contact)}>
                <Pencil className="h-4 w-4 text-ink-soft" /> Edit contact
              </DropdownItem>
              <DropdownItem onClick={() => onDelete(contact)} className="text-rose-600">
                <Trash2 className="h-4 w-4" /> Delete contact
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
          {contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-ink-soft/70" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-ink-soft/70" />
              <span>{contact.phone}</span>
            </div>
          )}
        </div>
      </div>

      {contact.tags && contact.tags.length > 0 && (
        <div className="mt-4 border-t border-line/60 pt-3 flex flex-wrap gap-1">
          {contact.tags.map((t) => (
            <Badge key={t} variant="neutral" className="text-[10px] px-2 py-0.5">
              <Tag className="h-2.5 w-2.5 mr-1" />
              {t}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
});
