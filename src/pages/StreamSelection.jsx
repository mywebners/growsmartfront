import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

function StreamSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reviewingMatric, stream: reviewStream } = location.state || {};
  const isReviewMode = reviewingMatric && reviewStream;

  const streams = [
    {
      id: "bio",
      title: "Science (Biology)",
      subtitle: "Medical, Biotech, Life Sciences",
      color: "from-[#0056d2] to-[#0044a8]",
      icon: "🧬",
      border: "hover:border-[#2f7de1] hover:shadow-[#0056d2]/20",
      gradient: "from-[#0056d2]/20 to-[#2f7de1]/20"
    },
    {
      id: "cs",
      title: "Science (Computer)",
      subtitle: "Engineering, IT, Software Development",
      color: "from-[#2f7de1] to-[#0056d2]",
      icon: "💻",
      border: "hover:border-[#378edd] hover:shadow-[#0056d2]/20",
      gradient: "from-[#2f7de1]/20 to-[#378edd]/20"
    },
    {
      id: "arts",
      title: "Arts & Commerce",
      subtitle: "Business, Law, Design, Humanities",
      color: "from-[#378edd] to-[#003a9b]",
      icon: "🎨",
      border: "hover:border-[#0056d2] hover:shadow-[#0056d2]/20",
      gradient: "from-[#378edd]/20 to-[#0056d2]/20"
    }
  ];

  const handleStreamClick = (streamId) => {
    if (isReviewMode && streamId !== reviewStream) return;
    navigate("/matric-subjects", { state: { stream: streamId } });
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex flex-col items-center justify-center">
      <motion.div
        className="glass-card p-16 max-w-4xl w-full backdrop-blur-xl shadow-2xl career-glow text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-16">
          <div className={`text-7xl mb-8 mx-auto w-32 h-32 bg-gradient-to-br ${streams.find(s => s.id === reviewStream)?.color || 'from-[#0056d2] to-[#0044a8]'} rounded-3xl flex items-center justify-center shadow-2xl career-glow`}>
            {isReviewMode ? '✏️' : '🌿'}
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#003a9b] via-[#0056d2] to-[#2f7de1] bg-clip-text text-transparent mb-6">
            {isReviewMode ? 'Review Your Stream' : 'Choose Your Stream'}
          </h1>
          {isReviewMode ? (
            <p className="text-xl text-[#2b2b2b] max-w-2xl mx-auto leading-relaxed">
              Edit marks for your <span className="font-bold text-[#2f7de1]">{reviewStream?.toUpperCase()}</span> stream
            </p>
          ) : (
            <p className="text-xl text-[#2b2b2b] max-w-2xl mx-auto leading-relaxed">
              Select the stream you studied in Matric - this shapes your next recommendations
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          {streams.map((stream, index) => {
            const isSelected = isReviewMode && stream.id === reviewStream;
            const isDisabled = isReviewMode && !isSelected;
            return (
              <motion.button
                key={stream.id}
                className={`
                  group glass-card p-12 backdrop-blur-xl border-2 border-[#d9d9d9] transition-all duration-500 relative overflow-hidden h-64 flex flex-col items-center justify-center
                  ${isSelected 
                    ? 'border-[#2f7de1] bg-[#0056d2]/20 ring-4 ring-[#378edd]/50 shadow-2xl shadow-[#0056d2]/50 cursor-pointer' 
                    : isDisabled 
                      ? 'opacity-50 cursor-not-allowed hover:opacity-50 hover:scale-100 hover:border-[#d9d9d9] hover:shadow-none' 
                      : `hover:bg-[#0056d2]/12 ${stream.border}`
                  }
                  ${isDisabled ? '' : 'hover:shadow-2xl'}
                `}
                onClick={() => handleStreamClick(stream.id)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={isDisabled ? {} : { scale: 1.05, y: -10 }}
                whileTap={isDisabled ? {} : { scale: 0.98 }}
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{stream.icon}</div>
                <h3 className={`text-3xl font-bold mb-4 transition-colors ${isSelected ? 'text-[#9ec5ff] drop-shadow-lg' : isDisabled ? 'text-[#6a6a6a]' : 'text-[#1a1a1a] group-hover:text-[#2f7de1]'}`}>{stream.title}</h3>
                <p className={`text-lg transition-opacity ${isDisabled ? 'text-[#8a8a8a]' : 'text-[#5b5b5b]'}`}>
                  {isSelected ? 'Click to Review/Edit Marks' : stream.subtitle}
                </p>
                {isSelected && (
                  <div className="absolute -top-4 -right-4 bg-[#0056d2] text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    SELECTED
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-r ${stream.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl ${isDisabled ? 'opacity-0' : ''}`} />
              </motion.button>
            );
          })}
        </div>

        {isReviewMode && (
          <motion.p 
            className="mt-16 text-lg text-[#9ec5ff] max-w-2xl text-center bg-[#0056d2]/10 p-4 rounded-2xl border border-[#2f7de1]/30 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Review Mode: Only your selected {reviewStream?.toUpperCase()} stream is editable
          </motion.p>
        )}
        {!isReviewMode && (
          <motion.p 
            className="mt-16 text-lg text-[#6a6a6a] max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your stream choice opens specific career pathways
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default StreamSelection;

