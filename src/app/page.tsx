import Head from 'next/head';
import GifSearch from './components/GifSearch';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Head>
        <title>GIF Search App</title>
        <meta name="description" content="Search and select GIFs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-white">GIF Search</h1>
        <GifSearch />
      </main>
    </div>
  );
}
