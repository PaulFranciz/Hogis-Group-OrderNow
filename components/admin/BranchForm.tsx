'use client'

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // For delivery zone
import { Checkbox } from "@/components/ui/checkbox"; // For supported types
import { OrderType } from '@/components/OrderTypeSelector'; // Import OrderType
import { Id } from '@/convex/_generated/dataModel';

// GeoJSON types
type GeoJSONPolygon = {
  type: 'Polygon';
  coordinates: number[][][];
};

type GeoJSONMultiPolygon = {
  type: 'MultiPolygon';
  coordinates: number[][][][];
};

// Allow empty object for deliveryZone
type DeliveryZone = GeoJSONPolygon | GeoJSONMultiPolygon | Record<string, never>;

// Zod schema for form validation - should match convex/branches.ts args
const branchFormSchema = z.object({
  name: z.string().min(3, { message: "Branch name must be at least 3 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  contactNumber: z.string().min(5, { message: "Contact number must be at least 5 characters." }),
  operatingHours: z.string().min(5, { message: "Operating hours must be specified." }), // Example: "Mon-Fri 9am-10pm, Sat-Sun 11am-11pm"
  supportedOrderTypes: z.array(z.enum(["Delivery", "Dine-In", "Take-out"])).min(1, {
    message: "At least one order type must be supported.",
  }),
  deliveryZone: z.string().optional().refine(val => {
    if (!val || val.trim() === '') return true; // Allow empty
    try {
      const parsed = JSON.parse(val);
      return parsed.type === 'Polygon' || parsed.type === 'MultiPolygon';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) { // Using underscore and disabling eslint rule
      return false;
    }
  }, { message: "Delivery zone must be valid GeoJSON Polygon or MultiPolygon (or empty)." }),
  isActive: z.boolean().default(true),
});

export type BranchFormData = z.infer<typeof branchFormSchema>;

// Update Branch type to match Convex schema
export type Branch = {
  _id: Id<"branches">;
  _creationTime: number;
  name: string;
  address: string;
  operatingHours: string;
  supportedOrderTypes: ("Delivery" | "Dine-In" | "Take-out")[];
  contactNumber?: string;
  isActive?: boolean;
  deliveryZone?: DeliveryZone;
  minimumOrderAmount?: number;
  deliveryFee?: number;
};

interface BranchFormProps {
  onSubmit: (data: BranchFormData) => Promise<void>; // Make async to handle mutation state
  isLoading: boolean;
  defaultValues?: Partial<BranchFormData>;
  submitButtonText?: string;
}

const ALL_ORDER_TYPES: OrderType[] = ["Delivery", "Dine-In", "Take-out"];

export default function BranchForm({ 
    onSubmit,
    isLoading,
    defaultValues,
    submitButtonText = "Save Branch",
 }: BranchFormProps) {

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: defaultValues || {
      name: '',
      address: '',
      contactNumber: '',
      operatingHours: '',
      supportedOrderTypes: [],
      deliveryZone: '',
      isActive: true,
    },
  });

  async function handleFormSubmit(values: BranchFormData) {
    console.log("Branch form submitted:", values);
    await onSubmit(values); 
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Hogis Luxury Suites" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="+234-123-456-7890" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Foodie Lane, Flavor Town" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="operatingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operating Hours</FormLabel>
              <FormControl>
                <Input placeholder="Mon-Fri 9am-10pm, Sat-Sun 11am-11pm" {...field} />
              </FormControl>
              <FormDescription>
                Enter the times the branch is open for orders.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="supportedOrderTypes"
          render={() => ( // Removed unused field parameter
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Supported Order Types</FormLabel>
                <FormDescription>
                  Select the order methods available at this branch.
                </FormDescription>
              </div>
              <div className="flex flex-wrap gap-4">
                {ALL_ORDER_TYPES.map((orderType) => (
                  <FormField
                    key={orderType}
                    control={form.control}
                    name="supportedOrderTypes"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={orderType}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(orderType)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, orderType])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== orderType
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {orderType}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Zone (GeoJSON)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{
  "type": "Polygon",
  "coordinates": [[ [-122.4, 37.8], [-122.5, 37.8], [-122.5, 37.7], [-122.4, 37.7], [-122.4, 37.8] ]]
}'
                  className="min-h-[150px] font-mono text-sm"
                  {...field}
                  value={field.value ?? ''} 
                />
              </FormControl>
              <FormDescription>
                Paste a valid GeoJSON Polygon or MultiPolygon definition, or leave empty.
                Use tools like geojson.io to create one.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active Branch</FormLabel>
                <FormDescription>
                  Only active branches will be shown to customers and accept orders.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}