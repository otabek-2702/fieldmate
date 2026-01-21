
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Stadium } from '../types';

interface StadiumCardProps {
  stadium: Stadium;
  onClick: (stadium: Stadium) => void;
  isDarkMode?: boolean;
}

const StadiumCard: React.FC<StadiumCardProps> = ({ stadium, onClick, isDarkMode }) => {
  return (
    <div 
      onClick={() => onClick(stadium)}
      className={`rounded-[40px] overflow-hidden shadow-lg border-2 transition-all cursor-pointer mb-6 ${
        isDarkMode 
          ? 'bg-lunar-green border-pale-olive/10 hover:border-pale-olive' 
          : 'bg-white border-pale-olive/20 hover:border-pale-olive'
      }`}
    >
      <div className="relative h-56">
        <img src={stadium.imageUrl} alt={stadium.name} className="w-full h-full object-cover" />
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-2xl border-2 ${isDarkMode ? 'bg-black border-pale-olive text-white' : 'bg-white border-lunar-green text-lunar-green'}`}>
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black">{stadium.rating}</span>
          <span className="text-[10px] font-black uppercase opacity-60">({stadium.reviewsCount})</span>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl border-2 border-white ${stadium.type === 'indoor' ? 'bg-lunar-green text-white' : 'bg-pale-olive text-lunar-green'}`}>
            {stadium.type === 'indoor' ? 'Закрытое' : 'Открытое'}
          </span>
        </div>
      </div>
      
      <div className="p-8">
        <h3 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-lunar-green'}`}>{stadium.name}</h3>
        <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider mb-4 ${isDarkMode ? 'text-pale-olive' : 'text-lunar-green'}`}>
          <MapPin className="w-4 h-4 text-pale-olive" />
          <span className="truncate">{stadium.address}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {stadium.amenities.map((amenity, idx) => (
            <span key={idx} className={`text-[9px] font-black px-4 py-2 rounded-xl border-2 uppercase ${isDarkMode ? 'bg-black/40 text-pale-olive border-pale-olive/10' : 'bg-merino text-lunar-green border-pale-olive/20'}`}>
              {amenity}
            </span>
          ))}
        </div>
        
        <div className={`flex items-center justify-between pt-6 border-t-2 ${isDarkMode ? 'border-pale-olive/10' : 'border-merino'}`}>
          <div className={isDarkMode ? 'text-white' : 'text-lunar-green'}>
            <span className="text-2xl font-black italic tracking-tighter">{stadium.pricePerHour.toLocaleString()}</span>
            <span className="text-[11px] font-black uppercase tracking-widest ml-1"> сум/ч</span>
          </div>
          <button className={`px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-xl transition-all ${isDarkMode ? 'bg-pale-olive text-white' : 'bg-lunar-green text-white hover:bg-pale-olive hover:text-lunar-green'}`}>
            БРОНЬ
          </button>
        </div>
      </div>
    </div>
  );
};

export default StadiumCard;
