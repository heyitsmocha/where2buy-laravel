import {Head} from '@inertiajs/react';
import Layout from '../Layouts/Layout.js';
import { Map, View, TileLayer } from 'react-openlayers';
import  OSM from 'ol/source/OSM.js';
import { fromLonLat } from 'ol/proj.js';
import 'react-openlayers/dist/index.css';

type HomeProps = {
    coordinates: [number, number];
    zoom: number;
}

export default function Home({ coordinates, zoom }: HomeProps) {
    return (
        <Layout>
            <Head title="Home" />
            <div className="container mx-auto py-8 px-4 bg-white rounded-lg shadow">
                <h1>Welcome</h1>
                <div id="map" className="w-full h-96 mt-4">
                    <Map>
                        <TileLayer source={new OSM()} />
                        <View center={fromLonLat(coordinates)} zoom={zoom} />
                    </Map>
                </div>
            </div>
        </Layout>
    );
}
