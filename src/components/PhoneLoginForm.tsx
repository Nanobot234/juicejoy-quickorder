
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

// Step 1: User enters phone number
// Step 2: Verification code is sent
// Step 3: User enters verification code

const phoneSchema = z.object({
  phone: z.string()
    .min(8, { message: "Phone number is too short" })
    .refine(val => val.startsWith("+"), { 
      message: "Phone must include country code (e.g., +1...)" 
    })
});

const verificationSchema = z.object({
  code: z.string().length(6, { message: "Code must be 6 digits" })
});

const PhoneLoginForm = () => {
  const { sendVerificationCode, login, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // Form for phone number entry
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: ""
    }
  });

  // Form for verification code entry
  const codeForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: ""
    }
  });

  // Store phone number between steps
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    const success = await sendVerificationCode(values.phone);
    if (success) {
      setPhoneNumber(values.phone);
      setCurrentStep(2);
    }
  };

  const handleVerificationSubmit = async (values: z.infer<typeof verificationSchema>) => {
    await login(phoneNumber, values.code);
  };

  const handleBackToPhone = () => {
    setCurrentStep(1);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {currentStep === 1 ? (
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Login with Phone</h2>
            <p className="text-gray-500 text-center text-sm mb-4">
              Enter your phone number to receive a verification code
            </p>
            
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+1234567890" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-juicy-green hover:bg-juicy-green/90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Get Verification Code"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...codeForm}>
          <form onSubmit={codeForm.handleSubmit(handleVerificationSubmit)} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Enter Verification Code</h2>
            <p className="text-gray-500 text-center text-sm mb-4">
              We've sent a 6-digit code to {phoneNumber}
            </p>
            
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-2 flex flex-col items-center">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="123456"
                      className="text-center tracking-widest text-xl w-48"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-juicy-green hover:bg-juicy-green/90" 
                disabled={isLoading || !codeForm.watch("code") || codeForm.watch("code").length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={handleBackToPhone}
                disabled={isLoading}
              >
                Back
              </Button>
            </div>
          </form>
        </Form>
      )}

      <div className="text-center text-xs text-gray-500 mt-4">
        <p>For demo purposes, use code: 123456</p>
        <p>Try phone numbers +12345678900 or +12345678901</p>
      </div>
    </div>
  );
};

export default PhoneLoginForm;
