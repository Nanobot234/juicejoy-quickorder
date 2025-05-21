
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BusinessSettingsTab: React.FC = () => {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Juice Box",
    phoneNumber: "(555) 123-4567",
    email: "contact@juicebox.com",
    address: "123 Smoothie St, Fruitville, CA 12345",
  });
  
  const [hoursSettings, setHoursSettings] = useState({
    monday: { open: "09:00", close: "18:00" },
    tuesday: { open: "09:00", close: "18:00" },
    wednesday: { open: "09:00", close: "18:00" },
    thursday: { open: "09:00", close: "18:00" },
    friday: { open: "09:00", close: "18:00" },
    saturday: { open: "10:00", close: "16:00" },
    sunday: { open: "10:00", close: "16:00" },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    marketingEmails: false,
  });

  const handleStoreSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleHoursChange = (day: string, type: "open" | "close", value: string) => {
    setHoursSettings(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [type]: value }
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Business Settings</h2>
      <p className="text-gray-600 mb-6">
        Configure your store settings, hours, and preferences here.
      </p>
      
      <Tabs defaultValue="store" className="space-y-6">
        <TabsList>
          <TabsTrigger value="store">Store Info</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscription Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input 
                  id="storeName" 
                  name="storeName"
                  value={storeSettings.storeName} 
                  onChange={handleStoreSettingChange}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  name="phoneNumber"
                  value={storeSettings.phoneNumber} 
                  onChange={handleStoreSettingChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={storeSettings.email} 
                  onChange={handleStoreSettingChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address"
                  value={storeSettings.address} 
                  onChange={handleStoreSettingChange}
                />
              </div>
              <Button className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your operating hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(hoursSettings).map(([day, hours]) => (
                  <div key={day} className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium capitalize">{day}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Open:</span>
                      <Input 
                        type="time" 
                        value={hours.open} 
                        onChange={(e) => handleHoursChange(day, "open", e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Close:</span>
                      <Input 
                        type="time" 
                        value={hours.close}
                        onChange={(e) => handleHoursChange(day, "close", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-6">Save Hours</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      id="email-notifications"
                      aria-describedby="email-notifications-description"
                      name="email-notifications"
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => setNotificationSettings(prev => ({ 
                        ...prev, 
                        emailNotifications: !prev.emailNotifications 
                      }))}
                      className="h-4 w-4 rounded border-gray-300 text-juicy-green focus:ring-juicy-green"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      id="sms-notifications"
                      aria-describedby="sms-notifications-description"
                      name="sms-notifications"
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={() => setNotificationSettings(prev => ({ 
                        ...prev, 
                        smsNotifications: !prev.smsNotifications 
                      }))}
                      className="h-4 w-4 rounded border-gray-300 text-juicy-green focus:ring-juicy-green"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order Updates</h4>
                    <p className="text-sm text-gray-500">Receive notifications for new orders and updates</p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      id="order-updates"
                      aria-describedby="order-updates-description"
                      name="order-updates"
                      type="checkbox"
                      checked={notificationSettings.orderUpdates}
                      onChange={() => setNotificationSettings(prev => ({ 
                        ...prev, 
                        orderUpdates: !prev.orderUpdates 
                      }))}
                      className="h-4 w-4 rounded border-gray-300 text-juicy-green focus:ring-juicy-green"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      id="marketing-emails"
                      aria-describedby="marketing-emails-description"
                      name="marketing-emails"
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={() => setNotificationSettings(prev => ({ 
                        ...prev, 
                        marketingEmails: !prev.marketingEmails 
                      }))}
                      className="h-4 w-4 rounded border-gray-300 text-juicy-green focus:ring-juicy-green"
                    />
                  </div>
                </div>
              </div>
              <Button className="mt-6">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>
                Manage subscription plans for recurring deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configure subscription plans that customers can sign up for.
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Weekly Refresh</h3>
                      <p className="text-sm text-gray-500">Four juices delivered every week</p>
                    </div>
                    <div className="font-bold">$29.99</div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Disable</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Bi-Weekly Boost</h3>
                      <p className="text-sm text-gray-500">Six juices delivered every two weeks</p>
                    </div>
                    <div className="font-bold">$39.99</div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Disable</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Monthly Box</h3>
                      <p className="text-sm text-gray-500">Eight juices delivered once a month</p>
                    </div>
                    <div className="font-bold">$49.99</div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Disable</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button>Add New Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessSettingsTab;
