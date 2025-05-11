"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const {
    id,
    amount,
    isPaid,
    status,
    createdAt,
    paymentMethod,
    paymentStatus,
    trackingId,
    configuration,
    shippingAddress,
    user,
  } = order;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mt-6">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Order{" "}
            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm">
              {id.substring(0, 8)}
            </span>
          </DialogTitle>
          <DialogDescription>
            Placed on {new Date(createdAt).toLocaleDateString()} at{" "}
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </DialogDescription>
        </DialogHeader>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-slate-50 rounded-md">
            <h3 className="font-medium mb-2">Order Details</h3>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-muted-foreground">Status:</span>
              <StatusDropdown id={id} orderStatus={status} />

              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatPrice(amount)}</span>

              <span className="text-muted-foreground">Payment:</span>
              <span
                className={`font-medium ${isPaid ? "text-green-600" : "text-orange-600"}`}
              >
                {isPaid ? "Paid" : "Pending"}
              </span>

              <span className="text-muted-foreground">Method:</span>
              <span>{paymentMethod}</span>

              <span className="text-muted-foreground">Payment Status:</span>
              <span>{paymentStatus}</span>

              {trackingId && (
                <>
                  <span className="text-muted-foreground">Tracking ID:</span>
                  <span>{trackingId}</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-md">
            <h3 className="font-medium mb-2">Customer</h3>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span>{user?.email}</span>

              {shippingAddress && (
                <>
                  <span className="text-muted-foreground">Name:</span>
                  <span>{shippingAddress.name}</span>

                  <span className="text-muted-foreground">Address:</span>
                  <span>
                    {shippingAddress.street}, {shippingAddress.city},{" "}
                    {shippingAddress.state} {shippingAddress.postalCode},{" "}
                    {shippingAddress.country}
                  </span>

                  <span className="text-muted-foreground">Phone:</span>
                  <span>{shippingAddress.phoneNumber || "N/A"}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Configuration Details */}
        <div className="border rounded-md">
          <h3 className="font-medium p-4 border-b bg-slate-100">
            Product Configuration
          </h3>

          {configuration && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Info */}
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Product Information
                  </h4>
                  <div className="text-sm">
                    {configuration.isCustom ? (
                      <div className="mb-4">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                          Custom Order
                        </span>

                        {configuration.width && configuration.height && (
                          <p className="mt-2">
                            <span className="text-muted-foreground">
                              Dimensions:{" "}
                            </span>
                            {configuration.width}cm × {configuration.height}cm
                          </p>
                        )}
                      </div>
                    ) : configuration.product ? (
                      <div className="mb-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          Shop Product
                        </span>
                        <p className="font-medium mt-2">
                          {configuration.product.title}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {configuration.product.description}
                        </p>
                      </div>
                    ) : (
                      <p>No product information available</p>
                    )}
                  </div>
                </div>

                {/* Configuration Options */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Selected Options</h4>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Color:</span>
                    <div className="flex items-center">
                      {configuration.color ? (
                        <>
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{
                              backgroundColor:
                                configuration.color.hex || "#ccc",
                            }}
                          ></div>
                          <span>{configuration.color.label}</span>
                        </>
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>

                    <span className="text-muted-foreground">Size:</span>
                    <span>{configuration.size?.label || "N/A"}</span>

                    <span className="text-muted-foreground">Fabric:</span>
                    <span>{configuration.fabric?.label || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Display Design Image if available */}
              {(configuration.imageUrl || configuration.croppedImageUrl) && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Design Preview</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {configuration.imageUrl && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Original Design
                        </p>
                        <img
                          src={configuration.imageUrl}
                          alt="Design"
                          className="rounded border max-h-40 object-contain bg-slate-50"
                        />
                      </div>
                    )}
                    {configuration.croppedImageUrl && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Cropped Design
                        </p>
                        <img
                          src={configuration.croppedImageUrl}
                          alt="Cropped Design"
                          className="rounded border max-h-40 object-contain bg-slate-50"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {!configuration && (
            <p className="p-4">No configuration data available</p>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
