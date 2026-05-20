import {Head} from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import { Map, View, TileLayer } from 'react-openlayers';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import 'react-openlayers/dist/index.css';

export default function Home() {
    return (
        <Layout>
            <Head title="Home" />
            <div className="container mx-auto py-8 px-4 bg-white rounded-lg shadow">
                <h1>Welcome</h1>
                <div id="map" className="w-full h-96 mt-4">
                    <Map>
                        <TileLayer source={new OSM()} />
                        <View center={fromLonLat([101.71161131671826, 3.1574007829410458])} zoom={18} />
                    </Map>
                </div>
            </div>
        </Layout>
    );
}
