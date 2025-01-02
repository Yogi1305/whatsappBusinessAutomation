import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Languages, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { Copy, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import axiosInstance from '../../api';
import { djangoURL } from '../../api';
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
      className={`flex items-center justify-between p-2 rounded-lg
        transition-all duration-200 ease-in-out w-full
        ${isSelected
          ? 'bg-orange-50 text-orange-800 border-2 border-orange-200 shadow-sm'
          : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-orange-200'
        }`}
    >
      <span className="font-medium text-sm">{language.label}</span>
      {isSelected && <Check className="h-3 w-3 text-orange-600" />}
    </button>
  );
  
  const MessagePreview = ({ message }) => {
    const [showCopy, setShowCopy] = useState(false);
    const [copied, setCopied] = useState(false);
  
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    };
  
    return (
      <div className="space-y-1">
        <Label className="text-xs text-gray-700">Preview:</Label>
        <div 
          className="relative"
          onMouseEnter={() => setShowCopy(true)}
          onMouseLeave={() => setShowCopy(false)}
        >
          <div className="p-2 bg-orange-50/30 rounded-lg border border-orange-100">
            <pre className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto
              scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent
              text-gray-700 font-sans">
              {message}
            </pre>
          </div>
          
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 p-1.5 rounded-md transition-all duration-200
              ${showCopy ? 'opacity-100' : 'opacity-0'} 
              ${copied ? 'bg-green-100 text-green-600' : 'bg-orange-100 hover:bg-orange-200 text-orange-600'}`}
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  };
  

export const LanguageSelector = () => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayStyle, setDisplayStyle] = useState(DISPLAY_STYLES.NUMBERED);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [customKeys, setCustomKeys] = useState({});
  const [useCustomKeys, setUseCustomKeys] = useState(false);

  const toggleLanguage = (value) => {
    setSelectedLanguages(prev => 
      prev.includes(value) 
        ? prev.filter(lang => lang !== value)
        : [...prev, value]
    );
  };

  const generateKey = (index) => {
    if (displayStyle === DISPLAY_STYLES.NUMBERED && useCustomKeys) {
      return customKeys[index] || (index + 1).toString();
    }
    return (index + 1).toString();
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
          const key = generateKey(index);
          return `${key}. ${label}`;
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
      
      // Create the languages object with appropriate keys
      const languagesObj = selectedLanguages.reduce((acc, lang, index) => {
        let key;
        if (displayStyle === DISPLAY_STYLES.NUMBERED) {
          key = useCustomKeys ? (customKeys[index] || (index + 1).toString()) : (index + 1).toString();
        } else {
          key = (index + 1).toString(); // Default to numeric keys for other display styles
        }
        acc[key] = INDIAN_LANGUAGES.find(l => l.value === lang)?.label || lang;
        return acc;
      }, {});

      const payload = {
        languages: languagesObj,
        message: template
      };

      const response = await axiosInstance.post(`${djangoURL}/translate-flow/`, payload);

      if (!response.data) throw new Error('Conversion failed');
      toast.success('Template configured successfully!');
    } catch (error) {
      toast.error('Failed to configure template');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom Key Input Component
  const CustomKeyInputs = () => (
    <div className="space-y-2 mt-2">
      <div className="grid grid-cols-2 gap-2">
        {selectedLanguages.map((lang, index) => (
          <div key={lang} className="flex items-center gap-2">
            <Input
              type="text"
              className="w-16 text-sm"
              value={customKeys[index] || ''}
              onChange={(e) => setCustomKeys(prev => ({
                ...prev,
                [index]: e.target.value
              }))}
              placeholder={`Key ${index + 1}`}
            />
            <span className="text-sm">
              {INDIAN_LANGUAGES.find(l => l.value === lang)?.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
  const previewMessage = () => {
    if (!selectedLanguages.length) return 'Select languages and customize message...';
    return generateTemplate();
  };

  return (
    <div className="flex flex-col gap-4">
    <Tabs defaultValue="languages" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="languages">Select Languages</TabsTrigger>
        <TabsTrigger value="template">Edit Template</TabsTrigger>
      </TabsList>

      <TabsContent value="languages" className="mt-2">
        <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto p-1">
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

      <TabsContent value="template" className="mt-2 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Display Style</Label>
          <RadioGroup
            value={displayStyle}
            onValueChange={(value) => {
              setDisplayStyle(value);
              if (value !== DISPLAY_STYLES.NUMBERED) {
                setUseCustomKeys(false);
              }
            }}
            className="grid grid-cols-3 gap-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value={DISPLAY_STYLES.NUMBERED} id="numbered" />
              <Label htmlFor="numbered" className="text-xs">Numbered</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value={DISPLAY_STYLES.BULLETS} id="bullets" />
              <Label htmlFor="bullets" className="text-xs">Bullets</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value={DISPLAY_STYLES.BUTTONS} id="buttons" />
              <Label htmlFor="buttons" className="text-xs">Buttons</Label>
            </div>
          </RadioGroup>
        </div>

        {displayStyle === DISPLAY_STYLES.NUMBERED && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useCustomKeys"
                checked={useCustomKeys}
                onChange={(e) => setUseCustomKeys(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="useCustomKeys" className="text-xs">Use Custom Keys</Label>
            </div>
            {useCustomKeys && <CustomKeyInputs />}
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-xs font-medium">
            Custom Message Template (Optional)
          </Label>
          <Textarea
            placeholder="Enter custom message template..."
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            className="h-24 text-sm resize-none"
          />
        </div>

        <MessagePreview message={previewMessage()} />
      </TabsContent>
    </Tabs>

    <Button
      onClick={handleConvert}
      disabled={selectedLanguages.length === 0 || isLoading}
      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Configuring...
        </>
      ) : (
        'Save Configuration'
      )}
    </Button>
  </div>
  );
};

export const LanguageSelectorTrigger = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="ml-2 h-12 w-12 border-orange-200 hover:bg-orange-50">
        <Languages className="h-4 w-4" />
      </Button>
    </SheetTrigger>
    <SheetContent className="w-[400px] sm:w-[540px]">
      <SheetHeader>
        <SheetTitle className="text-orange-700">Configure Language Selection</SheetTitle>
      </SheetHeader>
      <div className="mt-4">
        <LanguageSelector />
      </div>
    </SheetContent>
  </Sheet>
);