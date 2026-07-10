"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, ShieldOff, Trash2, CheckCircle } from "lucide-react";
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

const mockEmployers = [
  { id: "1", name: "Rajat Sharma", company: "TCS", email: "rajat@tcs.com", status: "active", joined: "Oct 12, 2025" },
  { id: "2", name: "Neha Gupta", company: "Infosys", email: "neha@infosys.com", status: "suspended", joined: "Nov 05, 2025" },
  { id: "3", name: "Amit Verma", company: "SBI", email: "amit@sbi.co.in", status: "active", joined: "Dec 01, 2025" },
];

export default function EmployersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Employers</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage and moderate employer accounts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-semibold shadow-sm">Export CSV</Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search by name, email or company..." 
            className="pl-10 bg-muted/50 border-border shadow-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto font-semibold">
          <Filter size={18} className="mr-2" />
          Filter
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px] font-bold">Employer</TableHead>
              <TableHead className="font-bold">Company</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold hidden md:table-cell">Joined</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEmployers.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold">{emp.name}</span>
                    <span className="text-sm text-muted-foreground font-medium">{emp.email}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{emp.company}</TableCell>
                <TableCell>
                  {emp.status === "active" ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Suspended</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground font-medium hidden md:table-cell">{emp.joined}</TableCell>
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
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>View company</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {emp.status === "active" ? (
                        <DropdownMenuItem className="text-amber-600">
                          <ShieldOff className="mr-2 h-4 w-4" /> Suspend
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-600">
                          <CheckCircle className="mr-2 h-4 w-4" /> Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
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
