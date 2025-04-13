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
import { deleteColor } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Color {
  id: string;
  label: string;
  value: string;
  tw: string | null;
  hex: string | null;
}

// Define props for the component
interface ColorTableProps {
  colors: Color[];
}

const ColorTable = ({ colors }: ColorTableProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const deleteColorMutation = useMutation({
    mutationKey: ["delete-color"],
    mutationFn: async (id: string) => {
      await deleteColor(id);
    },
    onSuccess: () => {
      toast({
        title: "Color deleted successfully",
      });
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Failed to delete color",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      deleteColorMutation.mutate(id);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Label</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>TW-Tailwind-color</TableHead>
          <TableHead>Hex</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {colors.map((col: Color, index: number) => (
          <TableRow key={col.id} className="bg-accent">
            <TableCell>
              <div className="font-medium">{index + 1}</div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{col.label}</TableCell>
            <TableCell className="hidden md:table-cell">{col.value}</TableCell>
            <TableCell className="hidden md:table-cell">{col.tw}</TableCell>
            <TableCell className="hidden md:table-cell">{col.hex}</TableCell>
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
                  deleteColorMutation.isPending &&
                  deleteColorMutation.variables === col.id
                }
              >
                {deleteColorMutation.isPending &&
                deleteColorMutation.variables === col.id
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

export default ColorTable;
