"use client";

import { useUser } from '@clerk/nextjs';
import "leaflet/dist/leaflet.css";
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
    location: "Raleigh",
  },
  {
    id: 2,
    title: "Explore the Downtown",
    description: "Check in at the Downtown bus stop to finish this quest.",
    location: "Downtown",
  },
];

const BusQuestMainPage: FC = () => {
  const { isLoaded, user } = useUser(); // Get user info from Clerk
  const [isClient, setIsClient] = useState(false);

  // Ensures that the map is only rendered on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isLoaded) return null; // Return null until client-side rendering or if Clerk data is not loaded

  const userProfile = {
    name: user.firstName || "Anonymous", // First name from Clerk or fallback
    email: user.emailAddresses[0]?.emailAddress || "No email", // Default email
    points: 150, // default points
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-3xl">BusQuest</h1>
      </header>

      <main className="p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section - Bus Map */}
        <section className="col-span-1">
          <h2 className="text-2xl mb-4">Bus Map</h2>
          <LeafletMapContainer
            center={[35.7796, -78.6382]} // Coordinates for Raleigh, NC
            zoom={13}
            style={{ width: "100%", height: "400px" }}
          >
            <LeafletTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Example marker */}
            <Marker position={[35.7796, -78.6382]}>
              <Popup>Raleigh</Popup>
            </Marker>
          </LeafletMapContainer>
        </section>

        {/* Center Section - Quests */}
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

        {/* Right Section - User Profile */}
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
