import React from 'react';
import { Palette, CheckCircle2, Shield, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const StylePresetView: React.FC = () => {
  const { stylePreset } = useStudio();

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F5F6F8]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#281E17] to-[#1C1814] text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#E89659] mb-1.5 block">
              Preset Đồ Họa Cốt Lõi Của Kênh
            </span>
            <h2 className="text-xl font-extrabold tracking-tight mb-2">
              Hoạt Hình Xế Chiều (2D Dân Gian Mộc Mạc)
            </h2>
            <p className="text-xs text-[#D3C3B2] leading-relaxed">
              Chuẩn hóa phong cách hoạt hình 2D đặc trưng của kênh "Xế Chiều Studio": đầu to xấp xỉ nửa chiều cao, nét viền đen dày thô, màu phẳng trầm ấm, tái hiện chân thực không gian truyện văn học Việt Nam.
            </p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-15 hidden md:block">
            <Palette className="w-48 h-48 text-[#E89659]" />
          </div>
        </div>

        {/* Color Palette Swatches */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4E7EC] space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#18202B]">
              Bảng Màu Phẳng Đặc Trưng (Flat Earth-Toned Palette)
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Tất cả các cảnh sinh ra đều tuân thủ các mã màu tự nhiên, không dùng màu neon hoặc ánh sáng điện ảnh gay gắt.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {stylePreset.colorPalette.map((color, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center gap-2"
              >
                <div
                  className="w-12 h-12 rounded-xl shadow-inner border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">{color.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{color.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Rules Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E4E7EC] space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Quy Chuẩn Bắt Buộc Tuân Thủ</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {stylePreset.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E7EC] space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Những Thứ Nghiêm Cấm Trong Phong Cách</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Không sử dụng 3D CGI, texture da thực tế hoặc ánh sáng volumetric hào nhoáng.</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Không vẽ theo kiểu anime Nhật Bản hiện đại, mắt long lanh hay tóc nhiều màu sặc sỡ.</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Không để AI tự ý vẽ thêm chữ, nhãn hiệu hoặc watermark trên khung hình.</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Không đưa nhân vật Host áo thun mũ 37 vào các cảnh dân gian xưa (chỉ làm layer riêng).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
