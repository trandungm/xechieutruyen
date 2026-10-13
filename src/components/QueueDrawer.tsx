import React from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    isQueueOpen,
    setIsQueueOpen,
    isQueuePaused,
    pauseQueue,
    resumeQueue,
    cancelTask,
    retryTask,
    clearCompletedTasks,
  } = useStudio();

  if (!isQueueOpen) return null;

  const queuedCount = queue.filter((t) => t.state === 'queued').length;
  const runningCount = queue.filter((t) => t.state === 'running').length;
  const succeededCount = queue.filter((t) => t.state === 'succeeded').length;
  const failedCount = queue.filter((t) => t.state === 'failed').length;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-[#E4E7EC] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#FAFAFA]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#18202B]">
              Hàng Chờ Tạo Ảnh Máy Chủ
            </h3>
            <p className="text-[11px] text-[#667085]">
              {runningCount} đang vẽ · {queuedCount} chờ · {succeededCount} hoàn tất
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsQueueOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Control Bar: Pause / Resume / Clear */}
      <div className="p-3 border-b border-[#E4E7EC] bg-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isQueuePaused ? (
            <button
              onClick={resumeQueue}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Tiếp tục hàng chờ</span>
            </button>
          ) : (
            <button
              onClick={pauseQueue}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Tạm dừng</span>
            </button>
          )}

          {isQueuePaused && (
            <span className="text-[11px] text-amber-700 font-medium">Đang tạm dừng</span>
          )}
        </div>

        <button
          onClick={clearCompletedTasks}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa đã xong</span>
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {queue.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <Layers className="w-10 h-10 text-slate-300 stroke-1 mb-2" />
            <p className="text-xs font-semibold text-slate-600">Hàng chờ đang trống</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Bấm "Tạo ảnh" tại các thẻ phân cảnh để đưa các tác vụ vẽ ảnh vào hàng chờ máy chủ.
            </p>
          </div>
        ) : (
          queue.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border text-xs transition-all space-y-2 ${
                task.state === 'running'
                  ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/20'
                  : task.state === 'succeeded'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : task.state === 'failed'
                  ? 'border-rose-200 bg-rose-50/30'
                  : 'border-[#E4E7EC] bg-white'
              }`}
            >
              {/* Task Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{task.sceneTitle}</span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    {task.type}
                  </span>
                </div>

                {/* State Tag */}
                <div>
                  {task.state === 'running' && (
                    <span className="flex items-center gap-1 font-semibold text-indigo-700 text-[11px]">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                      <span>Đang vẽ...</span>
                    </span>
                  )}
                  {task.state === 'queued' && (
                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Đang chờ</span>
                    </span>
                  )}
                  {task.state === 'succeeded' && (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Thành công</span>
                    </span>
                  )}
                  {task.state === 'failed' && (
                    <span className="flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Thất bại</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Task Excerpt */}
              <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                "{task.sceneExcerpt || task.prompt}"
              </p>

              {/* Error message if failed */}
              {task.error && (
                <div className="p-2 bg-rose-50 rounded-lg text-[10px] text-rose-700 font-mono">
                  {task.error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[10px] text-slate-400">
                  {new Date(task.createdAt).toLocaleTimeString()}
                </span>

                <div className="flex items-center gap-2">
                  {task.state === 'failed' && (
                    <button
                      onClick={() => retryTask(task.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Thử lại</span>
                    </button>
                  )}
                  {(task.state === 'queued' || task.state === 'running') && (
                    <button
                      onClick={() => cancelTask(task.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      Hủy tác vụ
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-[#E4E7EC] bg-[#FAFAFA] text-[11px] text-slate-500 text-center">
        Tác vụ chạy độc lập trên máy chủ. Đóng trình duyệt không làm mất hàng chờ.
      </div>
    </div>
  );
};
