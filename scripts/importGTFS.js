const fs = require('fs');
const csv = require('csv-parser');
const dbConnect = require('../lib/dbConnect');
const { Stop, StopTime, Shape, Route, Trip } = require('../models/GTFS');

async function importGTFS() {
    await dbConnect();

    const loadCSV = async (filePath, model, transform, postProcess = null) => {
        return new Promise((resolve, reject) => {
            const records = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', row => records.push(transform(row)))
                .on('end', async () => {
                    try {
                        const insertedDocs = await model.insertMany(records, { ordered: false });
                        if (postProcess) await postProcess(insertedDocs);
                        console.log(`✅ Imported ${insertedDocs.length} records from ${filePath}`);
                        resolve();
                    } catch (err) {
                        console.error(`❌ Error inserting ${filePath}:`, err.message);
                        resolve();
                    }
                })
                .on('error', reject);
        });
    };

    // 📍 Load Stops with GeoJSON Support
    await loadCSV('./gtfs_data/stops.txt', Stop, row => ({
        stop_id: row.stop_id,
        stop_name: row.stop_name,
        stop_lat: parseFloat(row.stop_lat),
        stop_lon: parseFloat(row.stop_lon),
        location: {
            type: "Point",
            coordinates: [parseFloat(row.stop_lon), parseFloat(row.stop_lat)]
        }
    }));

    // 🚏 Load Routes
    await loadCSV('./gtfs_data/routes.txt', Route, row => ({
        route_id: row.route_id,
        route_short_name: row.route_short_name,
        route_long_name: row.route_long_name,
        route_type: parseInt(row.route_type)
    }));

    // 🚌 Load Trips & Store `shape_id` for linking later
    await loadCSV('./gtfs_data/trips.txt', Trip, row => ({
        route_id: row.route_id,
        service_id: row.service_id,
        trip_id: row.trip_id,
        trip_headsign: row.trip_headsign,
        shape_id: row.shape_id, // Store shape_id reference
        stop_times: [],
        shapes: []
    }));

    // ⏳ Load Stop Times & Link to Trips
    await loadCSV('./gtfs_data/stop_times.txt', StopTime, row => ({
        trip_id: row.trip_id,
        arrival_time: row.arrival_time,
        departure_time: row.departure_time,
        stop_id: row.stop_id,
        stop_sequence: parseInt(row.stop_sequence)
    }), async (insertedStopTimes) => {
        for (let stopTime of insertedStopTimes) {
            await Trip.updateOne({ trip_id: stopTime.trip_id }, { $push: { stop_times: stopTime._id } });
        }
    });

    // 🗺 Load Shapes & Link to Trips
    await loadCSV('./gtfs_data/shapes.txt', Shape, row => ({
        shape_id: row.shape_id,
        shape_pt_lat: parseFloat(row.shape_pt_lat),
        shape_pt_lon: parseFloat(row.shape_pt_lon),
        shape_pt_sequence: parseInt(row.shape_pt_sequence)
    }), async (insertedShapes) => {
        for (let shape of insertedShapes) {
            await Trip.updateOne({ shape_id: shape.shape_id }, { $push: { shapes: shape._id } });
        }
    });

    console.log('🚀 GTFS Data Import Complete!');
}

importGTFS();
