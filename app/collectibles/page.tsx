"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@clerk/nextjs';
import { FC, useEffect, useState } from "react";

// Sample collectibles list
const collectibles = [
  { id: 1, name: "Bronze Frame", price: 50, image: "/bronze-frame.png" },
  { id: 2, name: "Silver Frame", price: 75, image: "/silver-frame.png" },
  { id: 3, name: "Golden Frame", price: 100, image: "/golden-frame.png" },
  { id: 4, name: "Rainbow Frame", price: 150, image: "/rainbow-frame.png" },
  
];

const CollectiblesPage: FC = () => {
  const { isLoaded, user } = useUser();
  const [isClient, setIsClient] = useState(false);

  // Render the component only on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isLoaded) return null;

  // if not a user
  if (!user) {
    return (
      <div className="bg-gray-100 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full lg:flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-4 pt-16">
            <h1 className="font-bold text-3xl text-[#2E2A47]">Welcome Back!</h1>
            <p className="text-base text-[#7E8CA0]">Log in or Create Account to access the Collectibles Shop!</p>
          </div>
        </div>
      </div>
    );
  }

  // User profile with points info
  const userProfile = {
    name: user.firstName || "Anonymous",
    points: 150, // Example points
  };

  const handleRedeem = (collectible: { name: string, price: number }) => {
    if (userProfile.points >= collectible.price) {
      alert(`You have redeemed the ${collectible.name}`);
    } else {
      alert("You don't have enough points.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-3xl">Collectibles Shop</h1>
      </header>

      <main className="p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userProfile.name}</p>
                  <p className="text-sm text-gray-500">{userProfile.points} Points</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collectibles Shop */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Available Collectibles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collectibles.map((collectible) => (
                <li key={collectible.id} className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow">
                  <img src={collectible.image} alt={collectible.name} className="w-24 h-24 mb-4" />
                  <span className="font-medium">{collectible.name}</span>
                  <span className="text-gray-500">{collectible.price} Points</span>
                  <Button 
                    className="mt-4 bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleRedeem(collectible)}>
                    Redeem
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CollectiblesPage;