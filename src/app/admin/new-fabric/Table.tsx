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
import { deleteFabric } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Fabric {
  id: string;
  label: string;
  value: string;
  price: number | null;
}

// Define props for the component
interface FabricTableProps {
  fabrics: Fabric[];
}

const FabricTable = ({ fabrics }: FabricTableProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const deleteFabricMutation = useMutation({
    mutationKey: ["delete-fabric"],
    mutationFn: async (id: string) => {
      await deleteFabric(id);
    },
    onSuccess: () => {
      toast({
        title: "Fabric deleted successfully",
      });
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Failed to delete fabric",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this fabric?")) {
      deleteFabricMutation.mutate(id);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Label</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fabrics.map((col: Fabric, index: number) => (
          <TableRow key={col.id} className="bg-accent">
            <TableCell>
              <div className="font-medium">{index + 1}</div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{col.label}</TableCell>
            <TableCell className="hidden md:table-cell">{col.value}</TableCell>
            <TableCell className="hidden md:table-cell">{col.price}</TableCell>
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
                  deleteFabricMutation.isPending &&
                  deleteFabricMutation.variables === col.id
                }
              >
                {deleteFabricMutation.isPending &&
                deleteFabricMutation.variables === col.id
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

export default FabricTable;
