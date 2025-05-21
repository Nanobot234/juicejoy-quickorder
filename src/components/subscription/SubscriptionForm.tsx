
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getSubscriptionPlans, createSubscription } from "@/services/subscriptionService";
import { SubscriptionPlan, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SubscriptionFormProps {
  items: CartItem[];
  onSuccess?: () => void;
}

interface FormValues {
  planId: string;
  address: string;
  deliveryDate: Date;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ items, onSuccess }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    defaultValues: {
      planId: "",
      address: "",
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to one week from now
    },
  });

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      const subscriptionPlans = await getSubscriptionPlans();
      setPlans(subscriptionPlans);
      
      // Set default plan if available
      if (subscriptionPlans.length > 0) {
        form.setValue("planId", subscriptionPlans[0].id);
      }
      
      setIsLoading(false);
    };

    fetchPlans();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    if (!currentUser) {
      toast.error("You must be logged in to create a subscription");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    
    const subscriptionItems = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }));

    const success = await createSubscription(
      currentUser.id,
      values.planId,
      values.deliveryDate.toISOString(),
      values.address,
      subscriptionItems
    );

    setIsLoading(false);

    if (success) {
      clearCart();
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/customer-dashboard");
      }
    }
  };

  if (isLoading && plans.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-juicy-green" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Subscription</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription Plan</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subscription plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.price.toFixed(2)} ({plan.frequency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your delivery address" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>First Delivery Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="text-lg font-semibold mb-3">Items in Subscription</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  ${items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-juicy-green hover:bg-juicy-green/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing...
              </>
            ) : (
              "Create Subscription"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SubscriptionForm;
