"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import coinIconUrl from '@/public/coin.png';
import { ClerkLoaded, ClerkLoading, SignIn, useUser } from '@clerk/nextjs';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, MapPin } from "lucide-react";
import Link from 'next/link';
import { FC, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";


interface Quest {
  id: number;
  title: string;
  description: string;
  location: string;
}

// for the map
const redPinIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
});

const coinIcon = new L.Icon({
  iconUrl: coinIconUrl,
  iconSize: [20, 20],
});

const quests: Quest[] = [
  { id: 1, title: "Take Route 41", description: "Ride Route 41 today to complete this quest.", location: "Main Campus" },
  { id: 2, title: "Take Route 52 instead of Route 40", description: "Avoid traffic by taking Route 52 instead of Route 40.", location: "Centennial" },
  { id: 3, title: "Time Change to go to Hunt Later", description: "Instead of going to Hunt at 3pm, go to Hunt at 5pm.", location: "Centennial" },
];

const BusQuestMainPage: FC = () => {
  const { isLoaded, user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient || !isLoaded) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Card className="w-[400px] text-center">
          <CardHeader>
            <h1 className="text-2xl font-bold text-blue-600">Welcome to BusQuest!</h1>
            <p className="text-gray-500">Log in to start earning points for your trips.</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <ClerkLoaded>
              <SignIn path="/sign-in" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin text-muted-foreground" />
            </ClerkLoading>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userProfile = {
    name: user.firstName || "Anonymous",
    email: user.emailAddresses[0]?.emailAddress || "No email",
    points: 150,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-teal-600 text-white py-4 px-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">BusQuest</h1>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
          <Link href="/collectibles" passHref>
          <Button className="bg-teal-600 hover:bg-teal-700">
            Collectibles
          </Button>
        </Link>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* BUS MAP */}
        <Card className="col-span-1">
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="text-red-600" /> Bus Map
            </h2>
          </CardHeader>
          <CardContent>
          <MapContainer center={[35.772220423537995, -78.67360715131764]} zoom={13} style={{ width: "100%", height: "400px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            
            <Marker position={[35.772220423537995, -78.67360715131764]} icon={redPinIcon}>
            <Popup>
            <div className="text-center relative">
              <div className="absolute top-0 right-0 flex items-center space-x-1">
              </div>
              <p className="font-semibold mt-6">Centennial Campus</p>
            </div>
          </Popup>

          </Marker>

          <Marker position={[35.77387698741635, -78.68268056617265]} icon={redPinIcon}>
          <Popup>
            <div className="text-center relative">
              <div className="absolute top-0 right-0 flex items-center space-x-1">
              </div>
              <p className="font-semibold mt-6">Avent Ferry Rd at Avery Close Apt</p>
            </div>
          </Popup>
          </Marker>

          <Marker position={[35.77113938056005, -78.68720708132378]} icon={redPinIcon}>
          <Popup>
            <div className="text-center relative">
              <div className="absolute top-0 right-0 flex items-center space-x-1">
              </div>
              <p className="font-semibold mt-6">Avent Ferry Rd at Brigadoon Dr</p>
            </div>
          </Popup>
          </Marker>

          </MapContainer>
          </CardContent>
        </Card>

        {/* QUESTS */}
        <Card className="col-span-1">
          <CardHeader>
            <h2 className="text-xl font-bold">Available Quests</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {quests.map((quest) => (
                <li key={quest.id} className="border p-4 rounded-md relative">
                <div className="absolute top-2 right-2 flex items-center space-x-1">
                  <span className="text-sm font-bold">🪙25</span>
                </div>
                <h3 className="font-semibold text-lg">{quest.title}</h3>
                <p className="text-gray-600">{quest.description}</p>
                <div className="text-sm text-gray-500">📍 {quest.location}</div>
              </li>
              
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* SLIDER FOR TIME */}
        <Card className="col-span-1">
          <CardHeader>
            <h2 className="text-xl font-bold">Select Time</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                value={[selectedTime]}
                onValueChange={(value) => setSelectedTime(value[0])}
                min={0} max={11} step={1} 
                tooltip
                aria-label="Time Slider"
                defaultValue={[8]}
              />
              <p className="text-center text-lg mt-2">Selected Time: {selectedTime}:00</p>
              <p className="text-center text-lg mt-2">Estimated Boardings: {filteredBoardings}</p>
            </div>
          </CardContent>
        </Card>

        {/* PROFILE */}
        <Card className="col-span-1">
          <CardHeader>
            <h2 className="text-xl font-bold">Your Profile</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {userProfile.name}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Points:</strong> {userProfile.points}</p>
            </div>
            <Link href="/rewards" passHref>
          <Button className="mt-4 w-full bg-teal-600 hover:bg-teal-700">
            View Rewards
          </Button>
        </Link>

          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default BusQuestMainPage;
