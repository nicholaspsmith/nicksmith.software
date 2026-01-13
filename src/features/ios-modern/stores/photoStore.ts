import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
}

interface PhotoState {
  photos: Photo[];
}

interface PhotoActions {
  addPhoto: (dataUrl: string) => void;
  deletePhoto: (id: string) => void;
  clearPhotos: () => void;
}

export const usePhotoStore = create<PhotoState & PhotoActions>()(
  persist(
    (set) => ({
      photos: [],

      addPhoto: (dataUrl) => {
        const photo: Photo = {
          id: `photo-${Date.now()}`,
          dataUrl,
          timestamp: Date.now(),
        };
        set((state) => ({ photos: [photo, ...state.photos] }));
      },

      deletePhoto: (id) => {
        set((state) => ({
          photos: state.photos.filter((p) => p.id !== id),
        }));
      },

      clearPhotos: () => {
        set({ photos: [] });
      },
    }),
    {
      name: 'ios-photos',
    }
  )
);
