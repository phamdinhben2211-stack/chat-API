import React, { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { PlantCard } from "./components/PlantCard";
import { Button } from "./components/Button";
import { analyzePlantImage } from "./services/geminiService";
import { PlantAnalysisResponse, LanguageCode, LANGUAGES, Plant } from "./types";

const APP_TEXT: Record<LanguageCode, {
  title_suffix: string;
  hero_title: string;
  hero_highlight: string;
  hero_desc: string;
  analyze_btn: string;
  processing: string;
  processing_note: string;
  safety_title: string;
  reset_btn: string;
  error_msg: string;
  remove_img: string;
}> = {
  vi: {
    title_suffix: "Botanist AI",
    hero_title: "Nhận diện Cây & ",
    hero_highlight: "Bệnh lý",
    hero_desc:
      "Tải lên một hoặc nhiều ảnh cây trồng để nhận diện loài, kiểm tra sức khỏe và nhận hướng dẫn chăm sóc ngay lập tức từ AI.",
    analyze_btn: "Phân tích tất cả",
    processing: "Đang phân tích...",
    processing_note:
      "Quá trình này có thể mất vài giây. AI đang quét tất cả các ảnh của bạn.",
    safety_title: "Cảnh báo an toàn",
    reset_btn: "Phân tích ảnh khác",
    error_msg:
      "Không thể phân tích. Vui lòng kiểm tra kết nối mạng hoặc thử lại.",
    remove_img: "Xóa ảnh",
  },
  en: {
    title_suffix: "Botanist AI",
    hero_title: "Identify Plants & ",
    hero_highlight: "Diseases",
    hero_desc:
      "Upload one or multiple photos of plants to get instant identification, health checks, and care tips powered by advanced AI.",
    analyze_btn: "Analyze All",
    processing: "Processing...",
    processing_note:
      "Processing may take a few seconds. The AI is scanning all your photos.",
    safety_title: "Safety Warnings",
    reset_btn: "Analyze Other Photos",
    error_msg:
      "Failed to analyze. Please check your internet connection or try again.",
    remove_img: "Remove",
  },
  fr: {
    title_suffix: "Botanist AI",
    hero_title: "Identifier les plantes & ",
    hero_highlight: "Maladies",
    hero_desc:
      "Téléchargez une ou plusieurs photos de plantes pour obtenir une identification instantanée et des conseils d'entretien.",
    analyze_btn: "Tout analyser",
    processing: "Traitement...",
    processing_note:
      "Le traitement peut prendre quelques secondes. L'IA scanne toutes vos photos.",
    safety_title: "Avertissements de sécurité",
    reset_btn: "Analyser d'autres photos",
    error_msg:
      "Échec de l'analyse. Veuillez vérifier votre connexion Internet.",
    remove_img: "Supprimer",
  },
  ja: {
    title_suffix: "Botanist AI",
    hero_title: "植物識別 & ",
    hero_highlight: "病気診断",
    hero_desc:
      "植物の写真を1枚または複数枚アップロードして、AIによる即時の識別とケアのヒントを取得します。",
    analyze_btn: "すべて分析",
    processing: "処理中...",
    processing_note:
      "処理には数秒かかる場合があります。AIはすべての写真をスキャンしています。",
    safety_title: "安全上の警告",
    reset_btn: "別の写真を分析",
    error_msg:
      "分析に失敗しました。インターネット接続を確認してください。",
    remove_img: "削除",
  },
  zh: {
    title_suffix: "Botanist AI",
    hero_title: "植物识别 & ",
    hero_highlight: "病害诊断",
    hero_desc:
      "上传一张或多张植物照片，即可获得由高级AI提供支持的即时识别和护理建议。",
    analyze_btn: "全部分析",
    processing: "处理中...",
    processing_note:
      "处理可能需要几秒钟。AI正在扫描您的所有照片。",
    safety_title: "安全警告",
    reset_btn: "分析其他照片",
    error_msg:
      "无法分析。请检查您的互联网连接。",
    remove_img: "移除",
  },
};

const App: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] =
    useState<PlantAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>("vi");

  const t = APP_TEXT[language];

  const handleImageSelect = (files: File[]) => {
    // Process multiple files
    const promises = files.map(file => {
       return new Promise<string>((resolve, reject) => {
         const reader = new FileReader();
         reader.onloadend = () => {
           if (reader.result) resolve(reader.result as string);
           else reject("Read error");
         };
         reader.onerror = reject;
         reader.readAsDataURL(file);
       });
    });

    Promise.all(promises).then(base64Images => {
      setSelectedImages(prev => [...prev, ...base64Images]);
      setAnalysisResult(null);
      setError(null);
    }).catch(err => {
      console.error("Error reading files", err);
      setError("Error reading files");
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    if (newImages.length === 0) {
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (selectedImages.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Analyze all images in parallel
      const analysisPromises = selectedImages.map(img => analyzePlantImage(img, language));
      const results = await Promise.all(analysisPromises);

      // Aggregate results
      let allPlants: Plant[] = [];
      let allWarnings: string[] = [];
      let totalCount = 0;

      results.forEach(res => {
        allPlants = [...allPlants, ...res.plants];
        allWarnings = [...allWarnings, ...res.warnings];
        totalCount += res.plant_count;
      });

      // Combine into one response object
      const combinedResult: PlantAnalysisResponse = {
        language: language,
        plant_count: totalCount,
        plants: allPlants,
        warnings: [...new Set(allWarnings)] // Remove duplicates
      };

      setAnalysisResult(combinedResult);
    } catch (err: any) {
      console.error(err);
      setError(t.error_msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as LanguageCode;
    setLanguage(newLang);

    // Automatically re-analyze content if images are already processed
    if (selectedImages.length > 0 && analysisResult) {
      setAnalysisResult(null);
      setLoading(true);
      setError(null);
      
      try {
        // Similar to handleAnalyze but using newLang state var isn't enough inside async immediately
        // so we pass newLang explicitly or rely on updated state in next render? 
        // Better to extract analyze logic or just duplicate small part with newLang arg.
        const analysisPromises = selectedImages.map(img => analyzePlantImage(img, newLang));
        const results = await Promise.all(analysisPromises);

        let allPlants: Plant[] = [];
        let allWarnings: string[] = [];
        let totalCount = 0;

        results.forEach(res => {
          allPlants = [...allPlants, ...res.plants];
          allWarnings = [...allWarnings, ...res.warnings];
          totalCount += res.plant_count;
        });

        setAnalysisResult({
          language: newLang,
          plant_count: totalCount,
          plants: allPlants,
          warnings: [...new Set(allWarnings)]
        });
      } catch (err: any) {
        console.error(err);
        setError(APP_TEXT[newLang]?.error_msg || "Error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedImages([]);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
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
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              {t.title_suffix}
            </h1>
          </div>

          <div className="relative">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="appearance-none bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-full pl-3 pr-8 py-1.5 focus:ring-emerald-500 focus:border-emerald-500 block w-full outline-none cursor-pointer hover:bg-emerald-100 transition-colors"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-emerald-600">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {selectedImages.length === 0 && (
          <div className="text-center mb-10 space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t.hero_title}{" "}
              <span className="text-emerald-600">{t.hero_highlight}</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              {t.hero_desc}
            </p>
          </div>
        )}

        {/* Upload Area - Always visible if < 10 images or similar, or just replace functionality */}
        <div className="mb-8">
           <ImageUploader onImageSelect={handleImageSelect} language={language} />
        </div>

        {selectedImages.length > 0 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Grid of uploaded images */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                       <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                       <button
                         onClick={() => removeImage(idx)}
                         className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                         title={t.remove_img}
                         disabled={loading}
                       >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                    </div>
                 ))}
               </div>
               
               {!analysisResult && (
                <div className="mt-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Button
                      onClick={handleAnalyze}
                      isLoading={loading}
                      loadingText={t.processing}
                      className="w-full sm:w-auto min-w-[200px]"
                    >
                      {t.analyze_btn} ({selectedImages.length})
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">{t.processing_note}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6">
                {analysisResult.warnings &&
                  analysisResult.warnings.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <h3 className="text-orange-800 font-bold flex items-center gap-2 mb-2">
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {t.safety_title}
                      </h3>
                      <ul className="list-disc pl-5 text-orange-700 text-sm space-y-1">
                        {analysisResult.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Show total count */}
                <div className="flex items-center justify-between px-2">
                   <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                     Found {analysisResult.plants.length} Plants
                   </span>
                </div>

                {analysisResult.plants.map((plant, index) => (
                  <PlantCard 
                    key={`${index}-${plant.name}`} // Use combined key to ensure fresh component on new plant
                    plant={plant} 
                    language={language} 
                  />
                ))}

                <div className="flex justify-center pt-6 pb-10">
                  <Button variant="secondary" onClick={handleReset}>
                    {t.reset_btn}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
