export const getCurrentMonthName = () => {
  return new Intl.DateTimeFormat("es-ES", { month: "long" })
    .format(new Date())
    .replace(/^\w/, (c) => c.toUpperCase());
};
