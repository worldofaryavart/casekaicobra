"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import StatusDropdown from "./StatusDropdown";
import OrderDetailsModal from "./OrderDetailsModal";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

// Type definitions based on your Prisma schema
interface TshirtColor {
  id: string;
  label: string;
  value: string;
  tw?: string | null;
  hex?: string | null;
}

interface TshirtSize {
  id: string;
  label: string;
  value: string;
}

interface TshirtFabric {
  id: string;
  label: string;
  value: string;
  price?: number | null;
}

interface Product {
  id: string;
  title: string;
  description: string;
  details: string;
  categoryId?: string | null;
  realPrice: number;
  discountPrice: number;
  images: string[];
}

interface Configuration {
  id: string;
  width?: number | null;
  height?: number | null;
  imageUrl?: string | null;
  croppedImageUrl?: string | null;
  colorId?: string | null;
  color?: TshirtColor | null;
  sizeId?: string | null;
  size?: TshirtSize | null;
  fabricId?: string | null;
  fabric?: TshirtFabric | null;
  isCustom: boolean;
  productId?: string | null;
  product?: Product | null;
}

interface ShippingAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string | null;
  phoneNumber?: string | null;
}

interface User {
  id: string;
  email: string;
}

interface Order {
  id: string;
  configurationId: string;
  configuration?: Configuration;
  user: User;
  userId: string;
  amount: number;
  isPaid: boolean;
  status: OrderStatus;
  shippingAddress?: ShippingAddress | null;
  shippingAddressId?: string | null;
  billingAddressId?: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string | null;
  trackingId?: string | null;
  createdAt: Date | string;
  updated: Date | string;
}

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden sm:table-cell">
              Purchase Date
            </TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="bg-accent cursor-pointer hover:bg-accent/80 transition-colors relative group"
              onClick={() => handleRowClick(order)}
            >
              <TableCell>
                <div className="font-medium">{order.shippingAddress?.name}</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {order.user.email}
                </div>
              </TableCell>
              <TableCell
                className="hidden sm:table-cell"
                onClick={(e) => e.stopPropagation()}
              >
                <StatusDropdown id={order.id} orderStatus={order.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {formatPrice(order.amount)}
              </TableCell>
              <TableCell className="text-center">
                <button
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(order);
                  }}
                >
                  View Details
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
