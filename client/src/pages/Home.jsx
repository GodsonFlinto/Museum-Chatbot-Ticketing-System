import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { setActiveMuseum } from "../features/museum/museumSlice";

const HomePage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredMuseum, setHoveredMuseum] = useState(null);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [language, setLanguage] = useState("en");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [translatedContent, setTranslatedContent] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [museums, setMuseums] = useState([]);

  useEffect(() => {
    const fetchMuseums = async () => {
      const res = await api.get("/museums");
      setMuseums(res.data);
    };
    fetchMuseums();
  }, []);

  // Auto-translate function
  const translateText = async (text, targetLang) => {
    if (targetLang === "en" || !text) return text;
    
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      return data[0][0][0];
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  // Translate museums when language changes
  useEffect(() => {
    const translateMuseums = async () => {
      if (language === "en") {
        setTranslatedContent({});
        return;
      }

      const translated = {};
      for (const museum of museums) {
        translated[museum._id] = {
          name: await translateText(museum.name, language),
          location: await translateText(museum.location, language),
          description: await translateText(museum.description, language),
          timing: await translateText(museum.timing, language),
          highlights: await Promise.all(
            museum.highlights.map(h => translateText(h, language))
          )
        };
      }
      setTranslatedContent(translated);
    };

    translateMuseums();
  }, [language, museums]);

  const t = {
    title: language === "en" ? "Museum Portal" : language === "hi" ? "संग्रहालय पोर्टल" : "அருங்காட்சியக போர்டல்",
    hero: language === "en" ? "Discover India's" : language === "hi" ? "भारत की खोज करें" : "இந்தியாவின் கண்டுபிடி",
    heroGradient: language === "en" ? "Cultural Heritage" : language === "hi" ? "सांस्कृतिक विरासत" : "கலாச்சார பாரம்பரியம்",
    heroDesc: language === "en" ? "Explore premier museums across India with AI-powered assistance. Book tickets, get virtual tours, and immerse yourself in history." : language === "hi" ? "एआई-संचालित सहायता के साथ भारत के प्रमुख संग्रहालयों का अन्वेषण करें।" : "AI-இயங்கும் உதவியுடன் இந்தியா முழுவதும் உள்ள முதன்மை அருங்காட்சியகங்களை ஆராயுங்கள்.",
    startExploring: language === "en" ? "Start Exploring" : language === "hi" ? "अन्वेषण शुरू करें" : "ஆராய்தலைத் தொடங்குங்கள்",
    whyChoose: language === "en" ? "Why Choose Us?" : language === "hi" ? "हमें क्यों चुनें?" : "ஏன் எங்களைத் தேர்வு செய்ய வேண்டும்?",
    whyDesc: language === "en" ? "Everything you need for a seamless museum experience" : language === "hi" ? "एक निर्बाध संग्रहालय अनुभव के लिए सब कुछ" : "தடையற்ற அருங்காட்சியக அனுபவத்திற்கு தேவையான அனைத்தும்",
    exploreTitle: language === "en" ? "Explore Museums Across India" : language === "hi" ? "भारत भर के संग्रहालयों का अन्वेषण करें" : "இந்தியா முழுவதும் உள்ள அருங்காட்சியகங்களை ஆராயுங்கள்",
    exploreDesc: language === "en" ? "Click on any museum to view details, timings, and book tickets" : language === "hi" ? "विवरण देखने के लिए किसी भी संग्रहालय पर क्लिक करें" : "விவரங்களைப் பார்க்க எந்த அருங்காட்சியகத்திலும் கிளிக் செய்யவும்",
    viewDetails: language === "en" ? "View Details" : language === "hi" ? "विवरण देखें" : "விவரங்களைப் பார்க்கவும்",
    timing: language === "en" ? "Timing" : language === "hi" ? "समय" : "நேரம்",
    ticketPrice: language === "en" ? "Ticket Price" : language === "hi" ? "टिकट मूल्य" : "டிக்கெட் விலை",
    highlights: language === "en" ? "Highlights" : language === "hi" ? "मुख्य आकर्षण" : "சிறப்பம்சங்கள்",
    bookTickets: language === "en" ? "Book Tickets with AI Assistant" : language === "hi" ? "एआई सहायक के साथ टिकट बुक करें" : "AI உதவியாளருடன் டிக்கெட்டுகளை முன்பதிவு செய்யுங்கள்",
    close: language === "en" ? "Close" : language === "hi" ? "बंद करें" : "மூடு",
    footer1: language === "en" ? "Museum Portal - Explore India's Cultural Heritage" : language === "hi" ? "संग्रहालय पोर्टल - भारत की सांस्कृतिक विरासत" : "அருங்காட்சியக போர்டல் - இந்தியாவின் கலாச்சார பாரம்பரியம்",
    footer2: language === "en" ? "Powered by AI • Book Tickets • Virtual Tours • 24/7 Support" : language === "hi" ? "एआई द्वारा संचालित • टिकट बुकिंग • वर्चुअल टूर • 24/7 सहायता" : "AI மூலம் இயக்கப்படுகிறது • டிக்கெட் முன்பதிவு • மெய்நிகர் சுற்றுப்பயணங்கள் • 24/7 ஆதரவு",
  };

  const features = [
    {
      icon: "🎫",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      title: language === "en" ? "Easy Booking" : language === "hi" ? "आसान बुकिंग" : "எளிதான முன்பதிவு",
      description: language === "en" ? "Book tickets instantly with our AI-powered assistant" : language === "hi" ? "हमारे एआई-संचालित सहायक के साथ तुरंत टिकट बुक करें" : "எங்கள் AI-இயங்கும் உதவியாளருடன் உடனடியாக டிக்கெட்டுகளை முன்பதிவு செய்யுங்கள்",
    },
    {
      icon: "🤖",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      title: language === "en" ? "24/7 Support" : language === "hi" ? "24/7 सहायता" : "24/7 ஆதரவு",
      description: language === "en" ? "Get answers anytime with our intelligent chatbot" : language === "hi" ? "हमारे बुद्धिमान चैटबॉट के साथ कभी भी उत्तर प्राप्त करें" : "எங்கள் அறிவார்ந்த சாட்போட் மூலம் எப்போது வேண்டுமானாலும் பதில்களைப் பெறுங்கள்",
    },
    {
      icon: "🏛️",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      title: language === "en" ? "Virtual Tours" : language === "hi" ? "वर्चुअल टूर" : "மெய்நிகர் சுற்றுப்பயணங்கள்",
      description: language === "en" ? "Explore collections from anywhere in the world" : language === "hi" ? "दुनिया में कहीं से भी संग्रहों का अन्वेषण करें" : "உலகில் எங்கிருந்தும் சேகரிப்புகளை ஆராயுங்கள்",
    },
    {
      icon: "💳",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      title: language === "en" ? "Secure Payment" : language === "hi" ? "सुरक्षित भुगतान" : "பாதுகாப்பான பணம் செலுத்தல்",
      description: language === "en" ? "Safe and encrypted payment processing" : language === "hi" ? "सुरक्षित और एन्क्रिप्टेड भुगतान प्रसंस्करण" : "பாதுகாப்பான மற்றும் குறியாக்கம் செய்யப்பட்ட பணம் செலுத்தல்",
    },
  ];

  const closeModal = () => {
    setSelectedMuseum(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedMuseum) {
      setCurrentImageIndex((prev) =>
        prev === selectedMuseum.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedMuseum) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedMuseum.images.length - 1 : prev - 1
      );
    }
  };

  const getMuseumContent = (museum) => {
    if (language === "en") return museum;
    return {
      ...museum,
      name: translatedContent[museum._id]?.name || museum.name,
      location: translatedContent[museum._id]?.location || museum.location,
      description: translatedContent[museum._id]?.description || museum.description,
      timing: translatedContent[museum._id]?.timing || museum.timing,
      highlights: translatedContent[museum._id]?.highlights || museum.highlights,
    };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* HEADER/NAVBAR */}
      <nav style={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px"
          }}>
            🏛️
          </div>
          <h1 style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px"
          }}>
            {t.title}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              border: "2px solid #e5e7eb",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              backgroundColor: "white",
              transition: "all 0.2s"
            }}
          >
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="ta">🇮🇳 தமிழ்</option>
          </select>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{
        padding: "100px 40px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(60px)"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-150px",
          right: "-150px",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(80px)"
        }}></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{
            fontSize: "64px",
            fontWeight: "900",
            margin: "0 0 24px 0",
            lineHeight: "1.1",
            letterSpacing: "-1px"
          }}>
            {t.hero}{" "}
            <span style={{
              background: "linear-gradient(to right, #fbbf24, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "block",
              marginTop: "8px"
            }}>
              {t.heroGradient}
            </span>
          </h1>
          <p style={{
            fontSize: "20px",
            maxWidth: "700px",
            margin: "0 auto 48px",
            opacity: 0.95,
            lineHeight: "1.6",
            fontWeight: "400"
          }}>
            {t.heroDesc}
          </p>
          <button
            onClick={() => document.getElementById("museums").scrollIntoView({ behavior: "smooth" })}
            style={{
              padding: "18px 40px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "white",
              color: "#667eea",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 14px 40px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
            }}
          >
            {t.startExploring} →
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div style={{ padding: "100px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          fontSize: "42px",
          fontWeight: "800",
          textAlign: "center",
          marginBottom: "16px",
          color: "#111827",
          letterSpacing: "-0.5px"
        }}>
          {t.whyChoose}
        </h2>
        <p style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: "18px",
          marginBottom: "60px",
          maxWidth: "600px",
          margin: "0 auto 60px"
        }}>
          {t.whyDesc}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "35px",
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                padding: "30px",
                borderRadius: "20px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                boxShadow: hoveredFeature === index
                  ? "0 20px 40px rgba(0,0,0,0.12)"
                  : "0 4px 6px rgba(0,0,0,0.05)",
                transform: hoveredFeature === index ? "translateY(-8px)" : "translateY(0)",
                transition: "all 0.3s",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                width: "120px",
                height: "120px",
                background: feature.gradient,
                borderRadius: "50%",
                opacity: 0.1,
                filter: "blur(30px)"
              }}></div>
              
              <div style={{
                width: "64px",
                height: "64px",
                background: feature.gradient,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "20px"
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "12px",
                color: "#111827",
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: "#6b7280",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "15px"
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MUSEUMS SECTION */}
      <div
        id="museums"
        style={{ padding: "100px 40px", backgroundColor: "#f3f4f6" }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "42px",
            fontWeight: "800",
            textAlign: "center",
            marginBottom: "16px",
            color: "#111827",
            letterSpacing: "-0.5px"
          }}>
            {t.exploreTitle}
          </h2>
          <p style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "18px",
            marginBottom: "60px",
            maxWidth: "600px",
            margin: "0 auto 60px"
          }}>
            {t.exploreDesc}
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "32px",
          }}>
            {museums.map((museum, index) => {
              const content = getMuseumContent(museum);
              return (
                <div
                  key={museum._id}
                  onMouseEnter={() => setHoveredMuseum(index)}
                  onMouseLeave={() => setHoveredMuseum(null)}
                  onClick={() => setSelectedMuseum(museum)}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    boxShadow: hoveredMuseum === index
                      ? "0 20px 40px rgba(0,0,0,0.12)"
                      : "0 4px 6px rgba(0,0,0,0.05)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    transform: hoveredMuseum === index ? "translateY(-8px)" : "translateY(0)",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={`http://localhost:5000${museum.coverImage}`}
                      alt={content.name}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        transform: hoveredMuseum === index ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.3s"
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      width: "48px",
                      height: "48px",
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}>
                      🏛️
                    </div>
                  </div>
                  
                  <div style={{ padding: "24px" }}>
                    <h3 style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      marginBottom: "8px",
                      color: "#111827",
                    }}>
                      {content.name}
                    </h3>
                    <p style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}>
                      📍 {content.location}
                    </p>
                    <p style={{
                      color: "#374151",
                      lineHeight: "1.6",
                      marginBottom: "20px",
                      fontSize: "15px",
                    }}>
                      {content.description.substring(0, 120)}...
                    </p>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "16px",
                      borderTop: "1px solid #f3f4f6"
                    }}>
                      <span style={{
                        color: "#667eea",
                        fontWeight: "600",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}>
                        {t.viewDetails} →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MUSEUM DETAIL MODAL */}
      {selectedMuseum && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            backdropFilter: "blur(4px)"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.6)"}
            >
              ×
            </button>

            {/* Image Carousel */}
            <div style={{
              position: "relative",
              backgroundColor: "#f3f4f6",
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              overflow: "hidden",
            }}>
              {selectedMuseum.images?.length > 0 && (
                <img
                  src={`http://localhost:5000${selectedMuseum.images[currentImageIndex]}`}
                  alt={getMuseumContent(selectedMuseum).name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}

              {selectedMuseum.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: "absolute",
                      left: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "50%",
                      width: "44px",
                      height: "44px",
                      fontSize: "20px",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    ←
                  </button>

                  <button
                    onClick={nextImage}
                    style={{
                      position: "absolute",
                      right: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "50%",
                      width: "44px",
                      height: "44px",
                      fontSize: "20px",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    →
                  </button>
                </>
              )}

              {/* Image indicator dots */}
              {selectedMuseum.images.length > 1 && (
                <div style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "8px"
                }}>
                  {selectedMuseum.images.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: index === currentImageIndex ? "white" : "rgba(255,255,255,0.5)",
                        transition: "all 0.2s"
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: "40px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px"
                }}>
                  🏛️
                </div>
                <div>
                  <h2 style={{
                    margin: "0 0 6px 0",
                    fontSize: "30px",
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: "-0.5px"
                  }}>
                    {getMuseumContent(selectedMuseum).name}
                  </h2>
                  <p style={{
                    margin: 0,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "15px"
                  }}>
                    📍 {getMuseumContent(selectedMuseum).location}
                  </p>
                </div>
              </div>

              <p style={{
                color: "#374151",
                lineHeight: "1.8",
                marginBottom: "32px",
                fontSize: "16px"
              }}>
                {getMuseumContent(selectedMuseum).description}
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "32px",
                padding: "24px",
                backgroundColor: "#f9fafb",
                borderRadius: "16px",
                border: "1px solid #e5e7eb"
              }}>
                <div>
                  <p style={{
                    margin: "0 0 8px 0",
                    fontWeight: "700",
                    color: "#111827",
                    fontSize: "15px"
                  }}>
                    ⏰ {t.timing}
                  </p>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "15px" }}>
                    {getMuseumContent(selectedMuseum).timing}
                  </p>
                </div>
                <div>
                  <p style={{
                    margin: "0 0 8px 0",
                    fontWeight: "700",
                    color: "#111827",
                    fontSize: "15px"
                  }}>
                    💰 {t.ticketPrice}
                  </p>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "15px" }}>
                    ₹{selectedMuseum.pricing.indian} (Indians) • ₹{selectedMuseum.pricing.foreigner} (Foreigners)
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: "#111827",
                }}>
                  ✨ {t.highlights}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {getMuseumContent(selectedMuseum).highlights.map((highlight, index) => (
                    <span
                      key={index}
                      style={{
                        padding: "10px 18px",
                        background: "linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)",
                        color: "#7c3aed",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        border: "1px solid #e9d5ff"
                      }}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  closeModal();
                  dispatch(setActiveMuseum(selectedMuseum));
                  localStorage.setItem("activeMuseum", JSON.stringify(selectedMuseum));
                  navigate("/chatbot");
                }}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 20px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                <span>🎫</span>
                {t.bookTickets}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{
        padding: "60px 40px",
        background: "linear-gradient(180deg, #1a202c 0%, #2d3748 100%)",
        color: "white",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            margin: "0 auto 24px"
          }}>
            🏛️
          </div>
          <p style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "12px",
          }}>
            {t.footer1}
          </p>
          <p style={{
            fontSize: "15px",
            color: "#9ca3af",
            margin: 0,
          }}>
            {t.footer2}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;