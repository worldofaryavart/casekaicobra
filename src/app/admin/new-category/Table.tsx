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
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { deleteCategory } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

// Define the Category type
interface Category {
  id: string;
  name: string;
}

// Define props for the component
interface CategoryTableProps {
  categories: Category[];
}

const CategoryTable = ({ categories }: CategoryTableProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const deleteCategoryMutation = useMutation({
    mutationKey: ["delete-category"],
    mutationFn: async (id: string) => {
      await deleteCategory(id);
    },
    onSuccess: () => {
      toast({
        title: "Category deleted successfully",
      });
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Failed to delete category",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((cat: Category, index: number) => (
          <TableRow key={cat.id} className="bg-accent">
            <TableCell>
              <div className="font-medium">{index + 1}</div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{cat.name}</TableCell>
            <TableCell className="text-right space-x-2">
              {/* <Button size="sm" asChild>
                <Link href={`/admin/categories/edit/${cat.id}`}>
                  <span>Edit</span>
                </Link>
              </Button> */}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(cat.id)}
                disabled={
                  deleteCategoryMutation.isPending &&
                  deleteCategoryMutation.variables === cat.id
                }
              >
                {deleteCategoryMutation.isPending &&
                deleteCategoryMutation.variables === cat.id
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

export default CategoryTable;
