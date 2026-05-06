import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";

function IntermediateStream() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matricData, matricStream } = useContext(AuthContext);
  const { reviewingIntermediate, stream: reviewStream } = location.state || {};
  const finalMatricData = matricData || location.state || {};
  const currentMatricStream = finalMatricData.stream || matricStream;

  const isReviewMode = reviewingIntermediate && reviewStream;

  const getAllowedStreams = (matricStream) => {
    const allStreams = [
      {
        id: "pre-med",
        title: "Pre-Medical",
        subtitle: "👨‍⚕️ Biology, Chemistry, Physics",
        color: "from-emerald-500 to-green-600",
        icon: "🩺"
      },
      {
        id: "pre-eng", 
        title: "Pre-Engineering",
        subtitle: "🔧 Math, Physics, Chemistry",
        color: "from-blue-500 to-indigo-600",
        icon: "⚙️"
      },
      {
        id: "ics",
        title: "ICS (Computer Science)",
        subtitle: "💻 Computer, Math, Physics", 
        color: "from-purple-500 to-violet-600",
        icon: "🖥️"
      },
      {
        id: "arts",
        title: "Arts & Humanities",
        subtitle: "🎨 Psychology, Sociology, Civics",
        color: "from-orange-500 to-red-600",
        icon: "🎭"
      }
    ];

    switch (matricStream) {
      case "bio":
        return allStreams; // All allowed
      case "cs":
        return allStreams.filter(s => s.id !== "pre-med"); // Disable pre-med
      case "arts":
        return allStreams.filter(s => s.id === "arts"); // Only arts
      default:
        return []; // No matric stream selected
    }
  };

  const allowedStreams = getAllowedStreams(currentMatricStream);

  const allowedStreamIds = allowedStreams.map(s => s.id);

  const allStreams = [
    {
      id: "pre-med",
      title: "Pre-Medical",
      subtitle: "👨‍⚕️ Biology, Chemistry, Physics",
      color: "from-emerald-500 to-green-600",
      icon: "🩺"
    },
    {
      id: "pre-eng", 
      title: "Pre-Engineering",
      subtitle: "🔧 Math, Physics, Chemistry",
      color: "from-blue-500 to-indigo-600",
      icon: "⚙️"
    },
    {
      id: "ics",
      title: "ICS (Computer Science)",
      subtitle: "💻 Computer, Math, Physics", 
      color: "from-purple-500 to-violet-600",
      icon: "🖥️"
    },
    {
      id: "arts",
      title: "Arts & Humanities",
      subtitle: "🎨 Psychology, Sociology, Civics",
      color: "from-orange-500 to-red-600",
      icon: "🎭"
    }
  ];

  const handleStreamSelect = (streamId) => {
    if (!allowedStreamIds.includes(streamId)) return;
    if (isReviewMode && streamId !== reviewStream) return;
    navigate("/intermediate-subjects", {
      state: { ...finalMatricData, stream: streamId }
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12 sm:mb-20"
          >
            <div className={`text-5xl sm:text-7xl mb-6 sm:mb-8 animate-bounce ${isReviewMode ? 'w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl career-glow mx-auto' : ''}`}>
              {isReviewMode ? '✏️' : '🎓'}
            </div>
            <h1 className="text-2xl min-[321px]:text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent mb-4 sm:mb-6 px-1 break-anywhere">
              {isReviewMode ? 'Review Intermediate Stream' : 'Choose Intermediate Stream'}
            </h1>
            <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-1">
              {isReviewMode ? (
                <>Edit marks for your <span className="font-bold text-emerald-400">{reviewStream?.replace('-', ' ').toUpperCase()}</span> stream</>
              ) : (
                "Select the stream that matches your Matric performance and career interests"
              )}
            </p>
          </motion.div>

          {/* Stream Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-8 max-w-6xl mx-auto">
            {allStreams.map((stream, index) => {
              const isSelected = isReviewMode && stream.id === reviewStream;
              const isMatricRestricted = !allowedStreamIds.includes(stream.id);
              const isDisabled = (isReviewMode && !isSelected) || isMatricRestricted;
              return (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={isDisabled ? {} : { 
                    y: -20, 
                    scale: 1.05, 
                    rotateX: 5, 
                    rotateY: 5,
                    transition: { duration: 0.4 }
                  }}
                >
                  <GlassCard 
                    className={`
                      min-h-[14rem] sm:min-h-[16rem] md:h-80 cursor-pointer group relative overflow-hidden transition-all duration-500
                      ${isSelected 
                        ? 'ring-4 ring-emerald-400/50 shadow-2xl shadow-emerald-500/50 cursor-pointer border-emerald-400 bg-emerald-500/20' 
                        : isDisabled 
                          ? 'opacity-50 cursor-not-allowed hover:opacity-50 hover:scale-100 hover:shadow-none border-gray-500/50 pointer-events-none' 
                          : 'hover:bg-white/20 hover:border-emerald-400/50 hover:shadow-2xl'
                      }`}
                    onClick={isDisabled ? undefined : () => handleStreamSelect(stream.id)}
                    aria-disabled={isDisabled}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stream.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500 ${isDisabled ? 'opacity-10' : ''}`}></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center min-h-[inherit] h-full p-5 sm:p-8 text-center">
                      <motion.div 
                        className="text-4xl sm:text-6xl mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110"
                        animate={isDisabled ? {} : { rotate: [0, 10, -10, 0] }}
                        transition={isDisabled ? {} : { duration: 3, repeat: Infinity }}
                      >
                        {stream.icon}
                      </motion.div>
                      
                      <h3 className={`text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 drop-shadow-lg transition-colors break-anywhere ${isSelected ? 'text-emerald-300' : isDisabled ? 'text-white/60' : 'text-white'}`}>
                        {stream.title}
                      </h3>
                      
                      <p className={`text-sm sm:text-lg mb-6 sm:mb-8 font-medium transition-opacity ${isDisabled ? 'text-white/40' : 'text-white/90'}`}>
                        {isSelected ? 'Click to Review/Edit Marks' : stream.subtitle}
                        {isMatricRestricted && (
                          <span className="block mt-2 px-3 py-1 bg-red-500/80 text-xs rounded-full font-bold animate-pulse">
                            Requires Biology background
                          </span>
                        )}
                      </p>
                      
                      <motion.div
                        className={`px-8 py-3 backdrop-blur-sm rounded-2xl border text-white font-semibold text-sm uppercase tracking-wider shadow-lg transition-all ${
                          isSelected 
                            ? 'bg-emerald-500/80 border-emerald-400 scale-105' 
                            : isDisabled 
                              ? 'bg-white/10 border-white/20 opacity-50 cursor-not-allowed' 
                              : 'bg-white/20 border-white/30 hover:bg-white/30 hover:scale-105 hover:border-emerald-400/50'
                        }`}
                        whileHover={isDisabled ? {} : { scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                      >
                        {isSelected ? 'REVIEW' : isMatricRestricted ? 'Not Available' : 'Select Stream'}
                      </motion.div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                        SELECTED
                      </div>
                    )}

                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 blur-xl scale-150 ${isSelected ? '' : 'hidden'}`}
                      animate={isSelected ? { 
                        opacity: [0, 0.3, 0],
                        scale: [1.5, 1.8, 1.5]
                      } : {}}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          {currentMatricStream && (
            <motion.p 
              className="mt-12 text-lg text-yellow-400/90 max-w-2xl text-center bg-yellow-500/10 p-6 rounded-2xl border-2 border-yellow-400/30 font-semibold shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              📚 Matric {currentMatricStream.toUpperCase()}: {allowedStreams.length} streams available
            </motion.p>
          )}
          {isReviewMode && (
            <motion.p 
              className="mt-4 text-lg text-emerald-400/90 max-w-2xl text-center bg-emerald-500/10 p-6 rounded-2xl border-2 border-emerald-400/30 font-semibold shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ✏️ Review Mode: Only your selected <span className="font-bold underline">{reviewStream?.replace('-', ' ').toUpperCase()}</span> stream is editable
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

export default IntermediateStream;

