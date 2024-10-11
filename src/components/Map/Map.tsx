import Image from 'next/image';
import mapImage from '@public/images/map.png';

const MyComponent: React.FC = () => {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="absolute left-2/3 top-1/3 z-10 size-[20px] rounded-full bg-blue-500 border-4 border-white shadow-md" />
      <Image src={mapImage} width={480} height={200} alt="Map with marker, Seoul." />
    </div>
  );
};

export default MyComponent;
