import React from "react";
import { Recipe, LanguageCode } from "../types";
import { Button } from "./Button";

interface RecipeOverlayProps {
  recipe: Recipe | null;
  isLoading: boolean;
  onClose: () => void;
  language: LanguageCode;
  dishName?: string;
}

const LABELS: Record<LanguageCode, any> = {
  vi: {
    loading: "Đang soạn công thức...",
    ingredients: "Nguyên liệu",
    instructions: "Cách làm",
    tips: "Mẹo nhỏ",
    prep: "Chuẩn bị",
    cook: "Nấu",
    servings: "Khẩu phần",
    close: "Đóng",
  },
  en: {
    loading: "Creating recipe...",
    ingredients: "Ingredients",
    instructions: "Instructions",
    tips: "Chef's Tips",
    prep: "Prep",
    cook: "Cook",
    servings: "Servings",
    close: "Close",
  },
  fr: {
    loading: "Création de la recette...",
    ingredients: "Ingrédients",
    instructions: "Instructions",
    tips: "Conseils du chef",
    prep: "Prép",
    cook: "Cuisson",
    servings: "Portions",
    close: "Fermer",
  },
  ja: {
    loading: "レシピを作成中...",
    ingredients: "材料",
    instructions: "作り方",
    tips: "ヒント",
    prep: "準備",
    cook: "調理",
    servings: "人数",
    close: "閉じる",
  },
  zh: {
    loading: "正在生成食谱...",
    ingredients: "配料",
    instructions: "步骤",
    tips: "小贴士",
    prep: "准备",
    cook: "烹饪",
    servings: "份量",
    close: "关闭",
  },
};

export const RecipeOverlay: React.FC<RecipeOverlayProps> = ({
  recipe,
  isLoading,
  onClose,
  language,
  dishName
}) => {
  const t = LABELS[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined}
      />
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
        
        {/* Header with Image Background feeling */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 sm:p-10 text-white relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
                <h2 className="text-2xl font-bold animate-pulse">{t.loading}</h2>
                <p className="text-white/80 mt-2">{dishName}</p>
             </div>
          ) : (
            <div>
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                {recipe?.difficulty}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-2">{recipe?.title}</h2>
              <p className="text-orange-50 text-lg max-w-2xl leading-relaxed">{recipe?.description}</p>
              
              <div className="flex flex-wrap gap-4 mt-6 text-sm font-medium">
                <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg">
                  <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t.prep}: {recipe?.prep_time}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg">
                   <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                  <span>{t.cook}: {recipe?.cook_time}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg">
                  <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{t.servings}: {recipe?.servings}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        {!isLoading && recipe && (
          <div className="overflow-y-auto flex-1 p-6 sm:p-8 bg-gray-50">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Ingredients Column */}
              <div className="md:col-span-1">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                     </svg>
                   </span>
                   {t.ingredients}
                </h3>
                <ul className="space-y-3">
                  {recipe.ingredients.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions Column */}
              <div className="md:col-span-2">
                 <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                     </svg>
                   </span>
                   {t.instructions}
                </h3>
                <div className="space-y-6">
                  {recipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-700 leading-relaxed text-base border-b border-gray-100 pb-4">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {recipe.tips && recipe.tips.length > 0 && (
                  <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                     <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.tips}
                     </h4>
                     <ul className="list-disc pl-5 text-sm text-yellow-800 space-y-1">
                        {recipe.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                     </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};