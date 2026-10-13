import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Home, Sparkles } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { LocationItem } from '../types';

export const LocationManager: React.FC = () => {
  const { locations, addLocation, updateLocation, deleteLocation } = useStudio();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [elements, setElements] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    addLocation({
      name: name.trim(),
      description: description.trim(),
      keyElements: elements.split(',').map((e) => e.trim()).filter(Boolean),
    });
    setName('');
    setDescription('');
    setElements('');
    setIsAdding(false);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F5F6F8]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#18202B]">
              Bối Cảnh & Đạo Cụ Cốt Lõi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Địa điểm và các yếu tố không gian truyền thống để đảm bảo sự liền mạch qua các cảnh.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bối cảnh</span>
          </button>
        </div>

        {/* Add Location Form */}
        {isAdding && (
          <div className="p-4 bg-white rounded-2xl border border-indigo-200 shadow-sm space-y-3 text-xs animate-in fade-in">
            <h3 className="font-bold text-slate-900">Thêm bối cảnh mới</h3>
            <input
              type="text"
              placeholder="Tên địa điểm (Vd: Gian nhà tranh, Chõng tre, Sân gạch...)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-[#F5F6F8] border rounded-lg"
            />
            <textarea
              placeholder="Mô tả không gian và cảm xúc (vách đất dột nát, ngọn đèn dầu le lói...)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full p-2 bg-[#F5F6F8] border rounded-lg resize-none"
            />
            <input
              type="text"
              placeholder="Chi tiết cốt lõi (phân tách dấu phẩy: chõng tre, bát sành, đèn dầu)"
              value={elements}
              onChange={(e) => setElements(e.target.value)}
              className="w-full p-2 bg-[#F5F6F8] border rounded-lg"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="px-4 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg"
              >
                Lưu bối cảnh
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white p-5 rounded-2xl border border-[#E4E7EC] shadow-2xs flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] text-[#C97645] flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-[#18202B]">{loc.name}</h3>
                  </div>

                  <button
                    onClick={() => deleteLocation(loc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {loc.description}
                </p>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Các chi tiết bắt buộc giữ:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {loc.keyElements.map((elem, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg"
                      >
                        {elem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-[#667085]">
                Được kế thừa tự động vào prompt của các cảnh diễn ra tại đây.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
