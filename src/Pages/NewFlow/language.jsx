import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Languages, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Constants
const DISPLAY_STYLES = {
  NUMBERED: 'numbered',
  BULLETS: 'bullets',
  BUTTONS: 'buttons'
};

const INDIAN_LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'assamese', label: 'Assamese' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'oriya', label: 'Oriya' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' }
];

const TRANSLATIONS = {
  headers: {
    hindi: "भाषा चुनें",
    tamil: "மொழி தேர்வு",
    telugu: "భాష ఎంచుకోండి",
    kannada: "ಭಾಷೆ ಆಯ್ಕೆ",
    malayalam: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    bengali: "ভাষা নির্বাচন",
    gujarati: "ભાષા પસંદ કરો",
    marathi: "भाषा निवडा",
    oriya: "ଭାଷା ବାଛନ୍ତୁ",
    punjabi: "ਭਾਸ਼ਾ ਚੁਣੋ",
    assamese: "ভাষা বাছনি"
  },
  footers: {
    hindi: "नंबर टाइप करें",
    tamil: "எண் தட்டச்சு",
    telugu: "సంఖ్య టైప్",
    kannada: "ನಂಬರ್ ಟೈಪ್",
    malayalam: "നമ്പർ ടൈപ്പ്",
    bengali: "নম্বর টাইপ",
    gujarati: "નંબર ટાઈપ",
    marathi: "क्रमांक टाईप",
    oriya: "ନମ୍ବର ଟାଇପ୍",
    punjabi: "ਨੰਬਰ ਟਾਈਪ",
    assamese: "নম্বৰ টাইপ"
  }
};

const LanguageOption = ({ language, isSelected, onToggle }) => (
    <button
      onClick={() => onToggle(language.value)}
      className={`
        flex items-center justify-between p-3 rounded-lg
        transition-all duration-200 ease-in-out w-full
        ${isSelected
          ? 'bg-orange-50 text-orange-800 border-2 border-orange-200 shadow-sm'
          : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-orange-200'
        }
      `}
    >
      <span className="font-medium">{language.label}</span>
      {isSelected && <Check className="h-4 w-4 text-orange-600" />}
    </button>
  );

  const MessagePreview = ({ message }) => (
    <div className="space-y-2">
      <Label className="text-gray-700">Preview:</Label>
      <div className="p-4 bg-orange-50/30 rounded-lg border border-orange-100">
        <pre className="mt-2 whitespace-pre-wrap max-h-48 overflow-y-auto
          scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent
          text-gray-700 font-sans">
          {message}
        </pre>
      </div>
    </div>
  );

export const LanguageSelector = () => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayStyle, setDisplayStyle] = useState(DISPLAY_STYLES.NUMBERED);
  const [messageTemplate, setMessageTemplate] = useState('');

  const toggleLanguage = (value) => {
    setSelectedLanguages(prev => 
      prev.includes(value) 
        ? prev.filter(lang => lang !== value)
        : [...prev, value]
    );
  };

  const generateTemplate = () => {
    if (messageTemplate) return messageTemplate;

    const localizedHeader = [
      "Please select your preferred language",
      ...selectedLanguages.map(lang => TRANSLATIONS.headers[lang])
    ].join(" / ");

    const languageList = selectedLanguages.map((lang, index) => {
      const label = INDIAN_LANGUAGES.find(l => l.value === lang)?.label;
      switch (displayStyle) {
        case DISPLAY_STYLES.NUMBERED:
          return `${index + 1}. ${label}`;
        case DISPLAY_STYLES.BULLETS:
          return `• ${label}`;
        case DISPLAY_STYLES.BUTTONS:
          return `[${label}]`;
        default:
          return label;
      }
    }).join('\n');

    const localizedFooter = displayStyle === DISPLAY_STYLES.NUMBERED
      ? "\n\n" + [
          "Reply with the number of your chosen language",
          ...selectedLanguages.map(lang => TRANSLATIONS.footers[lang])
        ].join(" / ")
      : "";

    return `${localizedHeader}\n\n${languageList}${localizedFooter}`;
  };

  const handleConvert = async () => {
    if (!messageTemplate && !selectedLanguages.length) {
      toast.error('Please select languages and define a template');
      return;
    }

    setIsLoading(true);
    try {
      const template = generateTemplate();
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          languages: selectedLanguages,
          displayStyle,
          messageTemplate: template,
          selectionHandling: {
            type: displayStyle,
            options: selectedLanguages.map((lang, idx) => ({
              value: displayStyle === DISPLAY_STYLES.NUMBERED ? (idx + 1).toString() : lang,
              language: lang
            }))
          }
        })
      });

      if (!response.ok) throw new Error('Conversion failed');
      toast.success('Template configured successfully!');
    } catch (error) {
      toast.error('Failed to configure template');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const previewMessage = () => {
    if (!selectedLanguages.length) return 'Select languages and customize message...';
    return generateTemplate();
  };

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="languages" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-orange-50/50">
          <TabsTrigger 
            value="languages"
            className="data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm"
          >
            Select Languages
          </TabsTrigger>
          <TabsTrigger 
            value="template"
            className="data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm"
          >
            Edit Template
          </TabsTrigger>
        </TabsList>

        <TabsContent value="languages" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {INDIAN_LANGUAGES.map(lang => (
              <LanguageOption
                key={lang.value}
                language={lang}
                isSelected={selectedLanguages.includes(lang.value)}
                onToggle={toggleLanguage}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="template" className="mt-4 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Display Style</Label>
            <RadioGroup
              defaultValue={DISPLAY_STYLES.NUMBERED}
              onValueChange={setDisplayStyle}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={DISPLAY_STYLES.NUMBERED} 
                  id="numbered"
                  className="text-orange-600 border-orange-400 focus:ring-orange-400" 
                />
                <Label htmlFor="numbered" className="text-gray-700">Numbered List</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={DISPLAY_STYLES.BULLETS} 
                  id="bullets"
                  className="text-orange-600 border-orange-400 focus:ring-orange-400"
                />
                <Label htmlFor="bullets" className="text-gray-700">Whatsapp List (max 10)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={DISPLAY_STYLES.BUTTONS} 
                  id="buttons"
                  className="text-orange-600 border-orange-400 focus:ring-orange-400"
                />
                <Label htmlFor="buttons" className="text-gray-700">Whatsapp Button (max 3)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Custom Message Template (Optional)
            </Label>
            <Textarea
              placeholder="Enter custom message template..."
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="h-32 resize-none border-gray-200 focus:border-orange-300 focus:ring-orange-200"
            />
          </div>

          <MessagePreview message={previewMessage()} />
        </TabsContent>
      </Tabs>

      <Button
        onClick={handleConvert}
        disabled={selectedLanguages.length === 0 || isLoading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-sm
          disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Configuring...
          </>
        ) : (
          'Save Language Configuration'
        )}
      </Button>
    </div>
  );
};

export const LanguageSelectorTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="ml-2 relative h-12 w-12 text-lg border-orange-200 hover:bg-orange-50 
            hover:border-orange-300 text-orange-700"
        >
          <Languages className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-orange-700">Configure Language Selection</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <LanguageSelector />
        </div>
      </SheetContent>
    </Sheet>
  );
};