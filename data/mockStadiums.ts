
import { Stadium } from '../types';

export const STADIUMS: Stadium[] = [
  {
    id: '1',
    name: 'Bunyodkor Training Field',
    address: 'ул. Бунёдкор, Чиланзарский район',
    description: 'Профессиональное поле с искусственным покрытием последнего поколения. Отлично подходит для тренировок и любительских матчей. Есть мощное освещение для ночных игр.',
    pricePerHour: 250000,
    rating: 4.8,
    reviewsCount: 124,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    amenities: ['Душ', 'Парковка', 'Освещение', 'Раздевалки'],
    type: 'outdoor',
    distance: 1.2
  },
  {
    id: '2',
    name: 'Pakhtakor Arena Mini',
    address: 'ул. Ислама Каримова, 13',
    description: 'Уютный крытый манеж в центре города. Идеально для игры в любую погоду. Комфортные раздевалки и зона отдыха для игроков.',
    pricePerHour: 300000,
    rating: 4.9,
    reviewsCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800',
    amenities: ['Душ', 'Кафе', 'VIP ложа', 'Освещение'],
    type: 'indoor',
    distance: 2.5
  },
  {
    id: '3',
    name: 'Green Field Almazar',
    address: 'Алмазарский район, массив Каракамыш',
    description: 'Большое открытое поле в тихом районе. Свежий воздух и отличное состояние газона. Доступные цены для регулярных игр.',
    pricePerHour: 180000,
    rating: 4.5,
    reviewsCount: 56,
    imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=800',
    amenities: ['Парковка', 'Трибуны'],
    type: 'outdoor',
    distance: 4.1
  },
  {
    id: '4',
    name: 'Sport Hub Tashkent',
    address: 'Мирабадский район, ул. Тараса Шевченко',
    description: 'Современный спортивный хаб с высококлассным сервисом. Здесь есть всё для комфортной игры и восстановления после нее.',
    pricePerHour: 350000,
    rating: 4.7,
    reviewsCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800',
    amenities: ['Душ', 'Кондиционер', 'Магазин экипировки'],
    type: 'indoor',
    distance: 0.8
  }
];
