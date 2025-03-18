import React, { useRef, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { validateTemplateName } from "./TemplateNameValidater";

// Enhanced language configurations with transliteration data
const languageConfigs = {
  en_US: {
    name: "English (US)",
    script: "latn",
    placeholder: "Type in English...",
    transliterationEngine: null,
  },
  en: {
    name: "English (US)",
    script: "latn",
    placeholder: "Type in English...",
    transliterationEngine: null,
  },
  hi: {
    name: "Hindi",
    script: "deva",
    placeholder: "हिंदी में टाइप करें...",
    code: "hi",
    transliterationEngine: "google",
  },
  bn: {
    name: "Bengali",
    script: "beng",
    placeholder: "বাংলায় টাইপ করুন...",
    code: "bn",
    transliterationEngine: "google",
  },
  kn: {
    name: "Kannada",
    script: "knda",
    placeholder: "ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
    code: "kn",
    transliterationEngine: "google",
  },
  ml: {
    name: "Malayalam",
    script: "mlym",
    placeholder: "മലയാളത്തിൽ ടൈപ്പ് ചെയ്യുക...",
    code: "ml",
    transliterationEngine: "google",
  },
  mr: {
    name: "Marathi",
    script: "deva",
    placeholder: "मराठीत टाइप करा...",
    code: "mr",
    transliterationEngine: "google",
  },
  pa: {
    name: "Punjabi",
    script: "guru",
    placeholder: "ਪੰਜਾਬੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ...",
    code: "pa",
    transliterationEngine: "google",
  },
  ta: {
    name: "Tamil",
    script: "taml",
    placeholder: "தமிழில் தட்டச்சு செய்யவும்...",
    code: "ta",
    transliterationEngine: "google",
  },
  te: {
    name: "Telugu",
    script: "telu",
    placeholder: "తెలుగులో టైప్ చేయండి...",
    code: "te",
    transliterationEngine: "google",
  },
};

// Improved transliteration hook
const useTransliteration = (text, language) => {
  const [transliterated, setTransliterated] = useState("");

  // Fallback transliteration using Google Translate API
  const googleTransliterate = useCallback(
    async (inputText) => {
      if (!inputText) return inputText;

      const langCode = languageConfigs[language]?.code;
      if (!langCode) return inputText;

      try {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${langCode}&dt=t&q=${encodeURIComponent(
            inputText
          )}`
        );

        const data = await response.text();

        // Attempt to parse the response
        try {
          const parsedData = JSON.parse(data.replace(/,+/g, ","));
          return parsedData[0][0][0] || inputText;
        } catch (parseError) {
          //  console.error('Transliteration parse error:', parseError);
          return inputText;
        }
      } catch (error) {
        //  console.error('Transliteration error:', error);
        return inputText;
      }
    },
    [language]
  );

  // Preprocess text to handle words starting and ending with "dummy"
  const preprocessText = useCallback(
    async (inputText) => {
      if (!inputText) return inputText;

      const segments = inputText.split(/\s+/);
      const processedSegments = await Promise.all(
        segments.map(async (segment) => {
          if (segment.startsWith("/.") && segment.endsWith("./")) {
            // Remove "/." from the start and "./" from the end, keep the word untranslated
            const cleanedSegment = segment.slice(2, -2); // Adjusted indices for "/." and "./"
            return cleanedSegment; // Keep untranslated
          } else {
            return await googleTransliterate(segment); // Transliterate other words
          }
        })
      );

      return processedSegments.join(" ");
    },
    [googleTransliterate]
  );

  // Advanced transliteration logic
  useEffect(() => {
    const performTransliteration = async () => {
      // Skip for English or if no text
      if (language === "en_US" || !text) {
        setTransliterated(text);
        return;
      }

      // Use preprocessing and transliteration
      const transliteratedText = await preprocessText(text);
      setTransliterated(transliteratedText);
    };

    // Debounce to reduce unnecessary API calls
    const timeoutId = setTimeout(performTransliteration, 300);

    return () => clearTimeout(timeoutId);
  }, [text, language, preprocessText]);

  return transliterated;
};

// Transliterating Input Component
const TransliteratingInput = ({
  value,
  onChange,
  language,
  placeholder,
  maxLength,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const transliterated = useTransliteration(inputValue, language);

  useEffect(() => {
    if (transliterated !== value) {
      onChange?.({ target: { value: transliterated } });
    }
  }, [transliterated, onChange, value]);

  return (
    <>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder || languageConfigs[language]?.placeholder}
        className={className}
        {...props}
      />
      <p className="text-[10px] text-muted-foreground text-right mt-0.5">
        {value.length} of {maxLength}
      </p>
    </>
  );
};

// Transliterating Textarea Component
const TransliteratingTextArea = ({
  value,
  onChange,
  language,
  placeholder,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const transliterated = useTransliteration(inputValue, language);

  useEffect(() => {
    if (transliterated !== value) {
      onChange?.({ target: { value: transliterated } });
    }
  }, [transliterated, onChange, value]);

  return (
    <>
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder || languageConfigs[language]?.placeholder}
        className={`min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      <p className="text-[10px] text-muted-foreground text-right mt-0.5">
        {value.length} of 1024
      </p>
    </>
  );
};

const WhatsAppTemplatePopup = ({
  showTemplatePopup,
  isEditing,
  templateName,
  category,
  language,
  headerType,
  headerContent,
  headerImage,
  bodyText,
  footerText,
  buttons,
  uploadProgress,
  setTemplateName,
  setCategory,
  setLanguage,
  setHeaderType,
  setHeaderContent,
  handleImageUpload,
  setBodyText,
  setFooterText,
  updateButton,
  deleteButton,
  addButton,
  handleCreateTemplate,
  setShowTemplatePopup,
  resetTemplateForm,
  setBodyVariables,
  setHeaderVariables,
  extractVariables,
  convertMentionsForFrontend,
  loading,
  setLoading,
}) => {
  const fileInputRef = useRef(null);

  const [templateNameError, setTemplateNameError] = useState("");

  if (!showTemplatePopup) return null;
  const handleTemplateNameChange = (e) => {
    const value = e.target.value.toLowerCase();
    setTemplateName(value);

    // Validate and set error
    const error = validateTemplateName(value);
    setTemplateNameError(error);
  };

  // The key part: separate error checking logic
  const isTemplateNameValid = () => {
    return validateTemplateName(templateName) === "";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col bg-white ">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between w-full">
            <CardTitle>
              {isEditing ? "Edit" : "Create"} WhatsApp Template Message
            </CardTitle>
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowTemplatePopup(false);
                  resetTemplateForm();
                }}
              >
                 <X className=" h-3 w-3" />
              </Button>
          </div>
        </CardHeader>
        <CardContent className="flex gap-6 p-6 overflow-auto">
          <form onSubmit={handleCreateTemplate} className="flex-1 space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Template Name</Label>
                <Input
                  value={templateName}
                  onChange={handleTemplateNameChange}
                  required
                />
                {templateNameError && (
                  <div className="text-red-500 text-sm mt-1">
                    {templateNameError}
                  </div>
                )}
              </div>

              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="UTILITY">Utility</SelectItem>
                    <SelectItem value="AUTHENTICATION">
                      Authentication
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languageConfigs).map(([code, config]) => (
                      <SelectItem key={code} value={code}>
                        {config.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Header (Optional)</Label>
                <Select
                  value={headerType || "none"}
                  onValueChange={(value) =>
                    setHeaderType(value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select header type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No header</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>

                {headerType === "text" && (
                  <TransliteratingInput
                    className="mt-2"
                    value={headerContent}
                    onChange={(e) => {
                      setHeaderContent(e.target.value);
                      setHeaderVariables(extractVariables(e.target.value));
                    }}
                    language={language}
                    placeholder={`Header text in ${languageConfigs[language]?.name}`}
                    maxLength={60}
                  />
                )}

                {(headerType === "image" ||
                  headerType === "video" ||
                  headerType === "document") && (
                  <div className="mt-2 space-y-2">
                    <input
                      type="file"
                      accept={
                        headerType === "image"
                          ? "image/*"
                          : headerType === "video"
                          ? "video/*"
                          : headerType === "document"
                          ? ".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
                          : "*/*"
                      }
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Upload {headerType}
                    </Button>
                    {headerImage && (
                      <p className="text-sm text-gray-600">
                        {headerImage.name}
                      </p>
                    )}
                    {uploadProgress > 0 && (
                      <Progress value={uploadProgress} className="w-full" />
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label>Body Text</Label>
                <TransliteratingTextArea
                  value={bodyText}
                  onChange={(e) => {
                    setBodyText(e.target.value);
                    setBodyVariables(extractVariables(e.target.value));
                  }}
                  language={language}
                  placeholder={languageConfigs[language]?.placeholder}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  maxLength={1024}
                />
              </div>

              <div>
                <Label>Footer (Optional)</Label>
                <TransliteratingInput
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  language={language}
                  placeholder={`Footer text in ${languageConfigs[language]?.name}`}
                  maxLength={60}
                />
              </div>

              <div className="space-y-2">
                <Label>Buttons (Optional)</Label>
                {buttons.map((button, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Select
                      value={button.type}
                      onValueChange={(value) =>
                        updateButton(index, "type", value)
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QUICK_REPLY">Quick Reply</SelectItem>
                        <SelectItem value="PHONE_NUMBER">
                          Phone Number
                        </SelectItem>
                        <SelectItem value="URL">URL</SelectItem>
                      </SelectContent>
                    </Select>

                    <TransliteratingInput
                      placeholder={`Button text in ${languageConfigs[language]?.name}`}
                      value={button.text}
                      onChange={(e) =>
                        updateButton(index, "text", e.target.value)
                      }
                      language={language}
                      maxLength={25}
                    />

                    {button.type === "PHONE_NUMBER" && (
                      <Input
                        type="tel"
                        placeholder="+1 555 123 4567"
                        value={button.phoneNumber}
                        onChange={(e) =>
                          updateButton(index, "phoneNumber", e.target.value)
                        }
                      />
                    )}

                    {button.type === "URL" && (
                      <Input
                        type="url"
                        placeholder="URL"
                        value={button.url}
                        onChange={(e) =>
                          updateButton(index, "url", e.target.value)
                        }
                      />
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteButton(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addButton}
                  className="w-full"
                  disabled={buttons.length >= 3}
                >
                  Add Button
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowTemplatePopup(false);
                  resetTemplateForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing" : isEditing ? "Update" : "Save"}{" "}
                Template
              </Button>
            </div>
          </form>

          <div className="w-[400px] flex-shrink-0 hidden md:block">
            <Card className="w-full max-w-md mx-auto shadow-lg sticky top-0 z-10">
              <CardHeader className="p-3 bg-[#128C7E] text-white">
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-gray-50">
                <div className="max-w-md mx-auto bg-[#DCF8C6] p-3 rounded-lg relative">
                  {/* Header Content */}
                  {headerType === "text" && headerContent && (
                    <div className="font-semibold text-gray-800 mb-2 break-words whitespace-normal overflow-hidden w-full">
                      {headerContent}
                    </div>
                  )}

                  {/* Image Header */}
                  {headerType === "image" && headerContent && (
                    <div className="mt-2 space-y-2">
                      <img
                        src={headerContent}
                        alt="Header"
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                    </div>
                  )}

                  {/* Video Header */}
                  {headerType === "video" && headerContent && (
                    <div className="mt-2 space-y-2">
                      <video
                        controls
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      >
                        <source src={headerContent} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {/* Document Header */}
                  {headerType === "document" && headerContent && (
                    <div className="p-3 bg-white border border-gray-300 rounded-lg flex items-center space-x-3">
                      {/* Document Icon */}
                      <div className="bg-gray-200 p-2 rounded-full">
                        📄 {/* Unicode document icon */}
                      </div>

                      {/* File Details */}
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-semibold break-words">
                          {headerContent.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {headerContent.size
                            ? (headerContent.size / 1024).toFixed(2) + " KB"
                            : "Unknown Size"}
                        </p>
                      </div>

                      {/* Download Button */}
                      <a
                        href={headerContent}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition"
                      >
                        Download
                      </a>
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="text-gray-900 mb-2 break-words">
                    {convertMentionsForFrontend(bodyText)}
                  </div>

                  {/* Footer Text */}
                  {footerText && (
                    <div className="text-sm text-gray-700 break-words mb-2">
                      {footerText}
                    </div>
                  )}

                  {/* Buttons */}
                  {buttons.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {buttons.map((button, index) => (
                        <button
                          key={index}
                          className="w-full bg-[#25D366] text-white py-2 rounded-lg hover:bg-[#1ea855] transition-colors"
                        >
                          {button.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp and Read Status */}
                  <div className="text-xs text-gray-500 text-right mt-2 flex justify-end items-center">
                    <span className="mr-1">1:10 PM</span>
                    <span className="text-blue-500">✓✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppTemplatePopup;
