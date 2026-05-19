import {Head} from '@inertiajs/react';
import Layout from '../Layouts/Layout';

export default function Home() {
    return (
        <Layout>
            <Head title="Home" />
            <h1>Welcome</h1>
            <p>This is the home page.</p>
        </Layout>
    );
}
