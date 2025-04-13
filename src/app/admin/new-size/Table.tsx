"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { deleteSize } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Size {
  id: string;
  label: string;
  value: string;
}

// Define props for the component
interface SizeTableProps {
  sizes: Size[];
}

const SizeTable = ({ sizes }: SizeTableProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const deleteSizeMutation = useMutation({
    mutationKey: ["delete-size"],
    mutationFn: async (id: string) => {
      await deleteSize(id);
    },
    onSuccess: () => {
      toast({
        title: "Size deleted successfully",
      });
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Failed to delete size",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this size?")) {
      deleteSizeMutation.mutate(id);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Label</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sizes.map((col: Size, index: number) => (
          <TableRow key={col.id} className="bg-accent">
            <TableCell>
              <div className="font-medium">{index + 1}</div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{col.label}</TableCell>
            <TableCell className="hidden md:table-cell">{col.value}</TableCell>
            <TableCell className="text-right space-x-2">
              {/* <Button size="sm" asChild>
                  <Link href={`/admin/colegories/edit/${col.id}`}>
                    <span>Edit</span>
                  </Link>
                </Button> */}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(col.id)}
                disabled={
                  deleteSizeMutation.isPending &&
                  deleteSizeMutation.variables === col.id
                }
              >
                {deleteSizeMutation.isPending &&
                deleteSizeMutation.variables === col.id
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SizeTable;
