"use client";

import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

import { ClerkLoaded, ClerkLoading, useUser } from '@clerk/nextjs';
import { Loader2 } from "lucide-react";
import Image from 'next/image';
import { FC, useEffect, useState } from "react";
import { MapContainer as LeafletMapContainer, TileLayer as LeafletTileLayer, Marker, Popup } from "react-leaflet";

// quest and profile types
interface Quest {
  id: number;
  title: string;
  description: string;
  location: string;
}

const quests: Quest[] = [
  {
    id: 1,
    title: "Take Route 41",
    description: "Complete this task by taking Route 41 at any time today.",
    location: "Main Campus",
  },
  {
    id: 2,
    title: "Take Route 52",
    description: "Instead of taking Route 40, take Route 52 to avoid traffic.",
    location: "Centennial",
  },
];

const BusQuestMainPage: FC = () => {
  const { isLoaded, user } = useUser(); // getting user info from clerk
  const [isClient, setIsClient] = useState(false);

  // map should only be rendered here if client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isLoaded) return null; // if clerk not loaded just ret null

  // if not a user
  if (!user) {
    return (
      <div className="bg-gray-100 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full lg:flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-4 pt-16">
            <h1 className="font-bold text-3xl text-[#2E2A47]">
              Welcome Back!
            </h1>
            <p className="text-base text-[#7E8CA0]">
              Log in or Create Account to view bus routes!
            </p>
          </div>
          <div className="flex items-center justify-center mt-8">
            <ClerkLoaded>
              <SignIn path="/sign-in" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin text-muted-foreground" />
            </ClerkLoading>
          </div>
        </div>
        <div className="h-full bg-gray-500 hidden lg:flex items-center justify-center">
          <Image src="/logo.svg" height={500} width={500} alt="Logo" />
        </div>
      </div>
    );
  }

  // user is authenticated, get their data basically
  const userProfile = {
    name: user.firstName || "Anonymous", // first name from clerk
    email: user.emailAddresses[0]?.emailAddress || "No email", // grab email
    points: 150, // Default points
  };

  return (
    <div className="min-h-screen bg-gray-100">
  <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
    <h1 className="text-3xl">BusQuest</h1>
    <nav>
      <ul className="flex space-x-6">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/collectibles">Collectibles</Link>
        </li>
      </ul>
    </nav>
  </header>

      <main className="p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Bus Map */}
        <section className="col-span-1">
          <h2 className="text-2xl mb-4">Bus Map</h2>
          <LeafletMapContainer
            center={[35.7796, -78.6382]} // grab RALEIGH
            zoom={13}
            style={{ width: "100%", height: "400px" }}
          >
            <LeafletTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* MARKER */}
            <Marker position={[35.7796, -78.6382]}>
              <Popup>Raleigh</Popup>
            </Marker>
          </LeafletMapContainer>
        </section>

        {/* QUESTS */}
        <section className="col-span-1">
          <h2 className="text-2xl mb-4">Quests</h2>
          <ul className="space-y-4">
            {quests.map((quest) => (
              <li key={quest.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-xl">{quest.title}</h3>
                <p>{quest.description}</p>
                <span className="text-sm text-gray-600">Location: {quest.location}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PROFILE */}
        <section className="col-span-1 bg-white p-4 rounded shadow">
          <h2 className="text-2xl mb-4">Profile</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {userProfile.name}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Points:</strong> {userProfile.points}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BusQuestMainPage;
