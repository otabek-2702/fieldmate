
import React, { useState, useMemo } from 'react';
import { X, Clock, Users, Check, CreditCard, Banknote, Sparkles, Info, ArrowRight, Receipt, Printer, Share2, Wallet } from 'lucide-react';
import { Stadium } from '../types';

interface BookingModalProps {
  stadium: Stadium;
  onClose: () => void;
  onConfirm: (bookingData: any) => void;
  isDarkMode?: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({ stadium, onClose, onConfirm, isDarkMode }) => {
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [playerCount, setPlayerCount] = useState(15); 
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'hybrid'>('card');
  const [cashAmount, setCashAmount] = useState<string>('');

  const duration = 2; 

  const { subtotal, total, perPerson } = useMemo(() => {
    const s = stadium.pricePerHour * duration;
    const t = s;
    const p = Math.floor(s / playerCount); 
    return { subtotal: s, total: t, perPerson: p };
  }, [stadium.pricePerHour, duration, playerCount]);

  const finalCashAmount = useMemo(() => {
    const val = parseFloat(cashAmount) || 0;
    return Math.min(val, total);
  }, [cashAmount, total]);

  const cardAmount = useMemo(() => {
    if (paymentMethod === 'hybrid') return Math.max(0, total - finalCashAmount);
    if (paymentMethod === 'card') return total;
    return 0;
  }, [paymentMethod, total, finalCashAmount]);

  const timeSlots = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];

  const handleFinish = () => {
    onConfirm({
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      stadiumImageUrl: stadium.imageUrl,
      startTime: selectedTime,
      duration,
      players: playerCount,
      totalPrice: total,
      paymentDetails: {
        method: paymentMethod,
        cashAmount: paymentMethod === 'hybrid' ? finalCashAmount : (paymentMethod === 'cash' ? total : 0),
        cardAmount
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className={`w-full max-w-md rounded-t-[50px] sm:rounded-[50px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[95vh] flex flex-col border-t-8 border-pale-olive ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        
        {step < 3 && (
          <div className="relative h-40 shrink-0">
            <img src={stadium.imageUrl} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <button onClick={onClose} className={`absolute top-6 right-6 p-3 rounded-2xl shadow-xl transition-all active:scale-90 ${isDarkMode ? 'bg-lunar-green text-pale-olive' : 'bg-white text-lunar-green'}`}>
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-8 text-white">
              <h2 className="text-xl font-black italic tracking-tighter uppercase">{stadium.name}</h2>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">{stadium.address}</p>
            </div>
          </div>
        )}

        <div className={`p-8 overflow-y-auto flex-1 ${step === 3 ? 'bg-zinc-200' : ''}`}>
          {step === 1 && (
            <div className="space-y-8">
              <section>
                <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 border-b-2 border-pale-olive inline-block pb-1 ${isDarkMode ? 'text-pale-olive' : 'text-lunar-green'}`}>Выберите время</h3>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(time => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${
                        selectedTime === time 
                          ? 'bg-pale-olive text-white border-pale-olive shadow-md scale-105' 
                          : isDarkMode ? 'bg-lunar-green/40 text-white border-pale-olive/10' : 'bg-white text-lunar-green border-merino'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-[10px] font-black uppercase tracking-widest border-b-2 border-pale-olive inline-block pb-1 ${isDarkMode ? 'text-pale-olive' : 'text-lunar-green'}`}>Состав команды</h3>
                  <span className="bg-lunar-green text-pale-olive px-4 py-1 rounded-lg font-black text-xs">{playerCount} чел.</span>
                </div>
                <input 
                  type="range" min="1" max="24"
                  value={playerCount}
                  onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-pale-olive/20 rounded-full appearance-none cursor-pointer accent-pale-olive"
                />
              </section>

              <div className="bg-lunar-green p-6 rounded-[30px] border-4 border-pale-olive flex gap-4 items-center shadow-xl">
                <div className="w-12 h-12 bg-pale-olive rounded-2xl flex items-center justify-center shadow-inner"><Sparkles className="w-6 h-6 text-lunar-green" /></div>
                <div>
                   <p className="text-[9px] text-pale-olive font-black uppercase tracking-widest mb-0.5">С человека точно:</p>
                   <p className="text-xl text-white font-black italic">{perPerson.toLocaleString()} <span className="text-[10px] uppercase not-italic opacity-60">сум</span></p>
                </div>
              </div>

              <button 
                disabled={!selectedTime}
                onClick={() => setStep(2)}
                className="w-full bg-lunar-green text-white py-6 rounded-[24px] font-black text-lg shadow-2xl disabled:opacity-30 flex items-center justify-center gap-4 transition-all active:scale-95 border-b-4 border-black/40"
              >
                ПЕРЕЙТИ К ОПЛАТЕ <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
              <section>
                <h3 className={`text-[10px] font-black uppercase tracking-widest mb-5 border-b-2 border-pale-olive inline-block pb-1 ${isDarkMode ? 'text-pale-olive' : 'text-lunar-green'}`}>Метод оплаты</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'card', label: 'Банковская карта', sub: 'Uzcard, Humo, Visa', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { id: 'cash', label: 'Наличными на поле', sub: 'Оплата администратору', icon: Banknote, color: 'text-green-500', bg: 'bg-green-50' },
                    { id: 'hybrid', label: 'Смешанная оплата', sub: 'Часть налом, часть картой', icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-50' }
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`flex items-center gap-4 p-5 rounded-[28px] border-4 transition-all text-left ${
                        paymentMethod === method.id 
                          ? 'border-pale-olive bg-pale-olive text-white shadow-lg scale-[1.02]' 
                          : isDarkMode ? 'bg-lunar-green/40 border-pale-olive/10 text-white' : 'border-merino bg-white text-lunar-green'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-white/20' : isDarkMode ? 'bg-black/40' : method.bg}`}>
                        <method.icon className={`w-6 h-6 ${paymentMethod === method.id ? 'text-white' : method.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black uppercase tracking-tighter">{method.label}</p>
                        <p className={`text-[9px] font-bold opacity-60 uppercase ${paymentMethod === method.id ? 'text-white' : ''}`}>{method.sub}</p>
                      </div>
                      {paymentMethod === method.id && <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-pale-olive" /></div>}
                    </button>
                  ))}
                </div>
              </section>

              {paymentMethod === 'hybrid' && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                   <div className={`p-6 rounded-[30px] border-4 ${isDarkMode ? 'bg-lunar-green/30 border-pale-olive/20' : 'bg-merino border-pale-olive/20'}`}>
                      <label className={`text-[9px] font-black uppercase tracking-widest mb-3 block ${isDarkMode ? 'text-pale-olive' : 'text-lunar-green'}`}>Введите сумму наличных (сум)</label>
                      <div className="flex items-center gap-3">
                        <Banknote className="w-6 h-6 text-green-500" />
                        <input 
                          type="number" 
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          placeholder="0"
                          className="flex-1 bg-transparent border-b-4 border-pale-olive font-black text-2xl outline-none py-2 text-lunar-green placeholder:opacity-20"
                        />
                      </div>
                      <div className="flex justify-between mt-4">
                        <div className="text-center">
                          <p className="text-[8px] font-black uppercase opacity-40">Наличные</p>
                          <p className="text-sm font-black text-green-600">{finalCashAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-black uppercase opacity-40">По карте</p>
                          <p className="text-sm font-black text-blue-600">{cardAmount.toLocaleString()}</p>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              <div className={`rounded-[30px] p-8 border-4 border-dashed shadow-inner ${isDarkMode ? 'bg-lunar-green/40 border-pale-olive/20' : 'bg-merino border-pale-olive'}`}>
                <div className="flex justify-between items-center font-black">
                  <span className={`uppercase text-[10px] tracking-widest ${isDarkMode ? 'text-pale-olive' : 'text-lunar-green'}`}>Итого к оплате</span>
                  <div className={isDarkMode ? 'text-white' : 'text-lunar-green'}>
                    <span className="text-3xl italic tracking-tighter">{total.toLocaleString()}</span>
                    <span className="text-[10px] uppercase ml-1 opacity-60">сум</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)} 
                  className={`px-8 py-6 rounded-[24px] font-black text-xs uppercase border-2 transition-all active:scale-95 ${isDarkMode ? 'bg-black border-pale-olive text-pale-olive' : 'bg-white border-lunar-green text-lunar-green'}`}
                >
                  Назад
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="flex-1 bg-pale-olive text-white py-6 rounded-[24px] font-black text-lg uppercase shadow-2xl transition-all active:scale-95 border-b-4 border-black/30"
                >
                  ОФОРМИТЬ
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-20 duration-700">
               <div className="text-center space-y-2">
                 <div className="w-16 h-16 bg-pale-olive rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl text-white"><Check className="w-10 h-10 stroke-[3px]" /></div>
                 <h2 className="text-2xl font-black text-lunar-green uppercase tracking-tighter italic">Матч забронирован!</h2>
                 <p className="text-[10px] font-black uppercase text-lunar-green/40 tracking-widest">Ваш чек готов к проверке</p>
               </div>

               {/* PAPER RECEIPT */}
               <div className="relative mx-auto w-full max-w-[320px] filter drop-shadow-2xl animate-in zoom-in-95 duration-1000">
                  {/* Top ZigZag */}
                  <div className="absolute -top-3 left-0 right-0 h-4 bg-white" style={{ clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)' }} />
                  
                  <div className="bg-white p-8 pt-10 pb-12 text-zinc-800 font-mono shadow-inner relative">
                    <div className="text-center mb-6 space-y-1">
                      <p className="text-lg font-black tracking-widest border-b-2 border-dashed border-zinc-200 inline-block px-2">FIELDMAT.E</p>
                      <p className="text-[9px] font-bold">СПОРТИВНЫЙ АГРЕГАТОР</p>
                      <p className="text-[8px] opacity-40">ТАШКЕНТ, УЗБЕКИСТАН</p>
                    </div>

                    <div className="space-y-4 text-[10px]">
                      <div className="flex justify-between border-b border-dashed border-zinc-100 pb-2">
                        <span className="opacity-50 uppercase">СТАДИОН:</span>
                        <span className="font-bold text-right max-w-[140px] uppercase">{stadium.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-zinc-100 pb-2">
                        <span className="opacity-50 uppercase">ДАТА/ВРЕМЯ:</span>
                        <span className="font-bold uppercase text-right">СЕГОДНЯ, {selectedTime}</span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-zinc-100 pb-2">
                        <span className="opacity-50 uppercase">ИГРОКИ:</span>
                        <span className="font-bold uppercase">{playerCount} ЧЕЛ.</span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-zinc-100 pb-2">
                        <span className="opacity-50 uppercase">ПРОДОЛЖИТЕЛЬНОСТЬ:</span>
                        <span className="font-bold uppercase">2 ЧАСА</span>
                      </div>
                    </div>

                    <div className="my-8 py-4 border-y-2 border-dashed border-zinc-300">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="opacity-50 uppercase">ИТОГО К ОПЛАТЕ:</span>
                        <span className="font-black">{total.toLocaleString()} СУМ</span>
                      </div>
                      <div className="space-y-1 text-[9px] italic">
                        {paymentMethod === 'card' && <p className="text-blue-600 font-bold uppercase">ОПЛАЧЕНО КАРТОЙ: {total.toLocaleString()}</p>}
                        {paymentMethod === 'cash' && <p className="text-green-600 font-bold uppercase">НАЛИЧНЫМИ НА ПОЛЕ: {total.toLocaleString()}</p>}
                        {paymentMethod === 'hybrid' && (
                          <>
                            <p className="text-green-600 font-bold uppercase">НАЛИЧНЫЕ: {finalCashAmount.toLocaleString()}</p>
                            <p className="text-blue-600 font-bold uppercase">КАРТА: {cardAmount.toLocaleString()}</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                       <div className="w-24 h-24 bg-zinc-50 border-2 border-zinc-100 p-2 mx-auto flex items-center justify-center opacity-80">
                          {/* MOCK QR */}
                          <div className="grid grid-cols-5 grid-rows-5 gap-1 w-full h-full">
                             {[...Array(25)].map((_, i) => (
                               <div key={i} className={`rounded-[1px] ${Math.random() > 0.5 ? 'bg-zinc-800' : 'bg-transparent'}`} />
                             ))}
                          </div>
                       </div>
                       <div className="space-y-1">
                        <p className="text-[8px] font-bold uppercase">ID БРОНИ: FM-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                        <p className="text-[7px] opacity-40 uppercase tracking-widest">ПРЕДЪЯВИТЕ ЧЕК НА ПОЛЕ</p>
                       </div>
                    </div>
                  </div>

                  {/* Bottom ZigZag */}
                  <div className="absolute -bottom-3 left-0 right-0 h-4 bg-white" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }} />
               </div>

               <div className="flex flex-col gap-3 pt-4">
                 <button 
                  onClick={handleFinish}
                  className="w-full bg-lunar-green text-white py-6 rounded-[28px] font-black text-lg uppercase shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border-b-4 border-black/30"
                 >
                   <Printer className="w-6 h-6" /> СОХРАНИТЬ И ВЫЙТИ
                 </button>
                 <button className="w-full bg-white text-lunar-green py-5 rounded-[28px] font-black text-xs uppercase flex items-center justify-center gap-2 border-2 border-lunar-green/10">
                   <Share2 className="w-4 h-4" /> ПОДЕЛИТЬСЯ С КОМАНДОЙ
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
