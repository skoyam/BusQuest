"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Slider } from "@/components/ui/slider";
import coinIconUrl from '@/public/coin.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from "lucide-react";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FC, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Map = dynamic(() => import('react-leaflet'), { ssr: false });

// For the map
const redPinIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
});


const coinIcon = new L.Icon({
  iconUrl: coinIconUrl,
  iconSize: [20, 20],
});

// quest variable, static quests just for demo purpose
const quests = [
  { id: 1, title: "Take Route 41", description: "Ride Route 41 today to complete this quest.", location: "Main Campus" },
  { id: 2, title: "Take Route 52 instead of Route 40", description: "Avoid traffic by taking Route 52 instead of Route 40.", location: "Centennial" },
  { id: 3, title: "Time Change to go to Hunt Later", description: "Instead of going to Hunt at 3pm, go to Hunt at 5pm.", location: "Centennial" },
];

const BusQuestMainPage: FC = () => {
  const [selectedTime, setSelectedTime] = useState<number>(8); // Default time selection
  const [routeData, setRouteData] = useState<any[]>([]); // Data to store route 40 boardings info
  const [filteredBoardings, setFilteredBoardings] = useState<number>(0);

  useEffect(() => {
    fetch('/route_40_data.json')
      .then((response) => response.json())
      .then((data) => {
        setRouteData(data);
      })
      .catch((error) => {
        console.error("Error loading route data:", error);
      });
  }, []);

  // filter the boardings based on selected time
  useEffect(() => {
    if (routeData.length > 0) {
      const filteredData = routeData.filter((entry) => {
        const timestamp = new Date(entry.timestamp.replace(" ", "T")); // parse the timestamp
        const hour = timestamp.getHours(); // get hours
        const minute = timestamp.getMinutes(); // get minutes
  
        const selectedHour = Math.floor(selectedTime); // math.floor is needede (annoying bug to fix) because the selectedTime is a float
        const selectedMinute = selectedTime % 1 === 0 ? 0 : 30; // if its a whole number, set minute to 0 -> otherwise, set it to 30
  
        // comp both the hr and the min
        return hour === selectedHour && minute === selectedMinute;
      });
      
      // set the boardings to the new filtered data
      setFilteredBoardings(filteredData.reduce((total, entry) => total + entry.estimated_boardings, 0));
    }
  }, [selectedTime, routeData]);


  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-teal-600 text-white py-4 px-6 flex justify-between items-center shadow">
      <h1 className="text-2xl font-bold">BusQuest</h1>
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-4">
          <Link href="/collectibles" passHref>
            <Button className="bg-teal-600 hover:bg-teal-700">Collectibles</Button>
          </Link>
          <Link href="/rewards" passHref>
            <Button className="bg-teal-600 hover:bg-teal-700">Rewards</Button>
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
                    <p className="font-semibold mt-6">Centennial Campus</p>
                  </div>
                </Popup>
              </Marker>
              <Marker position={[35.77387698741635, -78.68268056617265]} icon={redPinIcon}>
                <Popup>
                  <div className="text-center relative">
                    <p className="font-semibold mt-6">Avent Ferry Rd at Avery Close Apt</p>
                  </div>
                </Popup>
              </Marker>
              <Marker position={[35.77113938056005, -78.68720708132378]} icon={redPinIcon}>
                <Popup>
                  <div className="text-center relative">
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
            <h2 className="text-xl font-bold">⚔︎ Available Quests</h2>
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
            <h2 className="text-xl font-bold">⏰ Select Time</h2>
          </CardHeader>
          <CardContent>
            <Slider
              min={7}
              max={22}
              step={0.5}
              value={[selectedTime]}
              onValueChange={(value) => setSelectedTime(value[0])}
            />
            <p className="text-center mt-2 text-gray-700">
              Selected Time: {Math.floor(selectedTime)}:{selectedTime % 1 === 0 ? "00" : "30"}
            </p>

            {/* Display the filteredBoardings value here */}
            <p className="text-center mt-4 text-xl font-semibold">
              Estimated Boardings: {filteredBoardings}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BusQuestMainPage;
