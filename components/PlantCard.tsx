
import React, { useState, useEffect, useRef } from "react";
import { Plant, LanguageCode, Recipe, DecorationGuide } from "../types";
import { generateRecipe, generateDecorationGuide, generateLifeCycleStageImage } from "../services/geminiService";
import { RecipeOverlay } from "./RecipeOverlay";
import { DecorationOverlay } from "./DecorationOverlay";
import { ConsultationOverlay } from "./ConsultationOverlay";
import { Button } from "./Button";

const TRANSLATIONS: Record<LanguageCode, any> = {
  vi: {
    tabs: { info: "Thông tin", uses: "Công dụng", health: "Bệnh lý", care: "Chăm sóc", market: "Mua sắm" },
    labels: {
      desc: "MÔ TẢ",
      also_known: "CÓ THỂ LÀ LOÀI KHÁC",
      warning: "CẢNH BÁO",
      toxic: "CÓ ĐỘC",
      match: "Độ tin cậy",
      med_uses: "Y HỌC",
      cul_uses: "ẨM THỰC",
      dec_uses: "TRANG TRÍ",
      other_uses: "KHÁC",
      back: "Quay lại danh sách",
      click_recipe: "Nhấn để xem công thức",
      click_guide: "Nhấn để xem hướng dẫn",
      ask_expert: "Tư vấn Chuyên gia AI",
      care_water: "Nước",
      care_light: "Ánh sáng",
      care_soil: "Đất",
      care_temp: "Nhiệt độ",
      care_fert: "Phân bón",
      care_prune: "Cắt tỉa",
      root_cause: "Nguyên nhân dự đoán",
      prevention: "Cách phòng ngừa",
      life_cycle: "Vòng đời phát triển",
      gen_image: "Xem ảnh minh họa",
      loading_img: "Đang tạo ảnh...",
      est_price: "Giá tham khảo",
      buying_tips: "Mẹo chọn cây",
      suggested_places: "Nơi bán phổ biến",
      env_analysis: "Biểu đồ môi trường & Lời khuyên",
      ideal_temp: "Nhiệt độ lý tưởng",
      ideal_humid: "Độ ẩm lý tưởng",
      env_advice: "Lời khuyên phát triển",
    },
    empty: {
      healthy: "Cây có vẻ khỏe mạnh.",
      no_disease: "Không phát hiện sâu bệnh.",
      no_culinary: "Không có thông tin về ẩm thực cho cây này.",
    },
  },
  en: {
    tabs: { info: "Information", uses: "Uses", health: "Diseases", care: "Care", market: "Market" },
    labels: {
      desc: "DESCRIPTION",
      also_known: "ALSO COULD BE",
      warning: "WARNING",
      toxic: "TOXIC",
      match: "Match",
      med_uses: "MEDICAL",
      cul_uses: "CULINARY",
      dec_uses: "DECORATION",
      other_uses: "OTHER",
      back: "Back to list",
      click_recipe: "Click for recipe",
      click_guide: "Click for guide",
      ask_expert: "Ask AI Expert",
      care_water: "Water",
      care_light: "Light",
      care_soil: "Soil",
      care_temp: "Temperature",
      care_fert: "Fertilizer",
      care_prune: "Pruning",
      root_cause: "Predicted Cause",
      prevention: "Prevention",
      life_cycle: "Growth Cycle",
      gen_image: "Generate Image",
      loading_img: "Creating...",
      est_price: "Estimated Price",
      buying_tips: "Buying Tips",
      suggested_places: "Where to Buy",
      env_analysis: "Environmental Analysis & Advice",
      ideal_temp: "Ideal Temperature",
      ideal_humid: "Ideal Humidity",
      env_advice: "Growth Advice",
    },
    empty: {
      healthy: "The plant appears healthy.",
      no_disease: "No diseases detected.",
      no_culinary: "No culinary uses information available.",
    },
  },
  fr: {
    tabs: { info: "Info", uses: "Utilisations", health: "Maladies", care: "Soins", market: "Marché" },
    labels: {
      desc: "DESCRIPTION",
      also_known: "PEUT ÊTRE AUSSI",
      warning: "ATTENTION",
      toxic: "TOXIQUE",
      match: "Confiance",
      med_uses: "MÉDICAL",
      cul_uses: "CULINAIRE",
      dec_uses: "DÉCORATION",
      other_uses: "AUTRE",
      back: "Retour",
      click_recipe: "Cliquez pour la recette",
      click_guide: "Cliquez pour le guide",
      ask_expert: "Demander à l'expert IA",
      care_water: "Eau",
      care_light: "Lumière",
      care_soil: "Sol",
      care_temp: "Température",
      care_fert: "Engrais",
      care_prune: "Taille",
      root_cause: "Cause prédite",
      prevention: "Prévention",
      life_cycle: "Cycle de vie",
      gen_image: "Voir l'image",
      loading_img: "Création...",
      est_price: "Prix estimé",
      buying_tips: "Conseils d'achat",
      suggested_places: "Où acheter",
      env_analysis: "Analyse environnementale",
      ideal_temp: "Température idéale",
      ideal_humid: "Humidité idéale",
      env_advice: "Conseil de croissance",
    },
    empty: {
      healthy: "La plante semble saine.",
      no_disease: "Aucune maladie détectée.",
      no_culinary: "Aucune information culinaire disponible.",
    },
  },
  ja: {
    tabs: { info: "情報", uses: "用途", health: "病気", care: "ケア", market: "市場" },
    labels: {
      desc: "説明",
      also_known: "他の可能性",
      warning: "警告",
      toxic: "有毒",
      match: "信頼度",
      med_uses: "医療用",
      cul_uses: "料理用",
      dec_uses: "装飾",
      other_uses: "その他",
      back: "戻る",
      click_recipe: "レシピを見る",
      click_guide: "ガイドを見る",
      ask_expert: "AI専門家に聞く",
      care_water: "水やり",
      care_light: "光",
      care_soil: "土壌",
      care_temp: "温度",
      care_fert: "肥料",
      care_prune: "剪定",
      root_cause: "予測される原因",
      prevention: "予防",
      life_cycle: "成長サイクル",
      gen_image: "画像を生成",
      loading_img: "作成中...",
      est_price: "推定価格",
      buying_tips: "購入のヒント",
      suggested_places: "購入場所",
      env_analysis: "環境分析とアドバイス",
      ideal_temp: "理想的な温度",
      ideal_humid: "理想的な湿度",
      env_advice: "成長のアドバイス",
    },
    empty: {
      healthy: "植物は健康そうです。",
      no_disease: "病気は検出されませんでした。",
      no_culinary: "料理の用途に関する情報はありません。",
    },
  },
  zh: {
    tabs: { info: "信息", uses: "用途", health: "疾病", care: "护理", market: "市场" },
    labels: {
      desc: "描述",
      also_known: "可能是",
      warning: "警告",
      toxic: "有毒",
      match: "置信度",
      med_uses: "医疗",
      cul_uses: "烹饪",
      dec_uses: "装饰",
      other_uses: "其他",
      back: "返回",
      click_recipe: "点击查看食谱",
      click_guide: "点击查看指南",
      ask_expert: "咨询AI专家",
      care_water: "浇水",
      care_light: "光照",
      care_soil: "土壤",
      care_temp: "温度",
      care_fert: "肥料",
      care_prune: "修剪",
      root_cause: "预测原因",
      prevention: "预防",
      life_cycle: "生长周期",
      gen_image: "生成图像",
      loading_img: "正在生成...",
      est_price: "预估价格",
      buying_tips: "购买建议",
      suggested_places: "购买地点",
      env_analysis: "环境分析与建议",
      ideal_temp: "理想温度",
      ideal_humid: "理想湿度",
      env_advice: "生长建议",
    },
    empty: {
      healthy: "植物看起来很健康。",
      no_disease: "未检测到疾病。",
      no_culinary: "没有可用的烹饪用途信息。",
    },
  },
};

const RangeChart: React.FC<{
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  unit: string;
  label: string;
  color: string;
  scaleMax: number;
}> = ({ min, max, currentMin, currentMax, unit, label, color, scaleMax }) => {
  // Calculate percentages for the bar
  const leftPos = (currentMin / scaleMax) * 100;
  const width = ((currentMax - currentMin) / scaleMax) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
        <span>{label}</span>
        <span>{currentMin} - {currentMax}{unit}</span>
      </div>
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        {/* Background scale markers could go here */}
        <div 
          className={`absolute top-0 h-full ${color} opacity-80 rounded-full transition-all duration-1000`}
          style={{ left: `${Math.max(0, leftPos)}%`, width: `${Math.min(100, width)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>0{unit}</span>
        <span>{scaleMax}{unit}</span>
      </div>
    </div>
  );
};

interface PlantCardProps {
  plant: Plant;
  language: LanguageCode;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, language }) => {
  const [activeTab, setActiveTab] = useState<"info" | "care" | "uses" | "health" | "market">(
    "info"
  );
  
  // Recipe Modal State
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

  // Decoration Modal State
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [decorationData, setDecorationData] = useState<DecorationGuide | null>(null);
  const [isLoadingDecoration, setIsLoadingDecoration] = useState(false);

  // Consultation Modal State
  const [showConsultation, setShowConsultation] = useState(false);

  // Life Cycle Images State
  const [stageImages, setStageImages] = useState<Record<number, string>>({});
  const [loadingStageImages, setLoadingStageImages] = useState<Record<number, boolean>>({});

  const isMounted = useRef(true);

  const t = TRANSLATIONS[language];

  // Auto-generate life cycle images sequentially to avoid Rate Limits (429)
  useEffect(() => {
    isMounted.current = true;
    
    const generateAllImagesSequentially = async () => {
      if (!plant.plant_information.life_cycle) return;

      for (let i = 0; i < plant.plant_information.life_cycle.length; i++) {
        // Stop if component unmounted
        if (!isMounted.current) return;

        // Skip if already has image
        if (stageImages[i]) continue;

        const stageName = plant.plant_information.life_cycle[i].stage_name;
        
        // Generate image
        const success = await handleGenerateStageImage(i, stageName);
        
        // Delay between requests to be nice to API limits (2 seconds)
        if (success && isMounted.current && i < plant.plant_information.life_cycle.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    };

    generateAllImagesSequentially();

    return () => {
      isMounted.current = false;
    };
  }, [plant.name]);

  const handleDishClick = async (dishName: string) => {
    setSelectedDish(dishName);
    setIsLoadingRecipe(true);
    try {
      const data = await generateRecipe(dishName, plant.name, language);
      setRecipeData(data);
    } catch (error) {
      console.error("Failed to fetch recipe", error);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const handleDecorationClick = async (styleName: string) => {
    setSelectedStyle(styleName);
    setIsLoadingDecoration(true);
    try {
      const data = await generateDecorationGuide(styleName, plant.name, language);
      setDecorationData(data);
    } catch (error) {
      console.error("Failed to fetch decoration guide", error);
    } finally {
      setIsLoadingDecoration(false);
    }
  };

  const handleGenerateStageImage = async (index: number, stageName: string): Promise<boolean> => {
    if (stageImages[index] || loadingStageImages[index]) return true;

    if (isMounted.current) {
        setLoadingStageImages(prev => ({ ...prev, [index]: true }));
    }
    
    try {
      const base64Img = await generateLifeCycleStageImage(plant.name, stageName);
      if (base64Img) {
        if (isMounted.current) {
            setStageImages(prev => ({ ...prev, [index]: base64Img }));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to generate stage image", error);
      return false;
    } finally {
      if (isMounted.current) {
        setLoadingStageImages(prev => ({ ...prev, [index]: false }));
      }
    }
  };

  const closeOverlay = () => {
    setSelectedDish(null);
    setRecipeData(null);
    setIsLoadingRecipe(false);

    setSelectedStyle(null);
    setDecorationData(null);
    setIsLoadingDecoration(false);
  };

  const InfoRow: React.FC<{
    label: string;
    value: string | React.ReactNode;
  }> = ({ label, value }) => (
    <div className="mb-3">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
        {label}
      </span>
      <div className="text-gray-800 text-sm leading-relaxed">{value}</div>
    </div>
  );

  const CareItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
  }> = ({ icon, label, value, color }) => (
    <div className={`p-4 rounded-xl border ${color} bg-white shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow`}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <h4 className="font-bold text-sm text-gray-700 uppercase mb-1">{label}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{value}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Recipe Overlay */}
      {(selectedDish || isLoadingRecipe) && (
        <RecipeOverlay 
          recipe={recipeData} 
          isLoading={isLoadingRecipe} 
          onClose={closeOverlay} 
          language={language}
          dishName={selectedDish || ""}
        />
      )}

      {/* Decoration Overlay */}
      {(selectedStyle || isLoadingDecoration) && (
        <DecorationOverlay
          guide={decorationData}
          isLoading={isLoadingDecoration}
          onClose={closeOverlay}
          language={language}
          styleName={selectedStyle || ""}
        />
      )}

      {/* Consultation Overlay */}
      {showConsultation && (
        <ConsultationOverlay
          plantName={plant.name}
          plantContext={JSON.stringify({name: plant.name, diseases: plant.detected_diseases})}
          language={language}
          onClose={() => setShowConsultation(false)}
        />
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-50 mb-8 transition-all hover:shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
           {/* Ask Expert Button - Floating on header or embedded */}
           <div className="absolute top-6 right-6 z-10 hidden sm:block">
              <button 
                onClick={() => setShowConsultation(true)}
                className="bg-white text-emerald-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-emerald-50 transition-colors flex items-center gap-2"
              >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                 </svg>
                 {t.labels.ask_expert}
              </button>
           </div>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold tracking-tight pr-12 sm:pr-0">{plant.name}</h2>
              <p className="text-emerald-100 italic font-serif text-lg">
                {plant.scientific_name}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 sm:hidden">
               {/* Mobile layout adjustment */}
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                {plant.confidence} {t.labels.match}
              </span>
            </div>
             <div className="hidden sm:flex flex-col items-end gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                {plant.confidence} {t.labels.match}
              </span>
              {plant.is_poisonous && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-sm flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.labels.toxic}
                </span>
              )}
            </div>
          </div>
          
           {/* Mobile Ask Expert Button */}
           <div className="mt-4 sm:hidden">
              <button 
                onClick={() => setShowConsultation(true)}
                className="w-full bg-white/10 border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                 </svg>
                 {t.labels.ask_expert}
              </button>
           </div>
        </div>

        <div className="flex border-b border-gray-100 overflow-x-auto">
          {(["info", "care", "uses", "health", "market"] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => {
                setActiveTab(tabKey);
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tabKey
                  ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                  : "text-gray-500 hover:text-emerald-500"
              }`}
            >
              {t.tabs[tabKey]}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[300px]">
          {activeTab === "info" && (
            <div className="space-y-4 animate-fadeIn">
              <InfoRow
                label={t.labels.desc}
                value={plant.plant_information.description}
              />
              {plant.other_possible_species.length > 0 && (
                <InfoRow
                  label={t.labels.also_known}
                  value={plant.other_possible_species.join(", ")}
                />
              )}
              {plant.is_poisonous && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                  <h4 className="text-red-700 font-bold text-sm mb-1 uppercase">
                    {t.labels.warning}
                  </h4>
                  <p className="text-red-600 text-sm">{plant.poison_details}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "care" && plant.plant_information.care_profile && (
            <div className="animate-fadeIn">
              
              {/* Environmental Analysis Section - New */}
              {plant.plant_information.care_profile.environmental_info && (
                 <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
                    <h4 className="font-bold text-indigo-900 uppercase mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {t.labels.env_analysis}
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <RangeChart 
                             label={t.labels.ideal_temp}
                             min={0} max={50} 
                             currentMin={plant.plant_information.care_profile.environmental_info.min_temp}
                             currentMax={plant.plant_information.care_profile.environmental_info.max_temp}
                             unit="°C"
                             color="bg-red-400"
                             scaleMax={50}
                          />
                          <RangeChart 
                             label={t.labels.ideal_humid}
                             min={0} max={100} 
                             currentMin={plant.plant_information.care_profile.environmental_info.min_humidity}
                             currentMax={plant.plant_information.care_profile.environmental_info.max_humidity}
                             unit="%"
                             color="bg-blue-400"
                             scaleMax={100}
                          />
                       </div>
                       
                       <div className="bg-white p-4 rounded-xl border border-indigo-100">
                          <p className="text-xs font-bold text-indigo-400 uppercase mb-2">{t.labels.env_advice}</p>
                          <p className="text-sm text-gray-700 leading-relaxed italic">
                             "{plant.plant_information.care_profile.environmental_info.seasonal_advice}"
                          </p>
                       </div>
                    </div>
                 </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 mb-8">
                <CareItem 
                  label={t.labels.care_water}
                  value={plant.plant_information.care_profile.water}
                  color="border-blue-100"
                  icon={<svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                />
                <CareItem 
                  label={t.labels.care_light}
                  value={plant.plant_information.care_profile.light}
                  color="border-yellow-100"
                  icon={<svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                />
                <CareItem 
                  label={t.labels.care_soil}
                  value={plant.plant_information.care_profile.soil}
                  color="border-amber-100"
                  icon={<svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
                <CareItem 
                  label={t.labels.care_temp}
                  value={plant.plant_information.care_profile.temperature}
                  color="border-red-100"
                  icon={<svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                />
                <CareItem 
                  label={t.labels.care_fert}
                  value={plant.plant_information.care_profile.fertilizer}
                  color="border-green-100"
                  icon={<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                />
                <CareItem 
                  label={t.labels.care_prune}
                  value={plant.plant_information.care_profile.pruning}
                  color="border-purple-100"
                  icon={<svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" /></svg>}
                />
              </div>

              {/* Life Cycle Section */}
              {plant.plant_information.life_cycle && (
                <div className="mt-8">
                  <h4 className="font-bold text-gray-800 uppercase mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.labels.life_cycle}
                  </h4>
                  <div className="relative border-l-2 border-emerald-100 ml-3 space-y-8 pl-6 py-2">
                    {plant.plant_information.life_cycle.map((stage, i) => (
                      <div key={i} className="relative group">
                         {/* Timeline Dot */}
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm group-hover:scale-125 transition-transform"></div>
                        
                        <div className="bg-emerald-50/50 rounded-xl p-4 hover:bg-emerald-50 transition-colors">
                           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2">
                             <h5 className="font-bold text-emerald-900">{stage.stage_name}</h5>
                             <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md whitespace-nowrap">
                               {stage.duration}
                             </span>
                           </div>
                           <p className="text-sm text-gray-700 leading-relaxed mb-3">{stage.description}</p>
                           
                           {/* Image Generation Area */}
                           <div className="mt-3">
                             {stageImages[i] ? (
                               <div className="relative rounded-lg overflow-hidden h-32 w-full sm:w-48 border border-emerald-100 shadow-sm animate-fadeIn group/img">
                                 <img src={stageImages[i]} alt={stage.stage_name} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors pointer-events-none"></div>
                               </div>
                             ) : (
                               <div className="flex items-center gap-3">
                                  {loadingStageImages[i] ? (
                                     <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                                       <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.962l3-2.647z"></path>
                                       </svg>
                                       {t.labels.loading_img}
                                     </div>
                                  ) : (
                                     <div className="h-32 w-full sm:w-48 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300 text-gray-400 text-xs">
                                        Waiting...
                                     </div>
                                  )}
                               </div>
                             )}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "uses" && (
            <div className="space-y-6 animate-fadeIn">
              {plant.plant_information.common_uses.medical.length > 0 && (
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {t.labels.med_uses}
                  </h4>
                  <ul className="grid gap-2">
                    {plant.plant_information.common_uses.medical.map((use, i) => (
                      <li key={i} className="text-sm text-gray-700 bg-emerald-50/50 p-2 rounded-md border-l-2 border-emerald-200">
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plant.plant_information.common_uses.cooking.length > 0 ? (
                 <div>
                  <h4 className="font-bold text-orange-800 text-sm uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    {t.labels.cul_uses}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">{t.labels.click_recipe}</p>
                  <div className="flex flex-wrap gap-2">
                    {plant.plant_information.common_uses.cooking.map((use, i) => (
                      <button
                        key={i}
                        onClick={() => handleDishClick(use)}
                        className="text-sm text-left text-orange-900 bg-orange-50 hover:bg-orange-100 hover:shadow-md transition-all p-3 rounded-xl border border-orange-100 flex items-center gap-2 group"
                      >
                         <svg className="w-4 h-4 text-orange-400 group-hover:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                         </svg>
                         {use}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">{t.empty.no_culinary}</p>
              )}

              {plant.plant_information.common_uses.decoration && plant.plant_information.common_uses.decoration.length > 0 && (
                 <div>
                  <h4 className="font-bold text-purple-800 text-sm uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    {t.labels.dec_uses}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">{t.labels.click_guide}</p>
                  <div className="flex flex-wrap gap-2">
                    {plant.plant_information.common_uses.decoration.map((use, i) => (
                      <button
                        key={i}
                        onClick={() => handleDecorationClick(use)}
                         className="text-sm text-left text-purple-900 bg-purple-50 hover:bg-purple-100 hover:shadow-md transition-all p-3 rounded-xl border border-purple-100 flex items-center gap-2 group"
                      >
                         <svg className="w-4 h-4 text-purple-400 group-hover:text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                         </svg>
                         {use}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {plant.plant_information.common_uses.other.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-600 text-sm uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    {t.labels.other_uses}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {plant.plant_information.common_uses.other.map((use, i) => (
                      <li key={i} className="text-sm text-gray-600">
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "health" && (
            <div className="animate-fadeIn">
              {plant.detected_diseases.length === 0 ? (
                <div className="text-center py-10 bg-emerald-50 rounded-xl border border-emerald-100">
                  <svg className="w-16 h-16 text-emerald-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-emerald-700 font-medium">{t.empty.no_disease}</p>
                  <p className="text-emerald-600 text-sm mt-1">{t.empty.healthy}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {plant.detected_diseases.map((disease, i) => (
                    <div
                      key={i}
                      className="border border-red-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-start">
                        <div>
                           <h4 className="font-bold text-red-800 text-lg">{disease.disease_name}</h4>
                           <div className="flex gap-2 mt-1">
                              <span className="text-xs bg-white text-red-600 px-2 py-0.5 rounded border border-red-200 uppercase font-semibold tracking-wide">
                                {disease.severity}
                              </span>
                              <span className="text-xs bg-white text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                                {disease.confidence}
                              </span>
                           </div>
                        </div>
                      </div>
                      <div className="p-5 space-y-4">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                             {t.labels.root_cause}
                          </p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                             {disease.root_cause}
                          </p>
                        </div>

                        <div>
                           <p className="text-xs font-bold text-gray-400 uppercase mb-1">Triệu chứng</p>
                           <ul className="list-disc pl-5 space-y-1">
                            {disease.symptoms.map((sym, j) => (
                              <li key={j} className="text-sm text-gray-700">{sym}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                           <p className="text-xs font-bold text-gray-400 uppercase mb-1">Cách xử lý</p>
                           <ul className="space-y-2">
                            {disease.treatment.map((treat, j) => (
                              <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-emerald-500 mt-1">✓</span>
                                {treat}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                             {t.labels.prevention}
                          </p>
                          <ul className="space-y-2">
                            {disease.prevention?.map((prev, j) => (
                              <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">🛡️</span>
                                {prev}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "market" && plant.plant_information.market_info && (
             <div className="animate-fadeIn space-y-6">
                {/* Price Estimate */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
                   <h4 className="font-bold text-white/80 uppercase text-xs mb-1">{t.labels.est_price}</h4>
                   <div className="text-3xl font-bold flex items-baseline gap-1">
                      {plant.plant_information.market_info.estimated_price} 
                      <span className="text-lg font-normal opacity-80">{plant.plant_information.market_info.currency}</span>
                   </div>
                   <p className="text-white/70 text-sm mt-2">
                     * Giá tham khảo, có thể thay đổi tùy khu vực và kích thước cây.
                   </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   {/* Buying Tips */}
                   <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                      <h4 className="font-bold text-yellow-800 uppercase mb-3 flex items-center gap-2">
                         <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         {t.labels.buying_tips}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                         {plant.plant_information.market_info.buying_tips}
                      </p>
                   </div>

                   {/* Places to buy */}
                   <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                      <h4 className="font-bold text-blue-800 uppercase mb-3 flex items-center gap-2">
                         <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                         </svg>
                         {t.labels.suggested_places}
                      </h4>
                      <ul className="space-y-2">
                         {plant.plant_information.market_info.suggested_places.map((place, i) => (
                           <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-white p-2 rounded-lg shadow-sm border border-blue-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                              {place}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </>
  );
};
