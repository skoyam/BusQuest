// scripts/importStops.js (example pseudo-code)
import csv from 'csv-parser';
import fs from 'fs';
import dbConnect from '@/lib/dbConnect';
import Stop from '@/models/Stop';

async function importStops() {
    await dbConnect();
    fs.createReadStream('./gtfs/stops.txt')
        .pipe(csv())
        .on('data', async (row) => {
            // row.stop_id, row.stop_name, row.stop_lat, row.stop_lon, ...
            await Stop.create({
                stop_id: row.stop_id,
                stop_name: row.stop_name,
                stop_lat: parseFloat(row.stop_lat),
                stop_lon: parseFloat(row.stop_lon)
            });
        })
        .on('end', () => {
            console.log('Imported stops');
        });
}
importStops();
