"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Trash2, Eye, Pin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockJobs = [
  { id: "1", title: "Senior Software Engineer", company: "TCS", type: "Full-time", status: "pending", posted: "2 hours ago" },
  { id: "2", title: "Probationary Officer", company: "SBI", type: "Government", status: "approved", posted: "1 day ago" },
  { id: "3", title: "Marketing Executive", company: "Zomato", type: "Contract", status: "rejected", posted: "3 days ago" },
];

export default function JobsModerationPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Job Moderation</h1>
          <p className="text-muted-foreground font-medium mt-1">Review, approve, and manage posted jobs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-semibold shadow-sm">Bulk Actions</Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search jobs by title or company..." 
            className="pl-10 bg-muted/50 border-border shadow-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="flex-1 sm:w-auto h-10 px-3 py-2 rounded-lg border border-border bg-muted/50 text-sm font-semibold">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button variant="outline" className="font-semibold">
            <Filter size={18} className="mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px] font-bold">Job Title</TableHead>
              <TableHead className="font-bold">Company</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-primary">{job.title}</span>
                    <span className="text-xs text-muted-foreground font-medium mt-1">Posted {job.posted}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{job.company}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-medium bg-muted text-muted-foreground">{job.type}</Badge>
                </TableCell>
                <TableCell>
                  {job.status === "approved" && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>}
                  {job.status === "pending" && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending Review</Badge>}
                  {job.status === "rejected" && <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="font-semibold">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> View full details
                      </DropdownMenuItem>
                      
                      {job.status === "pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve Job
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" /> Reject Job
                          </DropdownMenuItem>
                        </>
                      )}

                      {job.status === "approved" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-amber-600">
                            <Star className="mr-2 h-4 w-4" /> Feature Job
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-blue-600">
                            <Pin className="mr-2 h-4 w-4" /> Pin to top
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
