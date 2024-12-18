import Head from 'next/head';
import GifSearch from './components/GifSearch';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black-900">
      <Head>
        <title>GIF Search App</title>
        <meta name="description" content="Search and select GIFs" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>

    
        {/* <h1 className="text-2xl font-bold mb-4 text-center">GIF Search</h1> */}
        <GifSearch />
      
    </div>
  );
}
