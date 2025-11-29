import React from "react";
import { DecorationGuide, LanguageCode } from "../types";

interface DecorationOverlayProps {
  guide: DecorationGuide | null;
  isLoading: boolean;
  onClose: () => void;
  language: LanguageCode;
  styleName?: string;
}

const LABELS: Record<LanguageCode, any> = {
  vi: {
    loading: "Đang tạo hướng dẫn cắm hoa...",
    tools: "Dụng cụ & Vật liệu",
    steps: "Các bước thực hiện",
    tips: "Mẹo bảo quản",
    close: "Đóng",
  },
  en: {
    loading: "Creating floral guide...",
    tools: "Tools & Materials",
    steps: "Steps",
    tips: "Care Tips",
    close: "Close",
  },
  fr: {
    loading: "Création du guide floral...",
    tools: "Outils et Matériaux",
    steps: "Étapes",
    tips: "Conseils d'entretien",
    close: "Fermer",
  },
  ja: {
    loading: "フラワーガイドを作成中...",
    tools: "道具と材料",
    steps: "手順",
    tips: "お手入れのヒント",
    close: "閉じる",
  },
  zh: {
    loading: "正在生成花艺指南...",
    tools: "工具和材料",
    steps: "步骤",
    tips: "护理技巧",
    close: "关闭",
  },
};

export const DecorationOverlay: React.FC<DecorationOverlayProps> = ({
  guide,
  isLoading,
  onClose,
  language,
  styleName,
}) => {
  const t = LABELS[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 sm:p-10 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
              <h2 className="text-2xl font-bold animate-pulse">{t.loading}</h2>
              <p className="text-white/80 mt-2">{styleName}</p>
            </div>
          ) : (
            <div>
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                {guide?.difficulty}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-2">
                {guide?.title}
              </h2>
              <p className="text-purple-50 text-lg max-w-2xl leading-relaxed">
                {guide?.description}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        {!isLoading && guide && (
          <div className="overflow-y-auto flex-1 p-6 sm:p-8 bg-purple-50/30">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Tools Column */}
              <div className="md:col-span-1">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </span>
                  {t.tools}
                </h3>
                <ul className="space-y-3">
                  {guide.tools_materials.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100 shadow-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {guide.tips && guide.tips.length > 0 && (
                  <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                    <h4 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {t.tips}
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-indigo-800 space-y-1">
                      {guide.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Steps Column */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </span>
                  {t.steps}
                </h3>
                <div className="space-y-6">
                  {guide.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-700 leading-relaxed text-base border-b border-gray-200 pb-4">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};