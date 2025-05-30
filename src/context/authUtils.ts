
import { User } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

export const fetchUserProfile = async (
  session: Session,
  setCurrentUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  try {
    console.log("Fetching profile for user:", session.user.id);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user profile:", error);
      return;
    }

    if (!data) {
      console.log("No profile found, creating one for user:", session.user.id);
      const { error: insertError } = await supabase.from('profiles').insert({
        id: session.user.id,
        email: session.user.email,
        role: 'customer'
      });

      if (insertError) {
        console.error("Error creating user profile:", insertError);
        toast.error("Failed to create user profile");
        return;
      }

      const { data: newProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (fetchError) {
        console.error("Error fetching new user profile:", fetchError);
        return;
      }

      const isBusinessOwner = newProfile?.role === 'business_owner';
      console.log("New profile created. Business owner status:", isBusinessOwner, newProfile?.role);

      const user: User = {
        id: session.user.id,
        phone: newProfile?.phone || '',
        name: newProfile?.name || '',
        email: session.user.email || '',
        isBusinessOwner: isBusinessOwner
      };

      setCurrentUser(user);
      setIsLoading(false);
      return;
    }

    const isBusinessOwner = data?.role === 'business_owner';
    console.log("Profile found. Business owner status:", isBusinessOwner, data?.role);

    const user: User = {
      id: session.user.id,
      phone: data?.phone || '',
      name: data?.name || '',
      email: session.user.email || '',
      isBusinessOwner: isBusinessOwner
    };

    setCurrentUser(user);
    setIsLoading(false);
  } catch (error) {
    console.error("Error processing user profile:", error);
    setIsLoading(false);
  }
};

export const signupWithEmail = async (
  email: string,
  password: string,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
      return false;
    }
    if (data.user) {
      toast.success("Account created successfully!");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error signing up:", error);
    toast.error("Failed to create account");
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const signupAsBusinessOwner = async (
  email: string,
  password: string,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
      return false;
    }
    if (data.user) {
      // Check if profile exists first
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // Not found error code
        console.error("Error fetching profile:", fetchError);
        toast.error("Error setting business owner status");
        return false;
      }
      
      // If profile exists, update it
      if (profileData) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'business_owner' })
          .eq('id', data.user.id);
        
        if (updateError) {
          console.error("Error updating profile as business owner:", updateError);
          toast.error("Account created, but failed to set business owner status");
          return false;
        }
      } else {
        // If profile doesn't exist yet, insert it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            role: 'business_owner'
          });
        
        if (insertError) {
          console.error("Error creating business owner profile:", insertError);
          toast.error("Account created, but failed to set business owner status");
          return false;
        }
      }
      
      toast.success("Business account created successfully!");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error signing up as business owner:", error);
    toast.error("Failed to create business account");
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const loginWithEmail = async (
  email: string,
  password: string,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      toast.error(error.message);
      return false;
    }
    if (data.user) {
      toast.success("Login successful");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error logging in:", error);
    toast.error("Login failed");
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const loginAsBusinessOwner = async (
  username: string,
  password: string,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password
    });

    if (error) {
      toast.error(error.message || "Invalid credentials");
      return false;
    }

    if (data?.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== 'business_owner') {
        await supabase.auth.signOut();
        toast.error("This account does not have business owner privileges");
        return false;
      }

      toast.success("Business owner login successful");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error logging in as business owner:", error);
    toast.error("Login failed");
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const logout = async (
  setCurrentUser: (user: User | null) => void
) => {
  try {
    await supabase.auth.signOut();
    setCurrentUser(null);
    toast.info("Logged out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Failed to log out");
  }
};
