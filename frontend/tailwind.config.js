export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
        "glow-lg": "0 35px 60px -15px rgba(139, 92, 246, 0.4)",
      },
      backgroundImage: {
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, #7c3aed, #ec4899, #0ea5e9, #22c55e, #7c3aed)",
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
