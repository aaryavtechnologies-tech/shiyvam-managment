"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, CheckCircle, Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markMessageReadAction, deleteMessageAction } from "@/actions/admin/messages";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  async function fetchData() {
    const supabase = createClient();
    const { data: messages, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (messages) {
      setData(messages as ContactMessage[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnDef<ContactMessage>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sender" />,
      cell: ({ row }) => (
        <div>
          <div className="font-bold">{row.getValue("name")}</div>
          <div className="text-xs text-muted-foreground">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />,
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate">
          {row.getValue("subject")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 flex w-fit items-center gap-1.5 \${
            status === "unread" ? "bg-amber-50 text-amber-700 border-amber-200" :
            "bg-green-50 text-green-700 border-green-200"
          }`}>
            {status === "unread" ? <Mail size={12} /> : <MailOpen size={12} />}
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => {
        return new Date(row.getValue("created_at")).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const msg = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-bold"
              onClick={async () => {
                setViewingMessage(msg);
                if (msg.status === "unread") {
                  await markMessageReadAction(msg.id);
                  fetchData(); // Refresh UI to show as read
                }
              }}
            >
              Read
            </Button>
            {msg.status === "unread" && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={async () => {
                  const res = await markMessageReadAction(msg.id);
                  if (res.success) {
                    toast.success("Marked as read");
                    fetchData();
                  } else {
                    toast.error(res.error);
                  }
                }}
              >
                <CheckCircle size={16} />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={async () => {
                if (confirm("Are you sure you want to delete this message?")) {
                  const res = await deleteMessageAction(msg.id);
                  if (res.success) {
                    toast.success("Message Deleted");
                    fetchData();
                  } else {
                    toast.error(res.error);
                  }
                }
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground font-medium mt-1">View and manage support inquiries from the public site.</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white border-2 border-border rounded-[2rem] shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} searchKey="subject" />
      )}

      <Dialog open={!!viewingMessage} onOpenChange={(open) => !open && setViewingMessage(null)}>
        <DialogContent className="max-w-xl rounded-3xl border-2 border-border shadow-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-extrabold">{viewingMessage?.subject}</DialogTitle>
          </DialogHeader>
          {viewingMessage && (
            <div className="space-y-4 mt-4">
              <div className="flex gap-4 p-4 bg-muted/30 border-2 border-border border-dashed rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {viewingMessage.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold">{viewingMessage.name}</h4>
                  <p className="text-muted-foreground text-sm font-medium">{viewingMessage.email}</p>
                  <p className="text-muted-foreground text-xs mt-1">{new Date(viewingMessage.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="p-6 bg-white border-2 border-border rounded-2xl shadow-sm font-medium whitespace-pre-wrap leading-relaxed">
                {viewingMessage.message}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
