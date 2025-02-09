"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { FC } from "react";

interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  imageUrl: string;
}

const rewards: Reward[] = [
  {
    id: 1,
    name: "Sticker Pack",
    description: "Redeem a BusQuest sticker pack for 100 points.",
    points: 100,
    imageUrl: "/rewards/stickers.png",
  },
  {
    id: 2,
    name: "Coffee Discount",
    description: "Get 20% off your next coffee purchase at Hill of Beans",
    points: 200,
    imageUrl: "/rewards/coffee.png",
  },
  {
    id: 3,
    name: "Exclusive Badge",
    description: "Unlock a special BusQuest profile badge.",
    points: 300,
    imageUrl: "/rewards/frames.png",
  },
  {
    id: 4,
    name: "WolfPack Outfitters Coupon",
    description: "Get a 10% discount on WolfPack Outfitters merchandise.",
    points: 500,
    imageUrl: "/rewards/wolfpack.png",
  },
];

const RewardsPage: FC = () => {
  const userPoints = 150; // Hardcoded points, replace with actual user data if needed

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-teal-600 text-white py-4 px-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">BusQuest</h1>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <Link href="/" passHref>
                <Button className="bg-teal-600 hover:bg-teal-700">Go to Home</Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/collectibles" passHref>
                <Button className="bg-teal-600 hover:bg-teal-700">Collectibles</Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      {/* REWARDS CONTENT */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Available Rewards</h2>

          {/* Display user points */}
          <div className="text-center mb-6">
            <span className="text-lg font-semibold">Your Points:</span>
            <span className="text-xl font-bold text-teal-600 ml-2">{userPoints} 🪙</span>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id} className="p-4 shadow-lg relative">
                <CardHeader className="p-0">
                  <img src={reward.imageUrl} alt={reward.name} className="rounded-lg w-full h-40 object-cover" />
                </CardHeader>
                <CardContent className="mt-4">
                  <h3 className="text-lg font-semibold">{reward.name}</h3>
                  <p className="text-gray-600">{reward.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-teal-600 font-bold">{reward.points} 🪙</span>
                    <Button
                      className={`bg-teal-600 text-white hover:bg-teal-700 ${
                        userPoints < reward.points ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={userPoints < reward.points}
                    >
                      {userPoints >= reward.points ? "Redeem" : "Not Enough Points"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RewardsPage;
