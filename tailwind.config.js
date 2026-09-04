export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#174ea6",
        ink: "#172033",
        success: "#16803c",
        danger: "#c53131",
        warning: "#a15c07",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(23, 32, 51, 0.08)",
      },
    },
  },
  plugins: [],
};
