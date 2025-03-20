import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { X, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const CarouselEditor = ({
  showPopup,
  setShowPopup,
  accessToken,
  accountId,
  setActiveTab,
  fetchTemplates,
}) => {
  // State declarations
  const [uploadProgress, setUploadProgress] = useState(0);
  const [headerMediaId, setHeaderMediaId] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en_US");
  const [category, setCategory] = useState("MARKETING");
  const [bodyText, setBodyText] = useState("");
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const BUTTON_TYPES = {
    QUICK_REPLY: "quick_reply",
    PHONE: "phone_number",
    URL: "url",
  };

  const MAX_CARDS = 10;
  const MAX_BUTTONS_PER_CARD = 2;

  // Initial card structure
  const initialCardStructure = {
    components: [
      {
        type: "header",
        format: "image",
        example: { header_handle: [], mediaId: "" },
      },
      { type: "body", text: "" },
      { type: "buttons", buttons: [] },
    ],
  };

  // Cards state
  const [cards, setCards] = useState([initialCardStructure]);

  // Refs
  const fileInputRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  // Cleanup function for URLs
  useEffect(() => {
    return () => {
      cards.forEach((card) => {
        const imageUrl = card.components[0].example.header_handle[0];
        if (imageUrl && imageUrl.startsWith("blob:")) {
          URL.revokeObjectURL(imageUrl);
        }
      });
    };
  }, []);

  // Image upload handler
  const handleCardImageUpload = async (cardIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");
      formData.append("messaging_product", "whatsapp");

      const response = await axios.post(
        "https://my-template-whatsapp.vercel.app/uploadMedia",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      const mediaId = response.data.body.h;
      const imageUrl = URL.createObjectURL(file);

      setCards((prevCards) => {
        const newCards = [...prevCards];
        newCards[cardIndex] = {
          ...newCards[cardIndex],
          components: [
            {
              ...newCards[cardIndex].components[0],
              example: {
                header_handle: [imageUrl],
                mediaId: mediaId,
              },
            },
            ...newCards[cardIndex].components.slice(1),
          ],
        };
        return newCards;
      });

      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      //  console.error('Error uploading image:', error);
      setUploadProgress(0);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  // Card management functions
  const addCard = () => {
    if (cards.length < MAX_CARDS) {
      setCards((prevCards) => [...prevCards, { ...initialCardStructure }]);
    }
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      setCards((prevCards) => {
        const newCards = prevCards.filter((_, i) => i !== index);
        if (prevCards[index].components[0].example.header_handle[0]) {
          URL.revokeObjectURL(
            prevCards[index].components[0].example.header_handle[0]
          );
        }
        return newCards;
      });
      if (currentPreviewIndex >= cards.length - 1) {
        setCurrentPreviewIndex(cards.length - 2);
      }
    }
  };

  const updateCardText = (index, text) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[index].components[1].text = text;
      return newCards;
    });
  };

  // Button management functions
  const addButton = (cardIndex) => {
    const card = cards[cardIndex];
    if (card.components[2].buttons.length < MAX_BUTTONS_PER_CARD) {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        newCards[cardIndex].components[2].buttons.push({
          type: BUTTON_TYPES.QUICK_REPLY,
          text: "",
          value: "",
        });
        return newCards;
      });
    }
  };

  const removeButton = (cardIndex, buttonIndex) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[cardIndex].components[2].buttons.splice(buttonIndex, 1);
      return newCards;
    });
  };

  const updateButton = (cardIndex, buttonIndex, field, value) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[cardIndex].components[2].buttons[buttonIndex][field] = value;
      return newCards;
    });
  };

  // Navigation functions
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const nextPreviewCard = () => {
    setCurrentPreviewIndex((prev) => (prev + 1) % cards.length);
  };

  const prevPreviewCard = () => {
    setCurrentPreviewIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  // Validation functions
  const isValidPhoneNumber = (number) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(number);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateButton = (button) => {
    if (!button.text.trim()) return false;
    if (button.type === BUTTON_TYPES.PHONE && !isValidPhoneNumber(button.value))
      return false;
    if (button.type === BUTTON_TYPES.URL && !isValidUrl(button.value))
      return false;
    return true;
  };

  // Handle carousel creation
  const handleCreateCarousel = async (carouselData) => {
    try {
      setIsSubmitting(true);
      const components = [];

      if (carouselData.bodyText.trim()) {
        components.push({
          type: "BODY",
          text: carouselData.bodyText,
        });
      }

      const carouselComponent = {
        type: "CAROUSEL",
        cards: carouselData.cards.map((card) => ({
          components: [
            {
              type: "HEADER",
              format: "IMAGE",
              example: {
                header_handle: [card.components[0].example.mediaId],
              },
            },
            {
              type: "BODY",
              text: card.components[1].text,
            },
            {
              type: "BUTTONS",
              buttons: card.components[2].buttons
                .map((button) => {
                  switch (button.type) {
                    case BUTTON_TYPES.QUICK_REPLY:
                      return {
                        type: "QUICK_REPLY",
                        text: button.text,
                      };
                    case BUTTON_TYPES.PHONE:
                      return {
                        type: "PHONE_NUMBER",
                        text: button.text,
                        phone_number: button.value,
                      };
                    case BUTTON_TYPES.URL:
                      return {
                        type: "URL",
                        text: button.text,
                        url: button.value,
                      };
                    default:
                      return null;
                  }
                })
                .filter(Boolean),
            },
          ].filter(
            (component) =>
              component.type !== "BUTTONS" || component.buttons.length > 0
          ),
        })),
      };

      components.push(carouselComponent);

      const templateData = {
        name: carouselData.name.toLowerCase().replace(/\s+/g, "_"),
        category: carouselData.category,
        components: components,
        language: carouselData.language,
      };

      const response = await axios.post(
        `https://graph.facebook.com/v20.0/${accountId}/message_templates`,
        templateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setShowPopup(false);
      await fetchTemplates();
      setActiveTab("templates");

      toast({
        title: "Success",
        description: "Carousel template created successfully",
      });
    } catch (error) {
      //  console.error('Error creating carousel template:', error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "An error occurred while creating the carousel template";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !language || !category || cards.length === 0) {
      toast.error(
        "Please fill in all required fields and add at least one card"
      );
      return;
    }

    const missingImages = cards.some(
      (card) => !card.components[0].example.mediaId
    );
    if (missingImages) {
      toast.error("Please upload images for all cards");
      return;
    }

    const missingDescriptions = cards.some(
      (card) => !card.components[1].text.trim()
    );
    if (missingDescriptions) {
      toast.error("Please add descriptions for all cards");
      return;
    }

    try {
      setIsSubmitting(true);
      const components = [];

      if (bodyText.trim()) {
        components.push({
          type: "BODY",
          text: bodyText,
        });
      }

      const carouselComponent = {
        type: "CAROUSEL",
        cards: cards.map((card) => ({
          components: [
            {
              type: "HEADER",
              format: "IMAGE",
              example: {
                header_handle: [card.components[0].example.mediaId],
              },
            },
            {
              type: "BODY",
              text: card.components[1].text,
            },
            {
              type: "BUTTONS",
              buttons: card.components[2].buttons
                .map((button) => {
                  switch (button.type) {
                    case BUTTON_TYPES.QUICK_REPLY:
                      return {
                        type: "QUICK_REPLY",
                        text: button.text,
                      };
                    case BUTTON_TYPES.PHONE:
                      return {
                        type: "PHONE_NUMBER",
                        text: button.text,
                        phone_number: button.value,
                      };
                    case BUTTON_TYPES.URL:
                      return {
                        type: "URL",
                        text: button.text,
                        url: button.value,
                      };
                    default:
                      return null;
                  }
                })
                .filter(Boolean),
            },
          ].filter(
            (component) =>
              component.type !== "BUTTONS" || component.buttons.length > 0
          ),
        })),
      };

      components.push(carouselComponent);

      const templateData = {
        name: name.toLowerCase().replace(/\s+/g, "_"),
        category: category,
        components: components,
        language: language,
      };

      await axios.post(
        `https://graph.facebook.com/v20.0/${accountId}/message_templates`,
        templateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Carousel template created successfully");
      setShowPopup(false);
      await fetchTemplates();
      setActiveTab("templates");
    } catch (error) {
      //  console.error('Error creating carousel template:', error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "An error occurred while creating the carousel template";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col bg-white">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Create Carousel Message</CardTitle>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPopup(false)}
            >
              <X className=" h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-4rem)] gap-6 p-6">
          <div className="flex-1 flex flex-col max-w-[calc(100%-340px)]">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 flex-1 overflow-y-auto pr-2"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter template name"
                  />
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
                      <SelectItem value="en_US">English (US)</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="kn">Kannada</SelectItem>
                      <SelectItem value="ml">Malayalam</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="pa">Punjabi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Introduction Text (Optional)</Label>
                <textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter introduction text for your carousel"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Carousel Cards</Label>
                  <Button
                    type="button"
                    onClick={addCard}
                    disabled={cards.length >= MAX_CARDS}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Card
                  </Button>
                </div>

                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                    onClick={() => scroll("left")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto px-8 py-4 snap-x snap-mandatory hide-scrollbar"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {cards.map((card, cardIndex) => (
                      <Card
                        key={cardIndex}
                        className="min-w-[300px] snap-center flex-shrink-0 p-4 relative"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeCard(cardIndex)}
                          disabled={cards.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="space-y-4">
                          <div>
                            <Label>Card Image</Label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleCardImageUpload(cardIndex, e)
                              }
                              className="hidden"
                              ref={(el) =>
                                (fileInputRefs.current[cardIndex] = el)
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                fileInputRefs.current[cardIndex].click()
                              }
                              className="w-full"
                            >
                              Upload Image
                            </Button>
                            {card.components[0].example.header_handle[0] && (
                              <div className="mt-2">
                                <img
                                  src={
                                    card.components[0].example.header_handle[0]
                                  }
                                  alt="Preview"
                                  className="w-full h-32 object-cover rounded"
                                />
                              </div>
                            )}
                            {uploadProgress > 0 && (
                              <Progress
                                value={uploadProgress}
                                className="w-full mt-2"
                              />
                            )}
                          </div>

                          <div>
                            <Label>Card Description</Label>
                            <Input
                              value={card.components[1].text}
                              onChange={(e) =>
                                updateCardText(cardIndex, e.target.value)
                              }
                              placeholder="Enter card description"
                            />
                          </div>

                          <div className="space-y-4">
                            {card.components[2].buttons.map(
                              (button, buttonIndex) => (
                                <div key={buttonIndex} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label>Button {buttonIndex + 1}</Label>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        removeButton(cardIndex, buttonIndex)
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <Select
                                    value={button.type}
                                    onValueChange={(value) =>
                                      updateButton(
                                        cardIndex,
                                        buttonIndex,
                                        "type",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select button type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem
                                        value={BUTTON_TYPES.QUICK_REPLY}
                                      >
                                        Quick Reply
                                      </SelectItem>
                                      <SelectItem value={BUTTON_TYPES.PHONE}>
                                        Phone Number
                                      </SelectItem>
                                      <SelectItem value={BUTTON_TYPES.URL}>
                                        URL
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>

                                  <Input
                                    placeholder="Button text"
                                    value={button.text}
                                    onChange={(e) =>
                                      updateButton(
                                        cardIndex,
                                        buttonIndex,
                                        "text",
                                        e.target.value
                                      )
                                    }
                                  />

                                  {(button.type === BUTTON_TYPES.PHONE ||
                                    button.type === BUTTON_TYPES.URL) && (
                                    <Input
                                      placeholder={
                                        button.type === BUTTON_TYPES.PHONE
                                          ? "Phone number"
                                          : "URL"
                                      }
                                      value={button.value}
                                      onChange={(e) =>
                                        updateButton(
                                          cardIndex,
                                          buttonIndex,
                                          "value",
                                          e.target.value
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              )
                            )}

                            {card.components[2].buttons.length <
                              MAX_BUTTONS_PER_CARD && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => addButton(cardIndex)}
                                className="w-full mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" /> Add Button
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
                    onClick={() => scroll("right")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Carousel"}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="w-[340px] flex-shrink-0">
            <Card className="sticky top-0 shadow-lg">
              <CardHeader className="p-3 bg-[#128C7E] text-white">
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-gray-50">
                {bodyText && (
                  <div className="bg-[#DCF8C6] p-3 rounded-lg mb-4">
                    <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">
                      {bodyText}
                    </p>
                  </div>
                )}

                <div className="relative bg-white rounded-lg shadow-md">
                  {cards.length > 0 && (
                    <>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                        {cards[currentPreviewIndex].components[0].example
                          .header_handle[0] ? (
                          <img
                            src={
                              cards[currentPreviewIndex].components[0].example
                                .header_handle[0]
                            }
                            alt={`Preview ${currentPreviewIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-400">No image uploaded</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-gray-800 mb-4">
                          {cards[currentPreviewIndex].components[1].text ||
                            "Add a description..."}
                        </p>
                        <div className="space-y-2">
                          {cards[currentPreviewIndex].components[2].buttons.map(
                            (button, index) => (
                              <button
                                key={index}
                                className="w-full bg-[#25D366] text-white py-2 rounded-lg text-sm"
                              >
                                {button.text ||
                                  `Add button ${index + 1} text...`}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {cards.length > 1 && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={prevPreviewCard}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={nextPreviewCard}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>

                {cards.length > 1 && (
                  <div className="flex justify-center gap-1 mt-4">
                    {cards.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentPreviewIndex
                            ? "bg-[#128C7E]"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarouselEditor;
