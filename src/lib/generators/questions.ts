import type { Level, PatternItem, PatternType, Puzzle } from "@/types";
import { pick, shuffle } from "@/lib/utils";

interface QuestionEntry {
  question: string;
  answer: string;
  distractors: readonly [string, string, string];
}

const GENERAL_QUESTIONS: readonly QuestionEntry[] = [
  { question: "ما عاصمة اليابان؟", answer: "طوكيو", distractors: ["كيوتو", "أوساكا", "هيروشيما"] },
  { question: "ما الكوكب المعروف بالكوكب الأحمر؟", answer: "المريخ", distractors: ["الزهرة", "عطارد", "زحل"] },
  { question: "ما أكبر كواكب المجموعة الشمسية؟", answer: "المشتري", distractors: ["زحل", "الأرض", "نبتون"] },
  { question: "ما الرمز الكيميائي للماء؟", answer: "H₂O", distractors: ["CO₂", "O₂", "NaCl"] },
  { question: "في أي قارة تقع الصحراء الكبرى؟", answer: "أفريقيا", distractors: ["آسيا", "أستراليا", "أمريكا الجنوبية"] },
  { question: "كم عدد أضلاع الشكل السداسي؟", answer: "ستة", distractors: ["خمسة", "سبعة", "ثمانية"] },
  { question: "ما الغاز الذي تمتصه النباتات من الهواء؟", answer: "ثاني أكسيد الكربون", distractors: ["الأكسجين", "الهيليوم", "الهيدروجين"] },
  { question: "ما الحيوان المعروف بسفينة الصحراء؟", answer: "الجمل", distractors: ["الحصان", "الفيل", "الغزال"] },
  { question: "ما عاصمة مصر؟", answer: "القاهرة", distractors: ["الإسكندرية", "الأقصر", "أسوان"] },
  { question: "ما العضو الذي يضخ الدم في جسم الإنسان؟", answer: "القلب", distractors: ["الرئة", "الكبد", "الكلى"] },
  { question: "كم دقيقة في الساعة؟", answer: "60 دقيقة", distractors: ["30 دقيقة", "90 دقيقة", "100 دقيقة"] },
  { question: "أي محيط هو الأكبر في العالم؟", answer: "المحيط الهادئ", distractors: ["المحيط الأطلسي", "المحيط الهندي", "المحيط المتجمد الشمالي"] },
  { question: "ما عاصمة أستراليا؟", answer: "كانبرا", distractors: ["سيدني", "ملبورن", "بيرث"] },
  { question: "ما أقرب كوكب إلى الشمس؟", answer: "عطارد", distractors: ["الزهرة", "الأرض", "المريخ"] },
  { question: "كم عدد ألوان قوس قزح؟", answer: "سبعة", distractors: ["خمسة", "ستة", "ثمانية"] },
  { question: "ما اللغة الرسمية في البرازيل؟", answer: "البرتغالية", distractors: ["الإسبانية", "الفرنسية", "الإنجليزية"] },
  { question: "ما أكبر عضو في جسم الإنسان؟", answer: "الجلد", distractors: ["الكبد", "الرئة", "القلب"] },
  { question: "ما اسم العملية التي يصنع بها النبات غذاءه؟", answer: "البناء الضوئي", distractors: ["التبخر", "التكاثف", "التنفس الخلوي"] },
  { question: "كم عدد كواكب المجموعة الشمسية؟", answer: "ثمانية", distractors: ["سبعة", "تسعة", "عشرة"] },
  { question: "ما عاصمة المغرب؟", answer: "الرباط", distractors: ["الدار البيضاء", "مراكش", "فاس"] },
  { question: "ما المعدن السائل في درجة حرارة الغرفة؟", answer: "الزئبق", distractors: ["الحديد", "النحاس", "الألمنيوم"] },
  { question: "كم ضلعًا للمثلث؟", answer: "ثلاثة", distractors: ["أربعة", "خمسة", "ستة"] },
  { question: "ما أكبر حيوان يعيش على الأرض؟", answer: "الحوت الأزرق", distractors: ["الفيل الأفريقي", "الزرافة", "وحيد القرن"] },
  { question: "ما عاصمة الأردن؟", answer: "عمّان", distractors: ["إربد", "العقبة", "الزرقاء"] },
  { question: "ما الجزء الذي يمتص الماء من التربة في النبات؟", answer: "الجذور", distractors: ["الأوراق", "الأزهار", "الثمار"] },
  { question: "ما وحدة قياس شدة التيار الكهربائي؟", answer: "الأمبير", distractors: ["الفولت", "الواط", "الأوم"] },
  { question: "في أي قارة تقع دولة الأرجنتين؟", answer: "أمريكا الجنوبية", distractors: ["أفريقيا", "أوروبا", "آسيا"] },
  { question: "ما اسم النجم الأقرب إلى الأرض؟", answer: "الشمس", distractors: ["الشعرى اليمانية", "نجم القطب", "سيريوس ب"] },
  { question: "كم يساوي حاصل ضرب 9 في 7؟", answer: "63", distractors: ["56", "54", "72"] },
  { question: "ما عاصمة إيطاليا؟", answer: "روما", distractors: ["ميلانو", "البندقية", "فلورنسا"] },
  { question: "أي حاسة يرتبط بها الأنف؟", answer: "الشم", distractors: ["السمع", "التذوق", "اللمس"] },
];

const SYRIAN_PROVERBS: readonly QuestionEntry[] = [
  { question: "ما المقصود بالمثل: «الجار قبل الدار»؟", answer: "اختيار الجار مهم قبل اختيار البيت", distractors: ["البيت أهم من الحي", "السفر أفضل من السكن", "الجار مسؤول عن بناء البيت"] },
  { question: "ما معنى المثل: «إيد وحدة ما بتصفّق»؟", answer: "بعض الأمور تحتاج إلى تعاون", distractors: ["التصفيق يحتاج إلى مهارة", "العمل الفردي أسرع دائمًا", "الصوت العالي يحقق النجاح"] },
  { question: "متى يُقال: «اللي استحوا ماتوا»؟", answer: "لمن يتصرف بلا حياء أو خجل", distractors: ["لمن يعتذر عن خطئه", "لمن يخاف من المرتفعات", "لمن ينسى موعدًا"] },
  { question: "ما معنى: «القرد بعين أمه غزال»؟", answer: "كل شخص يرى من يحبّه جميلًا", distractors: ["الجمال يتغير مع العمر", "الحيوانات تشبه أصحابها", "الأم تعرف طباع الحيوانات"] },
  { question: "ما المقصود بـ«على قد لحافك مد رجليك»؟", answer: "عِش ضمن إمكاناتك", distractors: ["اشترِ فراشًا أكبر", "نم باكرًا في الشتاء", "لا تسافر في البرد"] },
  { question: "ما معنى المثل: «كل تأخيرة فيها خيرة»؟", answer: "قد يحمل التأخير نتيجة طيبة", distractors: ["التأخير أفضل في كل الأحوال", "الفرص لا تعود أبدًا", "السرعة تمنع النجاح"] },
  { question: "ما المقصود بـ«إيدك عنّي والرزق عليّي»؟", answer: "اترك التدخل وثق بأن الرزق من الله", distractors: ["طلب المساعدة في العمل", "رفض مشاركة الطعام", "الشكوى من غلاء الأسعار"] },
  { question: "ما معنى: «يلي إيده بالمي مو متل يلي إيده بالنار»؟", answer: "من يعيش التجربة لا يشعر كمن يسمع عنها", distractors: ["الماء يطفئ كل أنواع النار", "العمل في الصيف أصعب", "الخبرة لا تفيد في شيء"] },
  { question: "ما الذي ينصح به مثل «اسأل مجرّب ولا تسأل حكيم»؟", answer: "الاستفادة من خبرة من جرّب الأمر", distractors: ["تجنّب طلب النصيحة", "قراءة الكتب مضيعة للوقت", "اتخاذ القرار بسرعة"] },
  { question: "ما معنى «حط راسك بين هالروس وقول يا قطاع الروس»؟", answer: "ساير الجماعة لتتجنب الأذى", distractors: ["تحدّ الآخرين بلا خوف", "اختر قائدًا للمجموعة", "لا تثق بأي جماعة"] },
  { question: "ما المقصود بـ«المكتوب مبين من عنوانه»؟", answer: "قد تظهر ملامح الأمر من بدايته", distractors: ["العنوان أهم من المحتوى دائمًا", "الكتابة تحتاج إلى خط جميل", "لا تحكم على الأمور أبدًا"] },
  { question: "ما معنى «اللي ما بيعرفك بيجهلك»؟", answer: "قد يسيء فهمك من لا يعرف حقيقتك", distractors: ["المعرفة تأتي من السفر", "الجهل أفضل من السؤال", "كل الناس يعرفون بعضهم"] },
];

const QUESTION_BANKS: Readonly<Record<"general-knowledge" | "syrian-proverbs", readonly QuestionEntry[]>> = {
  "general-knowledge": GENERAL_QUESTIONS,
  "syrian-proverbs": SYRIAN_PROVERBS,
};

const textItem = (value: string): PatternItem => ({ kind: "text", value });

export function generateQuestionPuzzle(
  level: Level,
  seenIds: ReadonlySet<string> = new Set(),
  lastType: PatternType | null = null
): Puzzle {
  const questionTypes = Object.keys(QUESTION_BANKS) as (keyof typeof QUESTION_BANKS)[];
  const availableTypes = questionTypes.filter(
    (type) => type !== lastType && QUESTION_BANKS[type].some((_, index) => !seenIds.has(`${type}|${index}`))
  );
  const eligibleTypes = availableTypes.length > 0
    ? availableTypes
    : questionTypes.filter((type) => QUESTION_BANKS[type].some((_, index) => !seenIds.has(`${type}|${index}`)));
  const type = pick(eligibleTypes.length > 0 ? eligibleTypes : questionTypes);
  const bank = QUESTION_BANKS[type];
  const unseen = bank.map((entry, index) => ({ entry, index })).filter(({ index }) => !seenIds.has(`${type}|${index}`));
  const { entry, index } = pick(unseen.length > 0 ? unseen : bank.map((entry, index) => ({ entry, index })));
  const answer = textItem(entry.answer);

  return {
    id: `${type}|${index}`,
    type,
    level,
    question: entry.question,
    sequence: [],
    answer,
    options: shuffle([answer, ...entry.distractors.map(textItem)]),
  };
}