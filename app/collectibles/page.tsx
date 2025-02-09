"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link"; // import Link from Next.js
import { FC, useEffect, useState } from "react";

// Sample collectibles list
const collectibles = [
  { id: 1, name: "Bronze Frame", price: 50, image: "/bronze-.png" },
  { id: 2, name: "Silver Frame", price: 75, image: "/silver-frame.png" },
  { id: 3, name: "Golden Frame", price: 100, image: "/golden-frame.png" },
  { id: 4, name: "Rainbow Frame", price: 150, image: "/rainbow-frame.png" },
];

const CollectiblesPage: FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Mock user profile
  const userProfile = {
    name: "Player 1",
    points: 150, // Example points
  };

  const handleRedeem = (collectible: { name: string; price: number }) => {
    if (userProfile.points >= collectible.price) {
      alert(`You have redeemed the ${collectible.name}`);
    } else {
      alert("You don't have enough points.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl">Collectibles Shop</h1>
        <Link href="/" passHref>
          <Button className="bg-teal-600 hover:bg-teal-700">Back to Home</Button>
        </Link>
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
                  <AvatarImage src="/default-avatar.png" />
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
                <li
                  key={collectible.id}
                  className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow"
                >
                  <img
                    src={collectible.image}
                    alt={collectible.name}
                    className="w-24 h-24 mb-4"
                  />
                  <span className="font-medium">{collectible.name}</span>
                  <span className="text-gray-500">{collectible.price} Points</span>
                  <Button
                    className="mt-4 bg-teal-600 hover:bg-teal-700"
                    onClick={() => handleRedeem(collectible)}
                  >
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
