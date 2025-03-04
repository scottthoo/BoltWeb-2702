import { FaBolt } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold mb-4 md:mb-0">
            <FaBolt className="text-orange-500" />
            <span>BOLT</span>
          </div>
          
          <p className="text-gray-400">
            Copyright © 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}