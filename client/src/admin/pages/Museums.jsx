import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import adminApi from "../adminApi";

const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    icon: "🏛️",
    timing: "",
    description: "",
    coverImage: "",
    images: ["", "", ""],
    highlights: ["", "", "", ""],
    category: [],
    pricing: {
      indian: "",
      foreigner: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const availableCategories = ["history", "art", "ancient", "science", "royal", "international"];
  const availableIcons = ["🏛️", "🏺", "🎨", "👑", "🦖", "🌍", "⛩️", "🕌"];

  const loadMuseums = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/museums/admin");
      setMuseums(res.data);
    } catch (error) {
      console.error("Failed to load museums:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMuseums();
  }, []);

  const addMuseum = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Clean up empty strings from arrays
    const cleanedForm = {
      ...form,
      images: form.images.filter(img => img.trim() !== ""),
      highlights: form.highlights.filter(h => h.trim() !== ""),
    };

    try {
      if (editingId) {
        await adminApi.put(`/museums/admin/${editingId}`, cleanedForm);
        setEditingId(null);
      } else {
        await adminApi.post("/museums/admin", cleanedForm);
      }
      setForm({
        name: "",
        location: "",
        icon: "🏛️",
        timing: "",
        description: "",
        coverImage: "",
        images: ["", "", ""],
        highlights: ["", "", "", ""],
        category: [],
        pricing: { indian: "", foreigner: "" },
      });
      loadMuseums();
    } catch (error) {
      console.error("Failed to save museum:", error);
      alert("Failed to save museum");
    }
  };

  const deleteMuseum = async (id) => {
    if (confirm("Are you sure you want to delete this museum?")) {
      try {
        await adminApi.delete(`/museums/admin/${id}`);
        loadMuseums();
      } catch (error) {
        console.error("Failed to delete museum:", error);
        alert("Failed to delete museum");
      }
    }
  };

  const editMuseum = (museum) => {
    setForm({
      name: museum.name,
      location: museum.location,
      icon: museum.icon || "🏛️",
      timing: museum.timing,
      description: museum.description,
      coverImage: museum.coverImage || "",
      images: museum.images?.length > 0 ? [...museum.images, "", "", ""].slice(0, 3) : ["", "", ""],
      highlights: museum.highlights?.length > 0 ? [...museum.highlights, "", "", "", ""].slice(0, 4) : ["", "", "", ""],
      category: museum.category || [],
      pricing: {
        indian: museum.pricing?.indian || "",
        foreigner: museum.pricing?.foreigner || "",
      },
    });
    setEditingId(museum._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm({
      name: "",
      location: "",
      icon: "🏛️",
      timing: "",
      description: "",
      coverImage: "",
      images: ["", "", ""],
      highlights: ["", "", "", ""],
      category: [],
      pricing: { indian: "", foreigner: "" },
    });
    setEditingId(null);
  };

  const toggleCategory = (cat) => {
    if (form.category.includes(cat)) {
      setForm({ ...form, category: form.category.filter(c => c !== cat) });
    } else {
      setForm({ ...form, category: [...form.category, cat] });
    }
  };

  const updateImage = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
  };

  const updateHighlight = (index, value) => {
    const newHighlights = [...form.highlights];
    newHighlights[index] = value;
    setForm({ ...form, highlights: newHighlights });
  };

  const filteredMuseums = museums.filter(museum =>
    museum.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    museum.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "256px" }}>
        <Navbar />

        {/* Hero Banner */}
        <div style={{
          // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "60px 40px",
          color: "black",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "300px",
            height: "300px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            filter: "blur(60px)"
          }}></div>

          <div style={{
            maxWidth: "1400px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1
          }}>
            <h1 style={{
              fontSize: "42px",
              fontWeight: "800",
              marginBottom: "12px",
              marginTop: 0,
              letterSpacing: "-0.5px"
            }}>
              Museum Management 🏛️
            </h1>
            <p style={{
              fontSize: "18px",
              margin: 0,
              opacity: 0.95
            }}>
              Manage museum listings and information
            </p>
          </div>
        </div>

        <div style={{
          padding: "40px",
          maxWidth: "1400px",
          width: "100%",
          margin: "-40px auto 0",
          position: "relative",
          zIndex: 2
        }}>
          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            marginBottom: "40px"
          }}>
            {[
              {
                label: "Total Museums",
                value: museums.length,
                icon: "🏛️",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              },
              {
                label: "Active Listings",
                value: museums.length,
                icon: "✅",
                gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              },
              {
                label: "Avg Indian Price",
                value: `₹${museums.length > 0 ? Math.round(museums.reduce((sum, m) => sum + (m.pricing?.indian || 0), 0) / museums.length) : 0}`,
                icon: "💰",
                gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              },
              {
                label: "Avg Foreign Price",
                value: `₹${museums.length > 0 ? Math.round(museums.reduce((sum, m) => sum + (m.pricing?.foreigner || 0), 0) / museums.length) : 0}`,
                icon: "🌍",
                gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
              }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "28px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: "14px",
                      color: "#718096",
                      fontWeight: "500",
                      marginBottom: "8px",
                      marginTop: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      {stat.label}
                    </p>
                    <h3 style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      color: "#1a202c",
                      margin: 0,
                      lineHeight: 1
                    }}>
                      {stat.value}
                    </h3>
                  </div>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    background: stat.gradient,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    flexShrink: 0
                  }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Museum Form */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "32px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px"
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
                  fontSize: "24px"
                }}>
                  {editingId ? "✏️" : "➕"}
                </div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111827",
                  margin: 0
                }}>
                  {editingId ? "Edit Museum" : "Add New Museum"}
                </h3>
              </div>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "12px",
                    border: "2px solid #fee2e2",
                    background: "white",
                    color: "#dc2626",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={addMuseum}>
              {/* Basic Information */}
              <div style={{
                marginBottom: "32px",
                padding: "24px",
                background: "#f9fafb",
                borderRadius: "16px"
              }}>
                <h4 style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#111827",
                  marginTop: 0,
                  marginBottom: "20px"
                }}>
                  📝 Basic Information
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Museum Name *
                    </label>
                    <input
                      placeholder="Enter museum name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Location *
                    </label>
                    <input
                      placeholder="Enter location"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Icon
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {availableIcons.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setForm({ ...form, icon })}
                          style={{
                            padding: "10px 16px",
                            fontSize: "24px",
                            borderRadius: "12px",
                            border: form.icon === icon ? "2px solid #667eea" : "2px solid #e5e7eb",
                            background: form.icon === icon ? "#f0f4ff" : "white",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Timing
                    </label>
                    <input
                      placeholder="e.g., 10:00 AM - 6:00 PM (Closed on Mondays)"
                      value={form.timing}
                      onChange={(e) => setForm({ ...form, timing: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Description
                    </label>
                    <textarea
                      placeholder="Enter museum description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        resize: "vertical",
                        fontFamily: "inherit",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div style={{
                marginBottom: "32px",
                padding: "24px",
                background: "#f9fafb",
                borderRadius: "16px"
              }}>
                <h4 style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#111827",
                  marginTop: 0,
                  marginBottom: "20px"
                }}>
                  🖼️ Images
                </h4>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Cover Image
                    </label>
                    <input
                      placeholder="/images/museum.png"
                      value={form.coverImage}
                      onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>

                  {[0, 1, 2].map((index) => (
                    <div key={index}>
                      <label style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "8px"
                      }}>
                        Gallery Image {index + 1}
                      </label>
                      <input
                        placeholder={`/images/museum${index + 1}.png`}
                        value={form.images[index]}
                        onChange={(e) => updateImage(index, e.target.value)}
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          borderRadius: "12px",
                          border: "2px solid #e5e7eb",
                          fontSize: "15px",
                          outline: "none",
                          transition: "all 0.2s",
                          boxSizing: "border-box"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#667eea"}
                        onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div style={{
                marginBottom: "32px",
                padding: "24px",
                background: "#f9fafb",
                borderRadius: "16px"
              }}>
                <h4 style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#111827",
                  marginTop: 0,
                  marginBottom: "20px"
                }}>
                  ✨ Highlights
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index}>
                      <label style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "8px"
                      }}>
                        Highlight {index + 1}
                      </label>
                      <input
                        placeholder={`e.g., Ancient Sculptures`}
                        value={form.highlights[index]}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          borderRadius: "12px",
                          border: "2px solid #e5e7eb",
                          fontSize: "15px",
                          outline: "none",
                          transition: "all 0.2s",
                          boxSizing: "border-box"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#667eea"}
                        onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div style={{
                marginBottom: "32px",
                padding: "24px",
                background: "#f9fafb",
                borderRadius: "16px"
              }}>
                <h4 style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#111827",
                  marginTop: 0,
                  marginBottom: "20px"
                }}>
                  🏷️ Categories
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "20px",
                        border: form.category.includes(cat) ? "2px solid #667eea" : "2px solid #e5e7eb",
                        background: form.category.includes(cat) ? "#f0f4ff" : "white",
                        color: form.category.includes(cat) ? "#667eea" : "#6b7280",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        textTransform: "capitalize"
                      }}
                    >
                      {form.category.includes(cat) ? "✓ " : ""}{cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div style={{
                marginBottom: "32px",
                padding: "24px",
                background: "#f9fafb",
                borderRadius: "16px"
              }}>
                <h4 style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#111827",
                  marginTop: 0,
                  marginBottom: "20px"
                }}>
                  💰 Pricing
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Indian Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.pricing.indian}
                      onChange={(e) => setForm({
                        ...form,
                        pricing: { ...form.pricing, indian: e.target.value }
                      })}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Foreigner Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.pricing.foreigner}
                      onChange={(e) => setForm({
                        ...form,
                        pricing: { ...form.pricing, foreigner: e.target.value }
                      })}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "16px 32px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                }}
              >
                {editingId ? "💾 Update Museum" : "➕ Add Museum"}
              </button>
            </form>
          </div>

          {/* Search */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <input
              type="text"
              placeholder="🔍 Search museums by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Museums Grid */}
          {loading ? (
            <div style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "60px",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                border: "4px solid #667eea",
                borderTop: "4px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px"
              }}></div>
              <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
                Loading museums...
              </p>
            </div>
          ) : filteredMuseums.length === 0 ? (
            <div style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "60px",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏛️</div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "8px"
              }}>
                No museums found
              </h3>
              <p style={{ color: "#6b7280", margin: 0 }}>
                {searchTerm
                  ? "Try adjusting your search query"
                  : "Add your first museum to get started"}
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "24px"
            }}>
              {filteredMuseums.map((museum) => (
                <div
                  key={museum._id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                  }}
                >
                  {/* Museum Image */}
                  {museum.coverImage && (
                    <div style={{
                      width: "100%",
                      height: "200px",
                      background: `url(http://localhost:5000${museum.coverImage}) center/cover`,
                      position: "relative"
                    }}>
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
                        fontSize: "28px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                      }}>
                        {museum.icon || "🏛️"}
                      </div>
                    </div>
                  )}

                  <div style={{ padding: "24px" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      marginBottom: "16px"
                    }}>
                      {!museum.coverImage && (
                        <div style={{
                          width: "56px",
                          height: "56px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "28px",
                          flexShrink: 0
                        }}>
                          {museum.icon || "🏛️"}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#111827",
                          margin: "0 0 4px 0"
                        }}>
                          {museum.name}
                        </h3>
                        <p style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <span>📍</span>
                          {museum.location}
                        </p>
                      </div>
                    </div>

                    {museum.timing && (
                      <div style={{
                        padding: "12px 16px",
                        background: "#f9fafb",
                        borderRadius: "12px",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span style={{ fontSize: "16px" }}>⏰</span>
                        <span style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#374151"
                        }}>
                          {museum.timing}
                        </span>
                      </div>
                    )}

                    {museum.description && (
                      <p style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        lineHeight: "1.6",
                        marginBottom: "16px",
                        display: expandedId === museum._id ? "block" : "-webkit-box",
                        WebkitLineClamp: expandedId === museum._id ? "unset" : "2",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        {museum.description}
                      </p>
                    )}

                    {museum.description && museum.description.length > 100 && (
                      <button
                        onClick={() => setExpandedId(expandedId === museum._id ? null : museum._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#667eea",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          marginBottom: "16px",
                          padding: 0
                        }}
                      >
                        {expandedId === museum._id ? "Show less" : "Show more"}
                      </button>
                    )}

                    {/* Highlights */}
                    {museum.highlights && museum.highlights.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <p style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#6b7280",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}>
                          ✨ Highlights
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {museum.highlights.slice(0, 3).map((highlight, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "6px 12px",
                                background: "#ede9fe",
                                color: "#7c3aed",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "600"
                              }}
                            >
                              {highlight}
                            </span>
                          ))}
                          {museum.highlights.length > 3 && (
                            <span style={{
                              padding: "6px 12px",
                              background: "#f3f4f6",
                              color: "#6b7280",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}>
                              +{museum.highlights.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Categories */}
                    {museum.category && museum.category.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {museum.category.map((cat, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "4px 10px",
                                background: "#f0f4ff",
                                color: "#667eea",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: "600",
                                textTransform: "capitalize"
                              }}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "20px"
                    }}>
                      <div style={{
                        padding: "12px",
                        background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                        borderRadius: "12px",
                        border: "1px solid #10b981"
                      }}>
                        <p style={{
                          fontSize: "11px",
                          color: "#065f46",
                          fontWeight: "600",
                          margin: "0 0 4px 0",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}>
                          Indian
                        </p>
                        <p style={{
                          fontSize: "20px",
                          fontWeight: "800",
                          color: "#065f46",
                          margin: 0
                        }}>
                          ₹{museum.pricing?.indian || 0}
                        </p>
                      </div>

                      <div style={{
                        padding: "12px",
                        background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                        borderRadius: "12px",
                        border: "1px solid #3b82f6"
                      }}>
                        <p style={{
                          fontSize: "11px",
                          color: "#1e40af",
                          fontWeight: "600",
                          margin: "0 0 4px 0",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}>
                          Foreigner
                        </p>
                        <p style={{
                          fontSize: "20px",
                          fontWeight: "800",
                          color: "#1e40af",
                          margin: 0
                        }}>
                          ₹{museum.pricing?.foreigner || 0}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: "flex",
                      gap: "8px"
                    }}>
                      <button
                        onClick={() => editMuseum(museum)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "10px",
                          border: "2px solid #dbeafe",
                          background: "white",
                          color: "#3b82f6",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#dbeafe";
                          e.currentTarget.style.borderColor = "#3b82f6";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.borderColor = "#dbeafe";
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteMuseum(museum._id)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "10px",
                          border: "2px solid #fee2e2",
                          background: "white",
                          color: "#dc2626",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#fee2e2";
                          e.currentTarget.style.borderColor = "#dc2626";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.borderColor = "#fee2e2";
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results count */}
          {!loading && filteredMuseums.length > 0 && (
            <div style={{
              marginTop: "24px",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "14px"
            }}>
              Showing {filteredMuseums.length} of {museums.length} museums
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Museums;