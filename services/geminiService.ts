import { GoogleGenAI, Type, Schema, ChatSession } from "@google/genai";
import { PlantAnalysisResponse, Recipe, DecorationGuide } from "../types";

// Define the Schema for strict JSON output
const diseaseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    disease_name: { type: Type.STRING },
    confidence: { type: Type.STRING },
    symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
    root_cause: { type: Type.STRING, description: "Predicted cause of the disease (fungal, bacterial, environmental, etc.)" },
    severity: { type: Type.STRING, enum: ['nhẹ', 'trung bình', 'nặng', 'light', 'medium', 'severe'] },
    treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
    prevention: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['disease_name', 'confidence', 'symptoms', 'severity', 'treatment', 'root_cause', 'prevention']
};

const environmentalInfoSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    min_temp: { type: Type.NUMBER, description: "Minimum ideal temperature in Celsius" },
    max_temp: { type: Type.NUMBER, description: "Maximum ideal temperature in Celsius" },
    min_humidity: { type: Type.NUMBER, description: "Minimum ideal humidity percentage (0-100)" },
    max_humidity: { type: Type.NUMBER, description: "Maximum ideal humidity percentage (0-100)" },
    seasonal_advice: { type: Type.STRING, description: "Specific growth advice based on weather/season" }
  },
  required: ['min_temp', 'max_temp', 'min_humidity', 'max_humidity', 'seasonal_advice']
};

const careProfileSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    water: { type: Type.STRING, description: "Watering frequency and tips" },
    light: { type: Type.STRING, description: "Sunlight requirements" },
    soil: { type: Type.STRING, description: "Soil type preferences" },
    temperature: { type: Type.STRING, description: "Ideal temperature range description" },
    fertilizer: { type: Type.STRING, description: "Fertilizer recommendations" },
    pruning: { type: Type.STRING, description: "Pruning advice" },
    environmental_info: environmentalInfoSchema
  },
  required: ['water', 'light', 'soil', 'temperature', 'fertilizer', 'pruning', 'environmental_info']
};

const lifeCycleSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      stage_name: { type: Type.STRING, description: "Name of the stage (e.g., Seedling, Vegetative, Flowering)" },
      duration: { type: Type.STRING, description: "Typical duration of this stage" },
      description: { type: Type.STRING, description: "Key characteristics of this stage" }
    },
    required: ['stage_name', 'duration', 'description']
  }
};

const marketInfoSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    estimated_price: { type: Type.STRING, description: "Estimated price range for a standard pot size (e.g., '50.000 - 150.000')" },
    currency: { type: Type.STRING, description: "Currency code or symbol (e.g., VND, USD)" },
    buying_tips: { type: Type.STRING, description: "Tips for selecting a healthy plant at the store" },
    suggested_places: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific types of stores, markets, or websites to buy this plant" }
  },
  required: ['estimated_price', 'currency', 'buying_tips', 'suggested_places']
};

const commonUsesSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    medical: { type: Type.ARRAY, items: { type: Type.STRING } },
    cooking: { type: Type.ARRAY, items: { type: Type.STRING } },
    decoration: { type: Type.ARRAY, items: { type: Type.STRING } },
    other: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

const plantInfoSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    description: { type: Type.STRING },
    common_uses: commonUsesSchema,
    care_profile: careProfileSchema,
    life_cycle: lifeCycleSchema,
    market_info: marketInfoSchema
  },
  required: ['description', 'common_uses', 'care_profile', 'life_cycle', 'market_info']
};

const plantSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    confidence: { type: Type.STRING },
    scientific_name: { type: Type.STRING },
    other_possible_species: { type: Type.ARRAY, items: { type: Type.STRING } },
    is_poisonous: { type: Type.BOOLEAN },
    poison_details: { type: Type.STRING },
    detected_diseases: { type: Type.ARRAY, items: diseaseSchema },
    plant_information: plantInfoSchema
  },
  required: ['name', 'confidence', 'scientific_name', 'is_poisonous', 'plant_information']
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    language: { type: Type.STRING },
    plant_count: { type: Type.NUMBER },
    plants: { type: Type.ARRAY, items: plantSchema },
    warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['language', 'plant_count', 'plants', 'warnings']
};

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    prep_time: { type: Type.STRING },
    cook_time: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    servings: { type: Type.STRING },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['title', 'ingredients', 'instructions', 'prep_time', 'cook_time', 'difficulty']
};

const decorationGuideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    tools_materials: { type: Type.ARRAY, items: { type: Type.STRING } },
    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['title', 'description', 'tools_materials', 'steps', 'difficulty']
};

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzePlantImage = async (base64Image: string, language: string): Promise<PlantAnalysisResponse> => {
  const ai = getAiInstance();

  // Clean the base64 string if it contains the header
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const promptText = `
    Bạn là một chuyên gia thực vật học AI.
    Nhiệm vụ: Phân tích hình ảnh, nhận diện TẤT CẢ các loại cây xuất hiện trong ảnh.
    Ngôn ngữ trả về bắt buộc: ${language}.
    
    Hãy tuân thủ cấu trúc JSON đã được định nghĩa trong schema.
    
    Yêu cầu chi tiết:
    1. **Đa đối tượng:** Nếu trong ảnh có nhiều loại cây khác nhau (ví dụ: một bó hoa hỗn hợp, hoặc một khu vườn nhiều loại rau), hãy tách riêng từng loại và trả về thành các đối tượng riêng biệt trong mảng "plants".
    2. **Chăm sóc (Care Profile):** Cung cấp thông tin chi tiết về tưới nước, ánh sáng, đất, nhiệt độ, phân bón và cắt tỉa cho từng loại.
       **Quan trọng:** Cung cấp thông tin môi trường (environmental_info) với các con số cụ thể (min/max nhiệt độ, độ ẩm) để vẽ biểu đồ và lời khuyên theo mùa.
    3. **Bệnh lý (Disease):** Chẩn đoán bệnh trên từng cây nếu có. Dự đoán "nguyên nhân gốc rễ" (root_cause) và "biện pháp phòng ngừa" (prevention).
    4. **Trang trí:** Nếu là hoa/cây cảnh, gợi ý phong cách trang trí.
    5. **Vòng đời (Life Cycle):** Liệt kê các giai đoạn phát triển chính.
    6. **Thị trường (Market):** Ước tính giá cả và nơi mua tại khu vực sử dụng ngôn ngữ này.
    7. **Độc tính:** Cảnh báo kỹ nếu có độc.
    
    Nếu không chắc chắn về loài, hãy ghi 'Uncertain'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: promptText
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as PlantAnalysisResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const generateRecipe = async (dishName: string, plantName: string, language: string): Promise<Recipe> => {
  const ai = getAiInstance();
  const promptText = `
    Bạn là một đầu bếp chuyên nghiệp. Tạo công thức cho món: "${dishName}" từ nguyên liệu "${plantName}".
    Ngôn ngữ: ${language}. Trả về JSON theo schema.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: { responseMimeType: "application/json", responseSchema: recipeSchema, temperature: 0.7 }
    });
    return JSON.parse(response.text || "{}") as Recipe;
  } catch (e) { throw e; }
};

export const generateDecorationGuide = async (styleName: string, plantName: string, language: string): Promise<DecorationGuide> => {
  const ai = getAiInstance();
  const promptText = `
    Bạn là Florist. Tạo hướng dẫn "${styleName}" với "${plantName}".
    Ngôn ngữ: ${language}. Trả về JSON theo schema.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: { responseMimeType: "application/json", responseSchema: decorationGuideSchema, temperature: 0.7 }
    });
    return JSON.parse(response.text || "{}") as DecorationGuide;
  } catch (e) { throw e; }
};

export const generateLifeCycleStageImage = async (plantName: string, stageName: string): Promise<string | null> => {
  const ai = getAiInstance();
  const prompt = `Scientific botanical illustration of ${plantName} at the ${stageName} stage. White background, detailed, realistic, high quality.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      // No schema or mimeType needed for image model in this context, 
      // it returns text/image parts.
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Error generating life cycle image:", e);
    return null;
  }
}

// --- Smart Consultation Service ---

export const createConsultationSession = (plantContext: string, language: string) => {
    const ai = getAiInstance();
    const systemInstruction = `
        Bạn là "Botanist AI", một trợ lý chuyên gia về cây trồng thân thiện và thông thái.
        Ngữ cảnh hiện tại: Người dùng đang hỏi về cây: ${plantContext}.
        Ngôn ngữ trả lời: ${language}.
        
        Nhiệm vụ:
        1. Trả lời các câu hỏi về cách chăm sóc, chữa bệnh, hoặc đặc điểm của cây này.
        2. Nếu người dùng hỏi về bệnh, hãy giải thích nguyên nhân và cách phòng tránh.
        3. Câu trả lời ngắn gọn, súc tích, dễ hiểu, định dạng bằng Markdown.
        4. Luôn giữ thái độ hữu ích và khích lệ.
    `;

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
        }
    });
};

export const sendMessageToExpert = async (
    chatSession: any, 
    message: string
): Promise<string> => {
    try {
        const result = await chatSession.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat error:", error);
        throw error;
    }
};
