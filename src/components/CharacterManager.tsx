import React, { useState } from 'react';
import {
  Users,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Trash2,
  ShieldCheck,
  Edit2,
  Info,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Character, CharacterReference } from '../types';

export const CharacterManager: React.FC = () => {
  const {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addCharacterReference,
  } = useStudio();

  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || '');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCharName, setNewCharName] = useState('');
  const [newCharRole, setNewCharRole] = useState('Nhân vật phụ');
  const [newCharAge, setNewCharAge] = useState('Trung niên');
  const [newCharTraits, setNewCharTraits] = useState('Đầu to nửa thân, nét mực đen thô, áo nâu mộc');
  const [newCharColor, setNewCharColor] = useState('Nâu sồng');

  const activeChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  const handleCreateChar = () => {
    if (!newCharName.trim()) return;
    addCharacter({
      name: newCharName.trim(),
      role: newCharRole,
      ageEra: newCharAge,
      fixedTraits: newCharTraits,
      clothingColor: newCharColor,
    });
    setNewCharName('');
    setIsAddingNew(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#F5F6F8]">
      {/* Left List of Characters */}
      <div className="w-full md:w-80 bg-white border-r border-[#E4E7EC] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C97645]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#18202B]">
              Danh Sách Nhân Vật ({characters.length})
            </h3>
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="p-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm</span>
          </button>
        </div>

        {/* Add Character Form modal/card */}
        {isAddingNew && (
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2.5 text-xs animate-in fade-in">
            <h4 className="font-bold text-slate-800">Tạo nhân vật mới</h4>
            <input
              type="text"
              placeholder="Tên nhân vật (vd: Ông giáo, Lão Hạc)"
              value={newCharName}
              onChange={(e) => setNewCharName(e.target.value)}
              className="w-full p-2 bg-white border rounded-md"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Vai trò"
                value={newCharRole}
                onChange={(e) => setNewCharRole(e.target.value)}
                className="p-1.5 bg-white border rounded-md"
              />
              <input
                type="text"
                placeholder="Màu áo"
                value={newCharColor}
                onChange={(e) => setNewCharColor(e.target.value)}
                className="p-1.5 bg-white border rounded-md"
              />
            </div>
            <textarea
              placeholder="Đặc điểm ngoại hình cố định..."
              value={newCharTraits}
              onChange={(e) => setNewCharTraits(e.target.value)}
              rows={2}
              className="w-full p-2 bg-white border rounded-md"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateChar}
                className="flex-1 py-1.5 bg-indigo-600 text-white rounded font-semibold"
              >
                Tạo
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {characters.map((char) => {
            const isSelected = char.id === activeChar?.id;
            const hasRefs = char.references && char.references.length > 0;
            return (
              <div
                key={char.id}
                onClick={() => setSelectedCharId(char.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-[#E4E7EC] bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs text-slate-900">{char.name}</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    {char.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{char.fixedTraits}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Màu áo: {char.clothingColor}</span>
                  <span className={hasRefs ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>
                    {hasRefs ? `${char.references.length} ảnh tham chiếu` : 'Chưa có ảnh'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on YouTube Host */}
        <div className="p-3 bg-[#FAF7F2] border-t border-[#E4E7EC] text-[11px] text-[#6A513E] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#C97645] shrink-0 mt-0.5" />
          <p>
            Nhân vật người dẫn kênh (áo thun, mũ 37) là layer nhận diện riêng, không đưa vào vai người dân trong truyện xưa.
          </p>
        </div>
      </div>

      {/* Right Details & Reference Sheet */}
      {activeChar && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header of character */}
          <div className="bg-white p-5 rounded-2xl border border-[#E4E7EC] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-extrabold text-[#18202B]">{activeChar.name}</h2>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">
                  {activeChar.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">{activeChar.ageEra}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Đã khóa danh tính</span>
              </span>

              {characters.length > 1 && (
                <button
                  onClick={() => deleteCharacter(activeChar.id)}
                  title="Xóa nhân vật"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Fixed Identity Traits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E4E7EC]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Đặc điểm cố định (Không đổi)
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {activeChar.fixedTraits}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E4E7EC]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Trang phục & Màu sắc chuẩn
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {activeChar.clothingColor}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E4E7EC]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Quy tắc đồng bộ nét vẽ 2D
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                Đầu to ~ 1/2 thân, nét viền đen dày mộc mạc, mắt chấm, màu phẳng đất.
              </p>
            </div>
          </div>

          {/* Reference Views (Front, 3/4 Side, Full Body) */}
          <div className="bg-white p-5 rounded-2xl border border-[#E4E7EC] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Bộ Ảnh Tham Chiếu Các Góc Nhìn (Reference Sheet)
                </h3>
                <p className="text-xs text-slate-500">
                  Khóa các góc nhìn chính diện, góc nghiêng và toàn thân để AI luôn giữ đúng khuôn mặt.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['front', 'side', 'full_body'].map((typeKey) => {
                const label =
                  typeKey === 'front'
                    ? 'Góc chính diện'
                    : typeKey === 'side'
                    ? 'Góc nghiêng 3/4'
                    : 'Dáng toàn thân';

                const existingRef = activeChar.references.find((r) => r.type === typeKey);

                return (
                  <div
                    key={typeKey}
                    className="border border-[#E4E7EC] rounded-xl overflow-hidden bg-[#FAF7F2] flex flex-col"
                  >
                    <div className="p-2.5 bg-white border-b border-[#E4E7EC] flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">{label}</span>
                      {existingRef?.isApproved ? (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Đã duyệt</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Chờ duyệt</span>
                      )}
                    </div>

                    <div className="aspect-square flex items-center justify-center p-3 relative">
                      {existingRef ? (
                        <img
                          src={existingRef.imageUrl}
                          alt={label}
                          className="w-full h-full object-contain rounded-lg shadow-2xs"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                          <span className="text-xs text-slate-400">Chưa có ảnh góc này</span>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 bg-white border-t border-[#E4E7EC] text-center">
                      <span className="text-[11px] text-slate-500">
                        {existingRef ? 'Chuẩn identity đã khóa' : 'Sử dụng ảnh mẫu chuẩn'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
